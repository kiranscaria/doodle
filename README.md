# Doodle - Google Search Clone

![Landing Page](docs/images/landing_page.png)

## Overview

Doodle is a functional clone of Google Search with an enhanced feature called SearchChat. This project implements two main pages from Google's search experience with high visual and functional fidelity, while adding innovative conversational capabilities not found in the original.

The entire site is "Vibe Coded" with a focus on creating a working UI, with many backend functionalities being mocked to provide a realistic user experience.

## Implemented Pages

### 1. Landing Page
The classic Google homepage with search bar, buttons, and navigation elements.

### 2. Search Page
Complete results page with all standard Google elements:
- Search results and snippets
- Knowledge panels
- "People also ask" section
- Navigation options
- AI Overviews

![Search Page](docs/images/search_page.png)

## Features From Original Google

### Visual Fidelity
- Accurate styling, shadows, and animations
- Matching Google's layout
- Proper centering and spacing of elements

### Interactive Elements
- **Voice Search**: Click the microphone to search by speaking
  
  ![Voice Search](docs/images/reimplementation_voice_search_feature_1.png)
  ![Voice Search Active](docs/images/reimplementation_voice_search_feature_2.png)

- **Google Lens**: Image search functionality with drag-and-drop capability
  
  ![Google Lens](docs/images/google_image_search.png)

- **App Drawer**: Access to Google apps and services
  
  ![App Drawer](docs/images/app_drawer.png)

- **"I'm Feeling Lucky"**: Navigation to Google Doodles page
- **Feedback Modal**: User feedback collection interface
  
  ![Feedback Modal](docs/images/feedback_modal.png)

## SearchChat - Beyond Google's AI Overview

SearchChat is an innovative feature that enhances the search experience by enabling conversational interaction with search results.

> AI Overviews tells you something once. SearchChat lets you talk through the problem, prove each claim, and take your newfound knowledge with you.

![SearchChat in Action](docs/images/search_using_SearchChat.png)

### Key Capabilities
- Ask follow-up questions about search results
- Save notes from your search session
- Integration potential with Google Keep, Docs, and NotebookLM
- Preference saving (enable/disable SearchChat)

### User Control
SearchChat can be disabled through Settings, and your preference is remembered for future sessions.

![Disable SearchChat](docs/images/ability_to_disable_searchchat.png)
![SearchChat Disabled](docs/images/searchchat_disabled.png)

## Technical Notes

- Built using vanilla HTML, CSS, and JavaScript
- Deployed via Vercel
- Focuses on frontend implementation with mocked backend responses
- Implements Google's non-signed-in search experience

## Setup and Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd doodle

# Install dependencies
npm install

# Start the development server
npm start
```

## Implementation Considerations

This project references the non-signed-in Google search experience. Google's actual search results vary based on:
- User authentication status
- Personalization settings
- Geographic region
- Browser and device settings

## Future Enhancements

- Backend integration for real search functionality
- Expanded SearchChat capabilities
- Responsive design improvements
- Additional Google features and pages