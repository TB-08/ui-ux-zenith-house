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
    
    if ($menuHTML.Contains('Trang ch') -and $menuHTML.Contains('fa-chevron-down')) {
        # Already has dropdown
        # But wait, other menus have chevron. We check if it has the submenu code for Trang chu
        if ($menuHTML -match 'Trang ch[^<]*<i class="fa-solid fa-chevron-down"></i>') {
            continue
        }
    }

    # Replace Trang chu link
    $replacement = '<li class="has-submenu">
                                            <a href="index.html">Trang ch&#7911; <i class="fa-solid fa-chevron-down"></i></a>
                                            <ul class="submenu">
                                                <li><a href="about.html">V&#7873; ch&uacute;ng t&ocirc;i</a></li>
                                                <li><a href="contact.html">Li&ecirc;n h&#7879;</a></li>
                                            </ul>
                                        </li>'
    
    # Notice we replace 'Trang chu' regardless of active class, because other pages aren't the homepage
    $menuHTML = [regex]::Replace($menuHTML, '(?si)<li[^>]*>\s*<a href="index\.html">Trang ch[^<]*</a>\s*</li>', $replacement)
    
    # Remove old about and contact links
    $menuHTML = [regex]::Replace($menuHTML, '(?si)<li[^>]*>\s*<a href="about\.html">[^<]*</a>\s*</li>', '')
    $menuHTML = [regex]::Replace($menuHTML, '(?si)<li[^>]*>\s*<a href="contact\.html">[^<]*</a>\s*</li>', '')

    $menuHTML = $menuHTML.Replace('&#7911;', 'ủ').Replace('V&#7873; ch&uacute;ng t&ocirc;i', 'Về chúng tôi').Replace('Li&ecirc;n h&#7879;', 'Liên hệ')

    $newContent = $preMenu + $menuHTML + $postMenu
    [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
    $updatedCount++
}

Write-Host "Updated $updatedCount files."
