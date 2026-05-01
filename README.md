# Jabarai.

> Your AI tools hub — discover, compare, and explore the best AI tools in one place.

## About

Jabarai is a static AI tools directory website. Browse 400+ AI tools with fuzzy search, filters by category/pricing/rating, sorting, and pagination — all running client-side with no backend required.

## Features

- **Fuzzy search** powered by [Fuse.js](https://www.fusejs.io/) with weighted field matching
- **Multi-filter system** — category, pricing, rating, and sort options
- **Client-side pagination** (20 tools per page)
- **Tool detail pages** with features, pricing, pros/cons, alternatives, and FAQ
- **URL state persistence** — filters saved to URL params and localStorage
- **Responsive design** — works on desktop, tablet, and mobile
- **Skeleton loaders** for smooth loading experience

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- [Fuse.js](https://www.fusejs.io/) — fuzzy search
- [Font Awesome](https://fontawesome.com/) — icons
- [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter) — typography

## Project Structure

```
├── index.html              # Main directory page
├── tool.html               # Tool detail page
├── login.html              # Login page
├── register.html           # Registration page
├── about.html              # About page
├── contact.html            # Contact page
├── help_us.html            # Donate/support page
├── 404.html                # Custom 404 page
├── assets/
│   ├── css/
│   │   ├── styles.css          # Main stylesheet
│   │   ├── footer-components.css
│   │   ├── tool.css            # Tool detail page styles
│   │   └── auth.css            # Login/register shared styles
│   ├── js/
│   │   └── main.js             # Search, filter & pagination logic
│   ├── data/
│   │   ├── tools1.json         # Tool data (100 tools each)
│   │   ├── tools2.json
│   │   ├── tools3.json
│   │   └── tools4.json
│   └── images/
└── README.md
```

## Getting Started

1. Clone the repo
2. Open `index.html` in your browser (or serve with any static file server)

```bash
# Example with Python
python -m http.server 8000

# Example with Node.js
npx serve .
```

## License

All rights reserved.
