#!/usr/bin/env python3
"""Fix the index.html in Desktop folder by inlining white-section"""

# Read the Desktop folder index.html
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# The white-section content to inline
white_section = '''    <!-- White Section -->
    <section class="white-section">
        <div class="home-title">
            <h1 class="home-title__subtitle">Welcome to Jabarai<span style="color: #0ea5e9;">.</span></h1>
            <div class="orange-rectangle">
                <div class="orange-content">
                    <h2 class="home-title__subtitle">Get Started with Jabarai<span style="color: #0ea5e9;">.</span></h2>
                    <ul class="orange-list">
                        <li><span class="checkmark">✓</span> Save and organize your favorite tools</li>
                        <li><span class="checkmark">✓</span> Personalized recommendations for your workflow</li>
                        <li><span class="checkmark">✓</span> Be first to know about new AI tool launches</li>
                        <li><span class="checkmark">✓</span> Dark mode for comfortable browsing</li>
                    </ul>
                    <a href="register.html" class="orange-button">
                        <i class="fas fa-crown" style="margin-right: 8px;"></i>Create Account
                    </a>
                </div>
                <img src="assets/images/ai_library2.png" alt="AI Library" class="orange-image" loading="lazy">
            </div>
        </div>

        <!-- Trust Section -->
        <div class="trust-section">
            <h2 class="home-title__subtitle">The AI tools directory trusted by thousands of users</h2>
            <p class="home-title__paragraph">Jabarai is the curated AI tools directory trusted by thousands. Browse, compare, and discover tools you need to work smarter, all hand-verified, all updated daily, all free. Start exploring now.</p>

            <div class="trust-stats">
                <div class="trust-stat">
                    <span class="trust-stat-number" id="tools-count-stat">+300 </span>
                    <span class="trust-stat-label">AI Tools Listed</span>
                </div>
                <div class="trust-stat">
                    <span class="trust-stat-number">+20 </span>
                    <span class="trust-stat-label">Categories</span>
                </div>
                <div class="trust-stat">
                    <span class="trust-stat-number">100%</span>
                    <span class="trust-stat-label">Manually Verified</span>
                </div>
                <div class="trust-stat">
                    <span class="trust-stat-number">Daily</span>
                    <span class="trust-stat-label">Updated</span>
                </div>
            </div>
        </div>
    </section>'''

# Pattern to match the old content
old_pattern = '''    <!-- White Section (loaded from index2.html) -->

    <div id="white-section-container"></div>

    <script>

        // Load white section from index2.html

        fetch('index2.html')

            .then(response => response.text())

            .then(html => {

                const parser = new DOMParser();

                const doc = parser.parseFromString(html, 'text/html');

                const whiteSection = doc.querySelector('.white-section');

                if (whiteSection) {

                    document.getElementById('white-section-container').appendChild(whiteSection);

                }

            })

            .catch(error => console.error('Error loading white section:', error));

    </script>'''

# Replace
if old_pattern in content:
    content = content.replace(old_pattern, white_section)
    print("Successfully replaced white-section content")
else:
    print("Pattern not found - checking for variations...")
    # Try with different whitespace
    import re
    pattern = r'<!-- White Section \(loaded from index2\.html\) -->.*?fetch\([\'"]index2\.html[\'"]\).*?\}\)\s*\}\s*\}\s*\)\s*\.catch\(.*?\}\s*\}\s*\);\s*</script>'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.start()] + white_section + content[match.end():]
        print("Replaced using regex pattern")
    else:
        print("Could not find pattern to replace")
        exit(1)

# Write back
with open("C:/Users/abdel/Desktop/my_sites/Jabarai/index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
