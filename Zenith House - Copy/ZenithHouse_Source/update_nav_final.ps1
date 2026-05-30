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

    # Use regex that's known to work in powershell, case-insensitive, ignoring whitespace
    # We will replace all variations of "Trang chủ", "Về chúng tôi", and "Liên hệ"
    
    $menuHTML = [regex]::Replace($menuHTML, '(?si)<li[^>]*>\s*<a href="index\.html">Trang chủ</a>\s*</li>', '<li class="has-submenu">
                                            <a href="index.html">Trang chủ <i class="fa-solid fa-chevron-down"></i></a>
                                            <ul class="submenu">
                                                <li><a href="about.html">Về chúng tôi</a></li>
                                                <li><a href="contact.html">Liên hệ</a></li>
                                            </ul>
                                        </li>')
    
    $menuHTML = [regex]::Replace($menuHTML, '(?si)<li[^>]*>\s*<a href="about\.html">Về chúng tôi</a>\s*</li>', '')
    $menuHTML = [regex]::Replace($menuHTML, '(?si)<li[^>]*>\s*<a href="contact\.html">Liên hệ</a>\s*</li>', '')

    $newContent = $preMenu + $menuHTML + $postMenu
    [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
    $updatedCount++
}

Write-Host "Updated $updatedCount files."
