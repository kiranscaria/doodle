// Common functionality for both pages
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page
    const isSearchPage = window.location.pathname.includes('search.html');
    
    // Handle search functionality
    setupSearchFunctionality(isSearchPage);
    
    // Setup page-specific functionality
    if (isSearchPage) {
        setupSearchPageInteractions();
    } else {
        setupLandingPageInteractions();
    }
});

/**
 * Sets up search functionality for both pages
 * @param {boolean} isSearchPage - Whether this is the search results page
 */
function setupSearchFunctionality(isSearchPage) {
    // Get search elements
    const searchInput = document.querySelector('.search-input');
    const searchBox = document.querySelector('.search-box');
    const searchButton = isSearchPage ? 
        document.querySelector('.search-button') : 
        document.querySelector('.search-btn');
    
    // Focus on search input when page loads on landing page
    if (!isSearchPage && searchInput) {
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }
    
    // Handle search submission
    if (searchInput && searchButton) {
        // Search on enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // Search on button click
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }

    // Add hover effect to search box
    if (searchBox) {
        searchBox.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 1px 6px rgba(32, 33, 36, 0.28)';
        });
        
        searchBox.addEventListener('mouseleave', function() {
            if (!searchInput.matches(':focus')) {
                this.style.boxShadow = '';
            }
        });
        
        searchInput.addEventListener('focus', function() {
            searchBox.style.boxShadow = '0 1px 6px rgba(32, 33, 36, 0.28)';
        });
        
        searchInput.addEventListener('blur', function() {
            searchBox.style.boxShadow = '';
        });
    }
    
    // Clear search button functionality (search page only)
    if (isSearchPage) {
        const clearButton = document.querySelector('.search-clear');
        if (clearButton && searchInput) {
            clearButton.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.focus();
            });
        }
    }
}

/**
 * Performs search and navigates to search page
 * @param {string} query - Search query
 */
function performSearch(query) {
    if (query && query.trim() !== '') {
        // In a real app, this would make an API call
        // For now, we'll just navigate to the search page with the query
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

/**
 * Sets up landing page specific interactions
 */
function setupLandingPageInteractions() {
    // "I'm Feeling Lucky" button
    const luckyButton = document.querySelector('.lucky-btn');
    if (luckyButton) {
        luckyButton.addEventListener('click', function() {
            // Direct to the official Google Doodles page
            window.location.href = 'https://www.google.com/doodles';
        });
    }
}

/**
 * Sets up search page specific interactions
 */
function setupSearchPageInteractions() {
    // Parse the query from URL and populate search input
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const searchInput = document.querySelector('.search-input');
    
    if (query && searchInput) {
        searchInput.value = decodeURIComponent(query);
        document.title = `${query} - Google Search`;
    }
    
    // Handle People Also Ask accordion
    const paaItems = document.querySelectorAll('.paa-item');
    paaItems.forEach(item => {
        item.addEventListener('click', function() {
            const arrow = this.querySelector('.paa-arrow');
            if (arrow.textContent === '▼') {
                arrow.textContent = '▲';
                // In a real app, this would fetch content for the answer
                const answer = document.createElement('div');
                answer.className = 'paa-answer';
                answer.innerHTML = '<p>This would display the answer to the selected question.</p>';
                this.after(answer);
            } else {
                arrow.textContent = '▼';
                const answer = this.nextElementSibling;
                if (answer && answer.className === 'paa-answer') {
                    answer.remove();
                }
            }
        });
    });
    
    // Handle voice search
    const voiceSearch = document.querySelector('.voice-search');
    if (voiceSearch) {
        voiceSearch.addEventListener('click', function() {
            alert('Voice search activated! (This would use the Web Speech API in a real implementation)');
        });
    }
    
    // Handle camera search
    const cameraSearch = document.querySelector('.camera-search');
    if (cameraSearch) {
        cameraSearch.addEventListener('click', function() {
            alert('Image search activated! (This would use the camera API in a real implementation)');
        });
    }
}
