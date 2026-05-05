#!/usr/bin/env python3
"""Add lazy loading to images in HTML files"""

import os

html_files = [
    "C:/Users/abdel/Desktop/my_sites/Jabarai/index.html",
    "C:/Users/abdel/Desktop/my_sites/Jabarai/tool.html",
    "C:/Users/abdel/Desktop/my_sites/Jabarai/user_page.html",
    "C:/Users/abdel/Desktop/my_sites/Jabarai/about.html",
    "C:/Users/abdel/Desktop/my_sites/Jabarai/contact.html",
    "C:/Users/abdel/Desktop/my_sites/Jabarai/help_us.html",
    "C:/Users/abdel/Desktop/my_sites/Jabarai/login.html",
    "C:/Users/abdel/Desktop/my_sites/Jabarai/register.html"
]

for filepath in html_files:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - not found")
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Count images without loading="lazy"
    import re
    img_pattern = r'<img([^>]+)>'
    imgs = re.findall(img_pattern, content)
    
    updated_count = 0
    for img_attrs in imgs:
        if 'loading=' not in img_attrs and 'src=' in img_attrs:
            # Add loading="lazy" before the closing >
            old_img = f'<img{img_attrs}>'
            new_img = f'<img{img_attrs} loading="lazy">'
            content = content.replace(old_img, new_img, 1)
            updated_count += 1
    
    if updated_count > 0:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Added lazy loading to {updated_count} images in {os.path.basename(filepath)}")
    else:
        print(f"No images needed lazy loading in {os.path.basename(filepath)}")

print("\nDone!")
