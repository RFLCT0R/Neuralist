#!/usr/bin/env python3
"""Add Open Graph meta tags to index.html"""

og_tags = '''    <!-- Open Graph / Social Media Meta Tags -->
    <meta property="og:title" content="Jabarai | Your AI Tools Hub">
    <meta property="og:description" content="Discover the best AI tools, all in one place. 300+ curated, human-verified AI tools for productivity, creativity, and work.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://jabarai.com">
    <meta property="og:image" content="assets/images/logo.png">
    <meta property="og:site_name" content="Jabarai">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Jabarai | Your AI Tools Hub">
    <meta name="twitter:description" content="Discover the best AI tools, all in one place. 300+ curated, human-verified AI tools.">
    <meta name="twitter:image" content="assets/images/logo.png">
'''

# Read the file
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Find </head> and insert OG tags before it
if '</head>' in content:
    content = content.replace('</head>', og_tags + '</head>')
    print("Added Open Graph tags to index.html")
else:
    print("Could not find </head> tag")
    exit(1)

# Also add better meta description if it doesn't exist
if 'name="description"' not in content:
    desc_tag = '''    <meta name="description" content="Discover the best AI tools, all in one place. 300+ curated, human-verified AI tools for productivity, creativity, and work. Browse, compare, and find the perfect AI tool for your needs.">
'''
    content = content.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n' + desc_tag)
    print("Added meta description")

# Write back
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
