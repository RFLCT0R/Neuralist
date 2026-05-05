#!/usr/bin/env python3
"""Update main.js to load single tools.json file"""

with open("C:/Users/abdel/Desktop/my_sites/Jabarai/assets/js/main.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the multi-file loading with single file loading
old_loading = '''                const [response1, response2, response3, response4, response5] = await Promise.all([

                    

                    

                    

                    fetch('assets/data/tools1.json'),

                    

                    

                    

                    fetch('assets/data/tools2.json'),

                    

                    

                    

                    fetch('assets/data/tools3.json'),

                    

                    

                    

                    fetch('assets/data/tools4.json'),

                    

                    

                    

                    fetch('assets/data/tools5.json'),

                    

                    

                    

                ]);

                

                

                

                

                const tools1 = await response1.json();

                

                

                

                const tools2 = await response2.json();

                

                

                

                const tools3 = await response3.json();

                

                

                

                const tools4 = await response4.json();

                

                

                

                const tools5 = await response5.json();

                

                

                

                

                allTools = [...tools1, ...tools2, ...tools3, ...tools4, ...tools5];'''

new_loading = '''                const response = await fetch('assets/data/tools.json');
                allTools = await response.json();'''

if old_loading in content:
    content = content.replace(old_loading, new_loading)
    print("Updated main.js to load single tools.json")
else:
    # Try simpler pattern
    old_pattern = "fetch('assets/data/tools1.json')"
    if old_pattern in content:
        # Find and replace the whole Promise.all block
        import re
        pattern = r"const \[response1, response2, response3, response4, response5\] = await Promise\.all\(\[.*?\]\);.*?const tools5 = await response5\.json\(\);.*?allTools = \[\.\.\.tools1, \.\.\.tools2, \.\.\.tools3, \.\.\.tools4, \.\.\.tools5\];"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            content = content[:match.start()] + new_loading + content[match.end():]
            print("Updated main.js using regex pattern")
        else:
            print("Could not find pattern with regex")
    else:
        print("Pattern not found - may already be updated")

# Write back
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/assets/js/main.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
