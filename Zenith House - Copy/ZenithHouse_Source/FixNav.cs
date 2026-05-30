using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

class Program
{
    static void Main()
    {
        string dir = @"c:\Users\ADMIN\Downloads\UI UX Zenith HOuse\Zenith House\ZenithHouse_Source";
        int count = 0;
        foreach (string f in Directory.GetFiles(dir, "*.html"))
        {
            if (f.EndsWith("index.html") || f.EndsWith("about.html") || f.EndsWith("contact.html")) continue;

            string content = File.ReadAllText(f, Encoding.UTF8);

            int menuStartIdx = content.IndexOf("<div class=\"mobile-menu-items\">");
            if (menuStartIdx == -1) continue;
            int menuEndIdx = content.IndexOf("</div>", menuStartIdx);
            if (menuEndIdx == -1) continue;

            string preMenu = content.Substring(0, menuStartIdx);
            string menuHTML = content.Substring(menuStartIdx, menuEndIdx - menuStartIdx);
            string postMenu = content.Substring(menuEndIdx);

            // Replace broken blocks
            menuHTML = Regex.Replace(menuHTML,
                @"<li class=""has-submenu"">\s*<a href=""index\.html"">Trang ch[^<]*?<i class=""fa-solid fa-chevron-down""></i></a>\s*<ul class=""submenu"">\s*</ul>\s*</li>",
                @"<li class=""has-submenu"">
                                            <a href=""index.html"">Trang chủ <i class=""fa-solid fa-chevron-down""></i></a>
                                            <ul class=""submenu"">
                                                <li><a href=""about.html"">Về chúng tôi</a></li>
                                                <li><a href=""contact.html"">Liên hệ</a></li>
                                            </ul>
                                        </li>", RegexOptions.Singleline);

            menuHTML = Regex.Replace(menuHTML,
                @"<li class=""has-submenu active"">\s*<a href=""index\.html"">Trang ch[^<]*?<i class=""fa-solid fa-chevron-down""></i></a>\s*<ul class=""submenu"">\s*</ul>\s*</li>",
                @"<li class=""has-submenu active"">
                                            <a href=""index.html"">Trang chủ <i class=""fa-solid fa-chevron-down""></i></a>
                                            <ul class=""submenu"">
                                                <li><a href=""about.html"">Về chúng tôi</a></li>
                                                <li><a href=""contact.html"">Liên hệ</a></li>
                                            </ul>
                                        </li>", RegexOptions.Singleline);

            File.WriteAllText(f, preMenu + menuHTML + postMenu, new UTF8Encoding(false));
            count++;
        }
        Console.WriteLine("Fixed " + count + " files.");
    }
}
