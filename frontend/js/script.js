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
    
    // Don't automatically focus on search input when page loads
    // This ensures the trending searches dropdown only appears when clicked
    
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
    // Setup I'm Feeling Lucky button
    const luckyButton = document.querySelector('.lucky-btn');
    if (luckyButton) {
        luckyButton.addEventListener('click', function() {
            window.location.href = 'https://www.google.com/doodles';
        });
    }

    // Setup trending searches dropdown
    setupTrendingSearches();

    // Setup Google Lens dialog
    setupGoogleLensDialog();
    
    // Setup voice search functionality
    setupVoiceSearch();

    // Setup app drawer
    setupAppDrawer();
}

/**
 * Sets up the app drawer toggle functionality
 */
function setupAppDrawer() {
    const appsToggle = document.getElementById('apps-toggle');
    const appDrawer = document.getElementById('app-drawer');
    
    if (appsToggle && appDrawer) {
        // Toggle app drawer on click
        appsToggle.addEventListener('click', function(e) {
            e.preventDefault();
            appDrawer.classList.toggle('show');
        });
        
        // Close app drawer when clicking outside
        document.addEventListener('click', function(e) {
            if (!appDrawer.contains(e.target) && !appsToggle.contains(e.target)) {
                appDrawer.classList.remove('show');
            }
        });
        
        // Prevent drawer from closing when clicking inside it
        appDrawer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close app drawer when pressing escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                appDrawer.classList.remove('show');
            }
        });
    }
}

/**
 * Sets up trending searches dropdown functionality
 */
function setupTrendingSearches() {
    const searchInput = document.querySelector('.search-input');
    const searchBox = document.querySelector('.search-box');
    const trendingDropdown = document.querySelector('.trending-searches-dropdown');
    
    if (searchInput && trendingDropdown) {
        // Ensure dropdown is hidden by default
        trendingDropdown.style.display = 'none';
        
        // Show trending searches only when search box is clicked, but not when clicking mic or lens icons
        searchBox.addEventListener('click', function(event) {
            // Check if the click was on the microphone or camera icons
            const isMicClick = event.target.closest('.voice-search');
            const isCameraClick = event.target.closest('.camera-search');
            
            // Only show trending searches if not clicking on mic or camera
            if (!isMicClick && !isCameraClick) {
                trendingDropdown.style.display = 'block';
                searchBox.style.borderRadius = '24px 24px 0 0';
                searchBox.style.borderBottomColor = 'transparent';
                searchBox.style.boxShadow = '0 1px 6px rgba(32, 33, 36, 0.28)';
                searchInput.focus();
            }
        });
        
        // Remove the automatic focus on page load
        // (This is handled in setupSearchFunctionality, we'll modify that next)
        
        // Hide trending searches when clicked outside
        document.addEventListener('click', function(event) {
            const isClickInside = searchBox.contains(event.target);
            
            if (!isClickInside) {
                trendingDropdown.style.display = 'none';
                searchBox.style.borderRadius = '24px';
                searchBox.style.borderBottomColor = '#dfe1e5';
                if (!searchInput.value) {
                    searchBox.style.boxShadow = 'none';
                }
            }
        });
        
        // Handle trending item clicks
        const trendingItems = document.querySelectorAll('.trending-item');
        trendingItems.forEach(item => {
            item.addEventListener('click', function() {
                const searchText = this.querySelector('.trend-text').textContent.trim();
                searchInput.value = searchText;
                performSearch(searchText);
            });
        });
    }
}

/**
 * Sets up voice search functionality
 */
function setupVoiceSearch() {
    const voiceSearch = document.querySelector('.voice-search');
    const voiceDialogOverlay = document.getElementById('voice-dialog-overlay');
    const voiceStatusText = document.getElementById('voice-status-text');
    const voiceIcon = document.querySelector('.voice-icon');
    
    if (voiceSearch && voiceDialogOverlay) {
        voiceSearch.addEventListener('click', function() {
            // Check if browser supports the Web Speech API
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                // Create a speech recognition instance
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                
                // Configure recognition settings
                recognition.lang = 'en-US';
                recognition.continuous = false;
                recognition.interimResults = false;
                
                // First request permission before showing the dialog
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(function(stream) {
                        // Permission granted, stop the stream immediately
                        stream.getTracks().forEach(track => track.stop());
                        
                        // Now show the voice dialog
                        voiceDialogOverlay.style.display = 'flex';
                        document.body.style.overflow = 'hidden'; // Prevent scrolling
                        
                        // Show "Speak now" for 1 second
                        voiceStatusText.textContent = 'Speak now';
                        
                        // After 1 second, animate "Listening..." one letter at a time
                        setTimeout(() => {
                            const listeningText = 'Listening...';
                            let currentIndex = 0;
                            voiceStatusText.textContent = '';
                            
                            // Add one letter at a time with a slight delay
                            const typingInterval = setInterval(() => {
                                if (currentIndex < listeningText.length) {
                                    voiceStatusText.textContent += listeningText.charAt(currentIndex);
                                    currentIndex++;
                                } else {
                                    clearInterval(typingInterval);
                                }
                            }, 100); // 100ms between each letter
                            
                            voiceIcon.classList.add('listening');
                            
                            // Start listening
                            try {
                                recognition.start();
                            } catch (e) {
                                console.error('Speech recognition error:', e);
                                closeVoiceDialog();
                            }
                        }, 1000);
                    })
                    .catch(function(err) {
                        // Permission denied
                        console.error('Microphone permission denied:', err);
                        alert('Microphone permission denied. Please allow microphone access to use voice search.');
                    });
                
                // Handle results
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    const searchInput = document.querySelector('.search-input');
                    if (searchInput) {
                        searchInput.value = transcript;
                        // Close the dialog
                        closeVoiceDialog();
                        // Perform search with the transcript after a short delay
                        setTimeout(() => {
                            performSearch(transcript);
                        }, 500);
                    }
                };
                
                // Handle errors
                recognition.onerror = function(event) {
                    console.error('Speech recognition error:', event.error);
                    if (event.error === 'not-allowed') {
                        alert('Microphone permission denied. Please allow microphone access to use voice search.');
                    }
                    closeVoiceDialog();
                };
                
                // When recognition ends
                recognition.onend = function() {
                    closeVoiceDialog();
                };
                
                // Stop listening after 7 seconds total (1s for "Speak now" + 6s for "Listening...")
                setTimeout(() => {
                    recognition.stop();
                    closeVoiceDialog();
                }, 7000);
                
                // Function to close the voice dialog
                function closeVoiceDialog() {
                    voiceDialogOverlay.style.display = 'none';
                    document.body.style.overflow = '';
                    voiceIcon.classList.remove('listening');
                }
            } else {
                // Browser doesn't support speech recognition
                alert('Your browser does not support voice search. Please try using Chrome, Edge, or Safari.');
            }
        });
    }
}

