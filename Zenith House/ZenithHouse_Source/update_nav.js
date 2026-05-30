const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\ADMIN\\Downloads\\UI UX Zenith HOuse\\Zenith House\\ZenithHouse_Source';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

for (const file of files) {
    if (file === 'index.html' || file === 'about.html' || file === 'contact.html') {
        continue;
    }
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Only operate within mobile-menu-items
    const menuStartIdx = content.indexOf('<div class="mobile-menu-items">');
    if (menuStartIdx === -1) continue;

    const menuEndIdx = content.indexOf('</div>', menuStartIdx);
    if (menuEndIdx === -1) continue;

    let preMenu = content.slice(0, menuStartIdx);
    let menuHTML = content.slice(menuStartIdx, menuEndIdx);
    let postMenu = content.slice(menuEndIdx);

    // Check if already modified
    if (menuHTML.includes('Trang chủ <i class="fa-solid fa-chevron-down"></i>')) {
        continue;
    }

    // Replace Trang chủ link
    menuHTML = menuHTML.replace(
        /(\s*)<li( class="active")?>\s*<a href="index\.html">Trang chủ<\/a>\s*<\/li>/,
        (match, spaces, activeClass) => {
            const active = activeClass || '';
            return `${spaces}<li class="has-submenu${active}">
${spaces}    <a href="index.html">Trang chủ <i class="fa-solid fa-chevron-down"></i></a>
${spaces}    <ul class="submenu">
${spaces}        <li><a href="about.html">Về chúng tôi</a></li>
${spaces}        <li><a href="contact.html">Liên hệ</a></li>
${spaces}    </ul>
${spaces}</li>`;
        }
    );

    // Remove Về chúng tôi link
    menuHTML = menuHTML.replace(/\s*<li>\s*<a href="about\.html">Về chúng tôi<\/a>\s*<\/li>/, '');
    menuHTML = menuHTML.replace(/\s*<li class="active">\s*<a href="about\.html">Về chúng tôi<\/a>\s*<\/li>/, '');
    menuHTML = menuHTML.replace(/\s*<li><a href="about\.html">Về chúng tôi<\/a><\/li>/, '');

    // Remove Liên hệ link
    menuHTML = menuHTML.replace(/\s*<li>\s*<a href="contact\.html">Liên hệ<\/a>\s*<\/li>/, '');
    menuHTML = menuHTML.replace(/\s*<li class="active">\s*<a href="contact\.html">Liên hệ<\/a>\s*<\/li>/, '');
    menuHTML = menuHTML.replace(/\s*<li><a href="contact\.html">Liên hệ<\/a><\/li>/, '');

    content = preMenu + menuHTML + postMenu;
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
}

console.log('Updated ' + updatedCount + ' files.');
