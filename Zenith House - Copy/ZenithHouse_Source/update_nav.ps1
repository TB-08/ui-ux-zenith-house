$dir = "c:\Users\ADMIN\Downloads\UI UX Zenith HOuse\Zenith House\ZenithHouse_Source"
$files = Get-ChildItem -Path $dir -Filter "*.html"

$updatedCount = 0

foreach ($file in $files) {
    if ($file.Name -eq "index.html" -or $file.Name -eq "about.html" -or $file.Name -eq "contact.html") {
        continue
    }

    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    $menuStartIdx = $content.IndexOf('<div class="mobile-menu-items">')
    if ($menuStartIdx -eq -1) { continue }
    
    $menuEndIdx = $content.IndexOf('</div>', $menuStartIdx)
    if ($menuEndIdx -eq -1) { continue }
    
    $preMenu = $content.Substring(0, $menuStartIdx)
    $menuHTML = $content.Substring($menuStartIdx, $menuEndIdx - $menuStartIdx)
    $postMenu = $content.Substring($menuEndIdx)
    
    if ($menuHTML.Contains('Trang chủ <i class="fa-solid fa-chevron-down"></i>')) {
        continue
    }

    # Replace Trang chủ link
    # Using regex replace. Powershell regex is case insensitive by default and multiline requires (?m)
    # But since we capture the whole block, simple regex will do.
    $pattern = '(?s)(\s*)<li(?: class="active")?>\s*<a href="index\.html">Trang chủ</a>\s*</li>'
    if ($menuHTML -match $pattern) {
        $spaces = $matches[1]
        $activeClass = ""
        if ($menuHTML -match '<li class="active">\s*<a href="index\.html">Trang chủ</a>') {
            $activeClass = ' active'
        }
        
        $replacement = "${spaces}<li class=""has-submenu${activeClass}"">`n${spaces}    <a href=""index.html"">Trang chủ <i class=""fa-solid fa-chevron-down""></i></a>`n${spaces}    <ul class=""submenu"">`n${spaces}        <li><a href=""about.html"">Về chúng tôi</a></li>`n${spaces}        <li><a href=""contact.html"">Liên hệ</a></li>`n${spaces}    </ul>`n${spaces}</li>"
        $menuHTML = $menuHTML -replace $pattern, $replacement
    }
    
    # Remove old links using regex
    $menuHTML = $menuHTML -replace '(?s)\s*<li>\s*<a href="about\.html">Về chúng tôi</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li class="active">\s*<a href="about\.html">Về chúng tôi</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li><a href="about\.html">Về chúng tôi</a></li>', ''
    
    $menuHTML = $menuHTML -replace '(?s)\s*<li>\s*<a href="contact\.html">Liên hệ</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li class="active">\s*<a href="contact\.html">Liên hệ</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li><a href="contact\.html">Liên hệ</a></li>', ''
    
    $newContent = $preMenu + $menuHTML + $postMenu
    [System.IO.File]::WriteAllText($file.FullName, $newContent)
    $updatedCount++
}

Write-Host "Updated $updatedCount files."
