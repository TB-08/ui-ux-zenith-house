$dir = "c:\Users\ADMIN\Downloads\UI UX Zenith HOuse\Zenith House\ZenithHouse_Source"
$files = Get-ChildItem -Path $dir -Filter "*.html"

$updatedCount = 0

foreach ($file in $files) {
    if ($file.Name -eq "index.html" -or $file.Name -eq "about.html" -or $file.Name -eq "contact.html") {
        continue
    }

    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
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
    $pattern1 = '(?s)(\s*)<li class="active">\s*<a href="index\.html">Trang chủ</a>\s*</li>'
    $pattern2 = '(?s)(\s*)<li>\s*<a href="index\.html">Trang chủ</a>\s*</li>'

    $replacement1 = '${1}<li class="has-submenu active">
${1}    <a href="index.html">Trang chủ <i class="fa-solid fa-chevron-down"></i></a>
${1}    <ul class="submenu">
${1}        <li><a href="about.html">Về chúng tôi</a></li>
${1}        <li><a href="contact.html">Liên hệ</a></li>
${1}    </ul>
${1}</li>'

    $replacement2 = '${1}<li class="has-submenu">
${1}    <a href="index.html">Trang chủ <i class="fa-solid fa-chevron-down"></i></a>
${1}    <ul class="submenu">
${1}        <li><a href="about.html">Về chúng tôi</a></li>
${1}        <li><a href="contact.html">Liên hệ</a></li>
${1}    </ul>
${1}</li>'

    $menuHTML = $menuHTML -replace $pattern1, $replacement1
    $menuHTML = $menuHTML -replace $pattern2, $replacement2
    
    # Remove old links
    $menuHTML = $menuHTML -replace '(?s)\s*<li>\s*<a href="about\.html">Về chúng tôi</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li class="active">\s*<a href="about\.html">Về chúng tôi</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li><a href="about\.html">Về chúng tôi</a></li>', ''
    
    $menuHTML = $menuHTML -replace '(?s)\s*<li>\s*<a href="contact\.html">Liên hệ</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li class="active">\s*<a href="contact\.html">Liên hệ</a>\s*</li>', ''
    $menuHTML = $menuHTML -replace '(?s)\s*<li><a href="contact\.html">Liên hệ</a></li>', ''
    
    $newContent = $preMenu + $menuHTML + $postMenu
    [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
    $updatedCount++
}

Write-Host "Updated $updatedCount files."
