#!/usr/bin/env python3
"""Fix tool.html to load from tools.json instead of multiple files"""

with open("C:/Users/abdel/Desktop/my_sites/Jabarai/tool.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the old multi-file loading with single file loading
old_code = "const jsonFiles = ['tools1.json','tools2.json','tools3.json','tools4.json','tools5.json','tools6.json','tools7.json','tools8.json','tools9.json','tools10.json'];"
new_code = "const response = await fetch('assets/data/tools.json');\n                const tools = await response.json();"

if old_code in content:
    # Find and replace the whole block
    old_block = """const jsonFiles = ['tools1.json','tools2.json','tools3.json','tools4.json','tools5.json','tools6.json','tools7.json','tools8.json','tools9.json','tools10.json'];
                const toolsData = await Promise.all(
                    jsonFiles.map(file => fetch(`assets/data/${file}`).then(r => r.json()).catch(() => []))
                );
                const tools = toolsData.flat();"""
    
    new_block = """const response = await fetch('assets/data/tools.json');
                const tools = await response.json();"""
    
    if old_block in content:
        content = content.replace(old_block, new_block)
        print("✓ Fixed tool.html")
    else:
        print("Could not find exact block pattern")
else:
    print("Old pattern not found - may already be fixed")

# Write back
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/tool.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
