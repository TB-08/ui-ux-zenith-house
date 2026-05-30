$token = "YOUR_GITHUB_TOKEN"
$owner = "TB-08"
$repo = "zenith-house"
$branch = "main"
$sourceDir = "."

# Force TLS 1.2 for secure API requests
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# GitHub API headers
$headers = @{
    "Authorization" = "token $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "PowerShell"
}

function Invoke-GitHubApi {
    param (
        [string]$Method,
        [string]$Endpoint,
        [object]$Body
    )
    $uri = "https://api.github.com/repos/$owner/$repo/$Endpoint"
    $params = @{
        Uri = $uri
        Headers = $headers
        Method = $Method
        ContentType = "application/json"
    }
    if ($Body) {
        $params.Body = ($Body | ConvertTo-Json -Depth 10 -Compress)
    }
    return Invoke-RestMethod @params
}

try {
    Write-Host "Fetching latest commit on branch '$branch'..."
    $refData = Invoke-GitHubApi -Method GET -Endpoint "git/ref/heads/$branch"
    $latestCommitSha = $refData.object.sha
    Write-Host "Latest Commit SHA: $latestCommitSha"

    Write-Host "Fetching latest commit tree..."
    $commitData = Invoke-GitHubApi -Method GET -Endpoint "git/commits/$latestCommitSha"
    $baseTreeSha = $commitData.tree.sha
    Write-Host "Base Tree SHA: $baseTreeSha"

    Write-Host "Gathering files..."
    $files = Get-ChildItem -Path $sourceDir -Recurse -File
    $treeItems = @()

    $total = $files.Count
    $current = 0

    Write-Host "Uploading $total files..."

    foreach ($file in $files) {
        $current++
        # Resolve path relative to sourceDir
        $relativePath = Resolve-Path -Path $file.FullName -Relative
        # Clean relative path prefixes
        $githubPath = $relativePath -replace "^\.\\", "" -replace "^\./", ""
        $githubPath = $githubPath.Replace("\", "/")

        # Skip lists
        if ($githubPath -like "node_modules/*" -or 
            $githubPath -like ".git/*" -or 
            $githubPath -eq "deploy.mjs" -or 
            $githubPath -eq "deploy.ps1" -or 
            $githubPath -eq "check_token.mjs" -or
            $githubPath -eq "update_nav.js" -or
            $githubPath -eq "update_nav.ps1" -or
            $githubPath -eq "update_nav_ascii.ps1" -or
            $githubPath -eq "update_nav_final.ps1" -or
            $githubPath -eq "update_nav_fix.ps1" -or
            $githubPath -eq "FixNav.cs" -or
            $githubPath -eq "FixNav.exe") {
            continue
        }

        # Read file as Base64 to support both binary and text safely
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $base64Content = [System.Convert]::ToBase64String($bytes)

        # Upload Blob
        $blobBody = @{
            content = $base64Content
            encoding = "base64"
        }
        
        Write-Host "[$current/$total] Uploading blob: $githubPath"
        
        try {
            $blobData = Invoke-GitHubApi -Method POST -Endpoint "git/blobs" -Body $blobBody
            
            $treeItems += @{
                path = $githubPath
                mode = "100644"
                type = "blob"
                sha = $blobData.sha
            }
        }
        catch {
            Write-Error "Failed to upload $githubPath : $_"
            throw $_
        }
    }

    Write-Host "Verifying uploaded file SHAs..."
    $invalidItems = $treeItems | Where-Object { -not $_.sha }
    if ($invalidItems) {
        Write-Error "Found $($invalidItems.Count) items with missing SHAs!"
        foreach ($item in $invalidItems) {
            Write-Error "Missing SHA for: $($item.path)"
        }
        throw "Cannot create tree with missing SHAs"
    }

    Write-Host "Creating tree..."
    $treeBody = @{
        tree = $treeItems
    }
    
    try {
        $treeData = Invoke-GitHubApi -Method POST -Endpoint "git/trees" -Body $treeBody
        Write-Host "New Tree SHA: $($treeData.sha)"
    }
    catch {
        Write-Error "Failed to create tree: $_"
        if ($_.Exception.Response) {
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $body = $reader.ReadToEnd()
                Write-Error "GitHub Response Body: $body"
            } catch {}
        }
        throw $_
    }

    Write-Host "Creating commit..."
    $commitBody = @{
        message = "Deploy Zenith House website via PowerShell Rest API"
        tree = $treeData.sha
        parents = @($latestCommitSha)
    }
    $newCommitData = Invoke-GitHubApi -Method POST -Endpoint "git/commits" -Body $commitBody
    Write-Host "New Commit SHA: $($newCommitData.sha)"

    Write-Host "Updating reference..."
    $refBody = @{
        sha = $newCommitData.sha
        force = $true
    }
    Invoke-GitHubApi -Method PATCH -Endpoint "git/refs/heads/$branch" -Body $refBody

    Write-Host "Deployment complete!"
    Write-Host "URL: https://$owner.github.io/$repo/"
}
catch {
    Write-Error $_
}
