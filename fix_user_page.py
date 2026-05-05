#!/usr/bin/env python3
"""Fix user_page.html to load from tools.json instead of tools1.json"""

with open("C:/Users/abdel/Desktop/my_sites/Jabarai/user_page.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace tools1.json with tools.json
old_code = "const response = await fetch('assets/data/tools1.json');"
new_code = "const response = await fetch('assets/data/tools.json');"

if old_code in content:
    content = content.replace(old_code, new_code)
    print("✓ Fixed user_page.html")
else:
    print("Pattern not found - may already be fixed")

# Write back
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/user_page.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
