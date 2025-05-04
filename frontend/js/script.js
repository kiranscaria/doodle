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
 * @param {boolean} feelingLucky - Whether this is an "I'm Feeling Lucky" search
 */
function performSearch(query, feelingLucky = false) {
    if (query && query.trim() !== '') {
        if (feelingLucky) {
            // For "I'm Feeling Lucky", we would normally go directly to the first result
            // Since this is a demo, we'll simulate this by adding a parameter to the URL
            window.location.href = `search.html?q=${encodeURIComponent(query)}&lucky=true`;
        } else {
            // Regular search - navigate to the search page with the query
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }
}

/**
 * Sets up landing page specific interactions
 */
function setupLandingPageInteractions() {
    // Setup all I'm Feeling Lucky buttons
    const luckyButtons = document.querySelectorAll('.lucky-btn');
    if (luckyButtons.length > 0) {
        luckyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const searchInput = document.querySelector('.search-input');
                if (searchInput && searchInput.value.trim() !== '') {
                    // When there is text in the search box, go directly to Wikipedia
                    window.location.href = 'https://en.wikipedia.org/wiki/Amazon_River';
                } else {
                    // If the search box is empty, go to Google Doodles
                    window.location.href = 'https://doodles.google/';
                }
            });
        });
    }
    
    // Setup all Google Search buttons
    const searchButtons = document.querySelectorAll('.search-btn');
    if (searchButtons.length > 0) {
        searchButtons.forEach(button => {
            button.addEventListener('click', function() {
                const searchInput = document.querySelector('.search-input');
                const query = searchInput ? searchInput.value.trim() : '';
                performSearch(query);
            });
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
        // Remove any existing event listeners (to prevent duplicates)
        const newAppsToggle = appsToggle.cloneNode(true);
        appsToggle.parentNode.replaceChild(newAppsToggle, appsToggle);
        
        // Toggle app drawer on click
        newAppsToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            appDrawer.classList.toggle('show');
            
            // Close settings drawer if it's open
            const settingsDrawer = document.getElementById('settings-drawer');
            if (settingsDrawer && settingsDrawer.classList.contains('show')) {
                settingsDrawer.classList.remove('show');
            }
        });
        
        // Close app drawer when clicking outside
        document.addEventListener('click', function(e) {
            if (appDrawer.classList.contains('show') && !appDrawer.contains(e.target) && !newAppsToggle.contains(e.target)) {
                appDrawer.classList.remove('show');
            }
        });
        
        // Prevent drawer from closing when clicking inside it
        appDrawer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close app drawer when pressing escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && appDrawer.classList.contains('show')) {
                appDrawer.classList.remove('show');
            }
        });
        
        // Add tooltip functionality
        const tooltip = newAppsToggle.querySelector('.tooltip');
        if (tooltip) {
            newAppsToggle.addEventListener('mouseenter', function() {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            });
            
            newAppsToggle.addEventListener('mouseleave', function() {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            });
        }
    }
}

/**
 * Sets up the settings drawer toggle functionality
 */
