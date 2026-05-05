#!/usr/bin/env python3
"""Add dynamic tool count to index.html main.js"""

# Read main.js
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/assets/js/main.js", "r", encoding="utf-8") as f:
    content = f.read()

# Find the loadTools function and add dynamic count update after allTools is populated
old_code = '''                allTools = [...tools1, ...tools2, ...tools3, ...tools4, ...tools5];

                
                
                
                
                // Initialize Fuse.js'''

new_code = '''                allTools = [...tools1, ...tools2, ...tools3, ...tools4, ...tools5];
                
                // Update tool count stat dynamically
                const toolsCountStat = document.getElementById('tools-count-stat');
                if (toolsCountStat) {
                    toolsCountStat.textContent = '+' + allTools.length + ' ';
                }
                
                // Initialize Fuse.js'''

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Added dynamic tool count to main.js")
else:
    print("Could not find pattern - may already be updated or code changed")

# Write back
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/assets/js/main.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