/**
 * Sets up Google Lens drawer functionality
 */
function setupGoogleLensDialog() {
    const cameraSearch = document.querySelector('.camera-search');
    const lensDrawer = document.getElementById('lens-drawer');
    const lensCloseBtn = document.getElementById('lens-close-btn');
    const lensUploadLink = document.querySelector('.lens-upload-link');
    const searchBox = document.querySelector('.search-box');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Show drawer when camera icon is clicked
    if (cameraSearch && lensDrawer) {
        cameraSearch.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            // Toggle the drawer visibility
            if (lensDrawer.style.display === 'block') {
                closeLensDrawer();
            } else {
                // Change search box border radius when drawer is open
                searchBox.style.borderRadius = '24px 24px 0 0';
                searchBox.style.borderBottomColor = 'transparent';
                searchBox.style.boxShadow = '0 1px 6px rgba(32, 33, 36, 0.28)';
                
                // Show the drawer
                lensDrawer.style.display = 'block';
            }
        });
    }
    
    // Close drawer when close button is clicked
    if (lensCloseBtn) {
        lensCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            closeLensDrawer();
        });
    }
    
    // Handle clicks outside the drawer
    document.addEventListener('click', function(e) {
        // If drawer is open and click is outside the drawer and not on the camera icon
        if (lensDrawer.style.display === 'block' && 
            !e.target.closest('#lens-drawer') && 
            !e.target.closest('.camera-search')) {
            closeLensDrawer();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lensDrawer.style.display === 'block') {
            closeLensDrawer();
        }
    });
    
    // Helper function to close the lens drawer
    function closeLensDrawer() {
        lensDrawer.style.display = 'none';
        // Reset search box styling
        searchBox.style.borderRadius = '24px';
        searchBox.style.borderBottomColor = '#dfe1e5';
        if (!document.querySelector('.search-input').value) {
            searchBox.style.boxShadow = 'none';
        }
    }
    
    // Handle file upload link
    if (lensUploadLink) {
        lensUploadLink.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
    }
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            // In a real implementation, this would upload the file
            console.log('File selected:', this.files[0].name);
            // For demo purposes, we'll just show an alert
            alert('Image upload functionality would be implemented in a real application.');
        }
    });
    
    // Setup drag and drop functionality
    const uploadArea = document.querySelector('.lens-upload-area');
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.classList.add('highlight');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }
        
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files[0]) {
                // In a real implementation, this would upload the file
                console.log('File dropped:', files[0].name);
                // For demo purposes, we'll just show an alert
                alert('Image upload functionality would be implemented in a real application.');
            }
        }
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
    
    // Add search filters toggle
    const filterToggle = document.querySelector('.search-tools-toggle');
    const searchTools = document.querySelector('.search-tools');
    
    if (filterToggle && searchTools) {
        filterToggle.addEventListener('click', function() {
            searchTools.classList.toggle('show');
            filterToggle.classList.toggle('active');
            
            // Update text based on state
            const toggleText = filterToggle.querySelector('span');
            if (toggleText) {
                if (searchTools.classList.contains('show')) {
                    toggleText.textContent = 'Hide filters';
                } else {
                    toggleText.textContent = 'Tools';
                }
            }
        });
    }
    
    // Setup search type tabs
    const searchTabs = document.querySelectorAll('.search-tab');
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update search results based on tab (in a real app)
            // For demo purposes, we'll just log the search type
            console.log('Search type changed to:', this.textContent.trim());
        });
    });
    
    // Setup related searches click
    const relatedSearches = document.querySelectorAll('.related-search');
    relatedSearches.forEach(item => {
        item.addEventListener('click', function() {
            const searchText = this.textContent.trim();
            performSearch(searchText);
        });
    });
    
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