function setupSettingsDrawer() {
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsDrawer = document.getElementById('settings-drawer');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    
    if (settingsToggle && settingsDrawer) {
        // Remove any existing event listeners (to prevent duplicates)
        const newSettingsToggle = settingsToggle.cloneNode(true);
        settingsToggle.parentNode.replaceChild(newSettingsToggle, settingsToggle);
        
        // Toggle settings drawer on click
        newSettingsToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            settingsDrawer.classList.toggle('show');
            
            // Close app drawer if it's open
            const appDrawer = document.getElementById('app-drawer');
            if (appDrawer && appDrawer.classList.contains('show')) {
                appDrawer.classList.remove('show');
            }
        });
        
        // Clone and replace the close button to remove any existing event listeners
        if (settingsCloseBtn) {
            const newSettingsCloseBtn = settingsCloseBtn.cloneNode(true);
            settingsCloseBtn.parentNode.replaceChild(newSettingsCloseBtn, settingsCloseBtn);
            
            // Close settings drawer when clicking the close button
            newSettingsCloseBtn.addEventListener('click', function() {
                settingsDrawer.classList.remove('show');
            });
        }
        
        // Close settings drawer when clicking outside
        document.addEventListener('click', function(e) {
            if (settingsDrawer.classList.contains('show') && !settingsDrawer.contains(e.target) && !newSettingsToggle.contains(e.target)) {
                settingsDrawer.classList.remove('show');
            }
        });
        
        // Add tooltip functionality
        const tooltip = newSettingsToggle.querySelector('.tooltip');
        if (tooltip) {
            newSettingsToggle.addEventListener('mouseenter', function() {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            });
            
            newSettingsToggle.addEventListener('mouseleave', function() {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            });
        }
        
        // Prevent drawer from closing when clicking inside it
        settingsDrawer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close settings drawer when Escape key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && settingsDrawer.classList.contains('show')) {
                settingsDrawer.classList.remove('show');
            }
        });
        
        // Make the Sign in button functional
        const signInBtn = settingsDrawer.querySelector('.settings-sign-in-btn');
        if (signInBtn) {
            signInBtn.addEventListener('click', function() {
                window.location.href = 'https://accounts.google.com/ServiceLogin?hl=en&passive=true&continue=https://www.google.com/';
            });
        }
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
    const voiceModal = document.getElementById('voice-modal');
    const voiceCloseBtn = document.getElementById('voice-close-btn');
    
    if (voiceSearch && voiceModal) {
        // Setup Web Speech API if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            
            let finalTranscript = '';
            
            recognition.onstart = function() {
                console.log('Voice recognition started');
                document.querySelector('.voice-instruction').textContent = 'Speak now';
                document.getElementById('voice-detected-text').textContent = '';
            };
            
            recognition.onresult = function(event) {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // Update the UI with the transcript
                if (finalTranscript || interimTranscript) {
                    document.getElementById('voice-detected-text').textContent = finalTranscript || interimTranscript;
                    // Change instruction to empty when user starts speaking
                    document.querySelector('.voice-instruction').textContent = '';
                }
            };
            
            recognition.onerror = function(event) {
                console.error('Speech recognition error', event.error);
                document.querySelector('.voice-instruction').textContent = 'Error';
                document.getElementById('voice-detected-text').textContent = event.error;
                setTimeout(() => {
                    voiceModal.style.display = 'none';
                }, 1500);
            };
            
            recognition.onend = function() {
                console.log('Voice recognition ended');
                if (finalTranscript) {
                    // Redirect to search results with the transcript as query
                    window.location.href = 'search.html?q=' + encodeURIComponent(finalTranscript);
                } else {
                    document.querySelector('.voice-instruction').textContent = 'Didn\'t catch that';
                    document.getElementById('voice-detected-text').textContent = 'Try again';
                    setTimeout(() => {
                        voiceModal.style.display = 'none';
                    }, 1500);
                }
            };
            
            // Start recognition when voice search is clicked
            voiceSearch.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                finalTranscript = '';
                voiceModal.style.display = 'flex';
                recognition.start();
            });
            
            // Stop recognition when close button is clicked
            if (voiceCloseBtn) {
                voiceCloseBtn.addEventListener('click', function() {
                    recognition.stop();
                });
            }
        } else {
            // Browser doesn't support speech recognition
            voiceSearch.addEventListener('click', function() {
                alert('Your browser does not support voice search. Please try using Chrome or Edge.');
            });
        }
    }
}

/**
 * Sets up Google Lens drawer functionality
 */
