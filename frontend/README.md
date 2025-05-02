# Google Clone

This project is a frontend clone of Google, including both the landing page and search results page. The project aims to replicate the visual appearance and basic functionality of Google's search interface.

## Features

- Landing page that visually resembles Google's homepage
- Search results page with AI Overview feature
- Responsive design that works on desktop and mobile devices
- Basic search functionality (frontend only)
- People also ask accordion
- Knowledge panel

## Structure

The project is organized as follows:

```
frontend/
├── css/
│   ├── styles.css       # Styles for landing page
│   └── search.css       # Styles for search results page
├── js/
│   └── script.js        # JavaScript for both pages
├── images/              # Image assets
├── data/                # Dummy data for search results
├── index.html           # Landing page
└── search.html          # Search results page
```

## How to Use

1. Open `index.html` in a web browser to view the landing page
2. Type a search query in the search box and press Enter or click "Google Search"
3. This will take you to the search results page (`search.html`) with a pre-populated query

## Implementation Notes

- This is a frontend-only implementation with no actual search functionality
- Search results are simulated with dummy data
- The "I'm Feeling Lucky" button redirects to Google Doodles (in a real implementation, it would take you directly to the first search result)

## Credits

This project was created as a learning exercise and is not affiliated with Google.
