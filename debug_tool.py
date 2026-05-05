#!/usr/bin/env python3
"""Add better error debugging to tool.html"""

with open("C:/Users/abdel/Desktop/my_sites/Jabarai/tool.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the error catch block with better logging
old_error = """} catch(e) {
                console.error(e);
                document.querySelector('.tool-container').innerHTML = '<p style="text-align:center;color:#888;padding:40px;">Error loading tool.</p>';
            }"""

new_error = """} catch(e) {
                console.error('Tool load error:', e);
                console.error('Error stack:', e.stack);
                document.querySelector('.tool-container').innerHTML = '<p style="text-align:center;color:#888;padding:40px;">Error loading tool: ' + e.message + '</p>';
            }"""

if old_error in content:
    content = content.replace(old_error, new_error)
    print("✓ Added better error logging")
else:
    print("Pattern not found")

# Also add a check for response.ok
old_fetch = """try {
                const response = await fetch('assets/data/tools.json');
                const tools = await response.json();"""

new_fetch = """try {
                const response = await fetch('assets/data/tools.json');
                if (!response.ok) {
                    throw new Error('Failed to load tools: ' + response.status + ' ' + response.statusText);
                }
                const tools = await response.json();"""

if old_fetch in content:
    content = content.replace(old_fetch, new_fetch)
    print("✓ Added response.ok check")
else:
    print("Fetch pattern not found")

# Write back
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/tool.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