function setupGoogleLensDialog() {
    const cameraSearch = document.querySelector('.camera-search');
    const lensDrawer = document.getElementById('lens-drawer');
    const lensModal = document.getElementById('lens-modal');
    const lensCloseBtn = document.getElementById('lens-close-btn');
    const lensUploadLink = document.querySelector('.lens-upload-link');
    const searchBox = document.querySelector('.search-box');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Show drawer or modal when camera icon is clicked
    if (cameraSearch) {
        console.log('Camera search element found:', cameraSearch);
        
        cameraSearch.addEventListener('click', function(e) {
            console.log('Camera search clicked');
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            // Check which page we're on and show the appropriate UI
            if (lensDrawer) {
                console.log('Using lens drawer');
                // Landing page - use drawer
                // Toggle the drawer visibility
                if (lensDrawer.style.display === 'block') {
                    closeLensDrawer();
                } else {
                    // Position the drawer below the search box
                    lensDrawer.style.display = 'block';
                }
            } else if (lensModal) {
                console.log('Using lens modal');
                // Search page - use modal
                lensModal.style.display = 'flex';
            } else {
                console.log('Neither lens drawer nor lens modal found');
            }
        });
    } else {
        console.log('Camera search element not found');
    }
    
    // Close drawer/modal when close button is clicked
    if (lensCloseBtn) {
        lensCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (lensDrawer) {
                closeLensDrawer();
            } else if (lensModal) {
                lensModal.style.display = 'none';
            }
        });
    }
    
    // Handle clicks outside the drawer
    document.addEventListener('click', function(e) {
        // Close drawer/modal when clicking outside of it
        if (lensDrawer && lensDrawer.style.display === 'block' && 
            !e.target.closest('#lens-drawer') && 
            !e.target.closest('.camera-search')) {
            closeLensDrawer();
        } else if (lensModal && lensModal.style.display === 'flex' && 
            !e.target.closest('.lens-modal-content') && 
            !e.target.closest('.camera-search')) {
            lensModal.style.display = 'none';
        }
    });
    
    // Close drawer/modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (lensDrawer && lensDrawer.style.display === 'block') {
                closeLensDrawer();
            } else if (lensModal && lensModal.style.display === 'flex') {
                lensModal.style.display = 'none';
            }
        }
    });
    
    // Close drawer when page is scrolled
    window.addEventListener('scroll', function() {
        if (lensDrawer.style.display === 'block') {
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
    
    // Handle file upload link click
    const allUploadLinks = document.querySelectorAll('.lens-upload-link');
    allUploadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });
    });
    
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
    const uploadAreas = document.querySelectorAll('.lens-upload-area');
    if (uploadAreas.length > 0) {
        uploadAreas.forEach(uploadArea => {
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
                if (files.length) {
                    // Handle the dropped file(s)
                    console.log('File dropped:', files[0].name);
                    // Here you would typically upload the file or process it
                }
            }
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
    
    setupAppDrawer();
    setupSettingsDrawer();
    setupPeopleAlsoAsk();
    setupFeaturedSnippet();
}

/**
 * Sets up the featured snippet collapsible functionality
 */
function setupFeaturedSnippet() {
    const featuredSnippet = document.querySelector('.featured-snippet');
    const showMoreButton = document.querySelector('.show-more-button');
    
    if (featuredSnippet && showMoreButton) {
        showMoreButton.addEventListener('click', function() {
            const isExpanded = featuredSnippet.getAttribute('data-expanded') === 'true';
            featuredSnippet.setAttribute('data-expanded', !isExpanded);
        });
    }
}

/**
 * Sets up the People also ask section interactivity
 */
function setupPeopleAlsoAsk() {
    const paaItems = document.querySelectorAll('.paa-item');
    const moreOptions = document.querySelector('.more-options');
    const paaDrawer = document.querySelector('.paa-drawer');
    const paaDrawerOverlay = document.querySelector('.paa-drawer-overlay');
    const paaModalClose = document.querySelector('.paa-modal-close');
    
    // Setup PAA item expansion
    paaItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on the arrow directly
            if (e.target.closest('.paa-arrow') && !e.target.closest('.paa-arrow').contains(e.target)) {
                return;
            }
            
            const isExpanded = this.getAttribute('data-expanded') === 'true';
            
            // Close all other items first
            paaItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.setAttribute('data-expanded', 'false');
                }
            });
            
            // Toggle current item
            this.setAttribute('data-expanded', !isExpanded ? 'true' : 'false');
        });
        
        // Add separate click handler for the arrow
        const arrow = item.querySelector('.paa-arrow');
        if (arrow) {
            arrow.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering the parent item's click event
                e.preventDefault();
                
                // Get the parent item
                const item = this.closest('.paa-item');
                const isExpanded = item.getAttribute('data-expanded') === 'true';
                
                // Close all other items first
                paaItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.setAttribute('data-expanded', 'false');
                    }
                });
                
                // Toggle current item
                item.setAttribute('data-expanded', !isExpanded ? 'true' : 'false');
            });
        }
    });
    
    // Setup more options drawer
    if (moreOptions) {
        moreOptions.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering parent click events
            paaDrawer.classList.add('active');
            paaDrawerOverlay.classList.add('active');
        });
    }
    
    // Setup drawer close button
    if (paaModalClose) {
        paaModalClose.addEventListener('click', function() {
            paaDrawer.classList.remove('active');
            paaDrawerOverlay.classList.remove('active');
        });
    }
    
    // Close drawer when clicking on overlay
    if (paaDrawerOverlay) {
        paaDrawerOverlay.addEventListener('click', function() {
            paaDrawer.classList.remove('active');
            paaDrawerOverlay.classList.remove('active');
        });
    }
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
    const voiceModal = document.getElementById('voice-modal');
    const voiceCloseBtn = document.getElementById('voice-close-btn');
    
    if (voiceSearch && voiceModal) {
        // Setup Web Speech API if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            
            let finalTranscript = '';
            
            recognition.onstart = function() {
                console.log('Voice recognition started');
                document.querySelector('.voice-instruction').textContent = 'Speak now';
                document.getElementById('voice-detected-text').textContent = '';
            };
            
            recognition.onresult = function(event) {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // Update the UI with the transcript
                if (finalTranscript || interimTranscript) {
                    document.getElementById('voice-detected-text').textContent = finalTranscript || interimTranscript;
                    // Change instruction to empty when user starts speaking
                    document.querySelector('.voice-instruction').textContent = '';
                }
            };
            
            recognition.onerror = function(event) {
                console.error('Speech recognition error', event.error);
                document.querySelector('.voice-instruction').textContent = 'Error';
                document.getElementById('voice-detected-text').textContent = event.error;
                setTimeout(() => {
                    voiceModal.style.display = 'none';
                }, 1500);
            };
            
            recognition.onend = function() {
                console.log('Voice recognition ended');
                if (finalTranscript) {
                    // Redirect to search results with the transcript as query
                    window.location.href = 'search.html?q=' + encodeURIComponent(finalTranscript);
                } else {
                    document.querySelector('.voice-instruction').textContent = 'Didn\'t catch that';
                    document.getElementById('voice-detected-text').textContent = 'Try again';
                    setTimeout(() => {
                        voiceModal.style.display = 'none';
                    }, 1500);
                }
            };
            
            // Start recognition when voice search is clicked
            voiceSearch.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                finalTranscript = '';
                recognition.start();
            });
            
            // Stop recognition when close button is clicked
            if (voiceCloseBtn) {
                voiceCloseBtn.addEventListener('click', function() {
                    recognition.stop();
                });
            }
            
            // Stop recognition when clicking outside the modal
            voiceModal.addEventListener('click', function(e) {
                if (e.target === voiceModal) {
                    recognition.stop();
                }
            });
            
            // Stop recognition when ESC key is pressed
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && voiceModal.style.display === 'flex') {
                    recognition.stop();
                }
            });
        } else {
            // Fallback for browsers that don't support Speech Recognition
            voiceSearch.addEventListener('click', function() {
                alert('Speech recognition is not supported in your browser.');
                voiceModal.style.display = 'none';
            });
        }
    }
    
    // Camera search is handled in setupGoogleLensDialog function
    
    // Setup app drawer
    setupAppDrawer();
    
    // Setup settings drawer
    setupSettingsDrawer();
