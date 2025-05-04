// --------------- helpers ---------------
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $$(sel, ctx=document){ return [...ctx.querySelectorAll(sel)]; }
function el(html){
  const t=document.createElement('template'); t.innerHTML=html.trim();
  return t.content.firstChild;
}

// --------------- state ---------------
let convo;  // loaded from JSON
// These will be initialized in the DOMContentLoaded event
let panel;
let toggle;
let messagesEl;
let inputEl;
let formEl;
let saveBtn;
let closeBtn;
let autoOpenSetting;

// User preferences
let shouldAutoOpen = true; // Default to true

// Tooltip for citations
let activeTooltip = null;

// Animation timing
const TYPING_DELAY = 800; // ms

// Local storage keys
const STORAGE_KEY_AUTO_OPEN = 'sc_auto_open';

// --------------- init ---------------
window.addEventListener('DOMContentLoaded', async () => {
  // Initialize all elements
  panel = document.getElementById('sc-panel');
  toggle = document.getElementById('sc-toggle');
  messagesEl = document.getElementById('sc-messages');
  inputEl = document.getElementById('sc-input');
  formEl = document.getElementById('sc-input-form');
  createBtn = document.getElementById('sc-create');
  saveBtn = document.getElementById('sc-save');
  closeBtn = document.getElementById('sc-close');
  autoOpenSetting = document.getElementById('sc-auto-open-setting');
  
  console.log('SearchChat elements initialized:', { panel, toggle, messagesEl, inputEl });
  
  // Show toggle only on search page
  if (window.location.pathname.includes('search.html') || true) {
    toggle.hidden = false;
  }
  
  // Load user preferences
  loadUserPreferences();
  
  // Initialize settings toggle
  if (autoOpenSetting) {
    autoOpenSetting.checked = shouldAutoOpen;
    autoOpenSetting.addEventListener('change', () => {
      shouldAutoOpen = autoOpenSetting.checked;
      saveUserPreferences();
    });
  }
  
  // Auto-open the drawer if enabled
  if (shouldAutoOpen && window.location.pathname.includes('search.html')) {
    openPanel();
  }

  // Get the search query from the search input
  const searchQuery = $('.search-input')?.value || 'is amazon the largest river in the world';

  // preload dummy conversation
  try {
    const res = await fetch('data/chat-mock.json');
    convo = await res.json();
    // Use the actual search query if available
    convo.query = searchQuery;
    $('#sc-query').textContent = convo.query;
    if (convo.messages && Array.isArray(convo.messages)) {
      convo.messages.forEach(renderBubble);
    }
  } catch (err) {
    console.error('Failed to load conversation:', err);
    // Create a default conversation if fetch fails
    convo = {
      query: searchQuery,
      messages: [
        {
          role: 'bot',
          text: 'Yes, the Amazon River is the largest river in the world by volume. It has the greatest total flow of any river, carrying more than the combined flow of the next seven largest rivers. While the Nile is longer at 6,650 km (4,130 mi) compared to the Amazon\'s 6,400 km (4,000 mi), the Amazon\'s discharge is about 209,000 cubic meters per second, which is approximately 20% of all freshwater that flows into oceans. [1][2]'
        }
      ],
      sources: {
        1: {
          title: "Amazon River - Wikipedia",
          url: "https://en.wikipedia.org/wiki/Amazon_River"
        },
        2: {
          title: "Britannica - Amazon River",
          url: "https://www.britannica.com/place/Amazon-River"
        }
      }
    };
    $('#sc-query').textContent = convo.query;
    convo.messages.forEach(renderBubble);
  }

  // Set up event listeners after elements are initialized
  toggle.addEventListener('click', function(e) {
    console.log('Toggle button clicked');
    
    // Toggle the panel state - if open, close it; if closed, open it
    if (panel.classList.contains('open')) {
      closePanel();
    } else {
      openPanel();
    }
  });
  
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closePanel();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closePanel();
    }
  });
  
  createBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleCreateNote();
  });
  
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSaveToServices();
  });
  
  formEl.addEventListener('submit', handleSubmit);
  
  // Add input focus event to show subtle animation
  inputEl.addEventListener('focus', () => {
    inputEl.parentElement.classList.add('focused');
  });
  
  inputEl.addEventListener('blur', () => {
    inputEl.parentElement.classList.remove('focused');
  });
  
  // Close tooltip when clicking elsewhere
  document.addEventListener('click', e => {
    if (activeTooltip && !e.target.closest('.sc-cite')) {
      activeTooltip.remove();
      activeTooltip = null;
    }
  });
});

// --------------- UI actions ---------------
function openPanel() {
  console.log('Opening panel...');
  if (!panel) {
    console.error('Panel element not found!');
    return;
  }
  
  // Smoothly open the panel without affecting other elements
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
  
  // Focus the input field after the animation completes
  setTimeout(() => {
    if (inputEl) inputEl.focus();
  }, 300);
}

function closePanel() {
  console.log('Closing panel...');
  if (!panel) {
    console.error('Panel element not found!');
    return;
  }
  
  // Smoothly close the panel without affecting other elements
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  
  // Return focus to the toggle button
  if (toggle) toggle.focus();
}
function renderBubble(m){
  // Check if this is a typing indicator
  const isTyping = m.text.includes('<em>Thinking…</em>');
  
  // Process citations if not a typing indicator
  const withCites = isTyping ? m.text : m.text.replace(/\[(\d+)]/g,
    (_,id)=>`<sup class="sc-cite" data-id="${id}">[${id}]</sup>`);
  
  // Create bubble element with appropriate classes
  const bubble = el(
    `<div class="sc-bubble ${m.role} ${isTyping ? 'typing' : ''}">${withCites}</div>`
  );
  
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  
  // Add animation for new messages
  if (!isTyping) {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(10px)';
    setTimeout(() => {
      bubble.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
    }, 10);
  }
}

// Handle citation clicks
messagesEl.addEventListener('click', e => {
  const cite = e.target.closest('.sc-cite');
  if (!cite) return;
  
  // Remove existing tooltip if any
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
  
  const sourceId = cite.dataset.id;
  const src = convo.sources[sourceId];
  if (!src) return;
  
  // Create and position tooltip
  const tooltip = el(`
    <div class="sc-tooltip">
      <div class="sc-tooltip-title">${src.title}</div>
      <a href="${src.url}" target="_blank" class="sc-tooltip-url">${src.url}</a>
    </div>
  `);
  
  document.body.appendChild(tooltip);
  
  // Position the tooltip near the citation
  const citeRect = cite.getBoundingClientRect();
  const tooltipLeft = Math.min(
    citeRect.left, 
    window.innerWidth - 340 // Ensure tooltip doesn't go off-screen
  );
  
  tooltip.style.left = `${tooltipLeft}px`;
  tooltip.style.top = `${citeRect.bottom + 10}px`;
  tooltip.style.display = 'block';
  
  // Store the active tooltip
  activeTooltip = tooltip;
  
  e.stopPropagation();
});

// --------------- Preferences ---------------
// Load user preferences from local storage
function loadUserPreferences() {
  try {
    const autoOpen = localStorage.getItem(STORAGE_KEY_AUTO_OPEN);
    if (autoOpen !== null) {
      shouldAutoOpen = autoOpen === 'true';
    }
  } catch (error) {
    console.error('Error loading user preferences:', error);
  }
}

// Save user preferences to local storage
function saveUserPreferences() {
  try {
    localStorage.setItem(STORAGE_KEY_AUTO_OPEN, shouldAutoOpen.toString());
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

// Handle creating a new note (summarize conversation)
function handleCreateNote() {
  // Check if there are enough messages to summarize
  if (convo && convo.messages && convo.messages.length > 1) {
    // Generate a title based on the conversation
    const query = document.getElementById('sc-query').textContent || 'Search Chat';
    const noteTitle = `Summary of "${query}"`;  
  
    // Extract content from messages for the summary
    let contentToSummarize = '';
    convo.messages.forEach(msg => {
      if (msg.role === 'system') return; // Skip system messages
      contentToSummarize += `${msg.role === 'assistant' ? 'SearchChat: ' : 'You: '}${msg.text}\n`;
    });
    
    // Generate a simple summary (in a real app, this could use AI)
    const summaryText = generateSummary(contentToSummarize, query);
    
    // Create a summary note and add it to the conversation
    const summaryNote = {
      role: 'system',
      type: 'note',
      title: noteTitle,
      text: summaryText,
      timestamp: new Date().toISOString()
    };
    
    // Add to conversation data
    convo.messages.push(summaryNote);
    
    // Create and append the note element
    const noteElement = el(`
      <div class="sc-message sc-message-note">
        <div class="sc-note-header">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#1a73e8" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
          </svg>
          <h3>${noteTitle}</h3>
        </div>
        <div class="sc-message-content">
          <p>${summaryText.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `);
    
    messagesEl.appendChild(noteElement);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // Show a toast notification
    const toast = el(`
      <div class="sc-toast">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="#4285f4" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
        </svg>
        <span>Note created and added to chat</span>
      </div>
    `);
    document.body.appendChild(toast);
    
    // Remove toast after delay
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  } else {
    // Not enough content to summarize
    const toast = el(`
      <div class="sc-toast">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="#EA4335" d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
        </svg>
        <span>Need more conversation before creating a note</span>
      </div>
    `);
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}

// Simple function to generate a summary
function generateSummary(content, query) {
  // In a real app, this would use AI or a more sophisticated algorithm
  // For now, we'll create a simple summary
  const lines = content.split('\n').filter(line => line.trim() !== '');
  let summary = `This is a summary of your conversation about "${query}":\n\n`;
  
  // Add key points (simplified version)
  summary += "Key points discussed:\n";
  
  // Extract some points from the conversation
  const pointsExtracted = new Set();
  lines.forEach(line => {
    // Skip short lines or lines that start with "You:"
    if (line.length < 40 || line.startsWith('You:')) return;
    
    // Extract a potential point (first 60 chars)
    const point = line.substring(0, 60).trim();
    if (!point.endsWith('.')) {
      pointsExtracted.add(point + '...');
    } else {
      pointsExtracted.add(point);
    }
  });
  
  // Add up to 3 points
  const points = Array.from(pointsExtracted).slice(0, 3);
  points.forEach((point, i) => {
    summary += `${i+1}. ${point}\n`;
  });
  
  if (points.length === 0) {
    summary += "- No specific points identified\n";
  }
  
  // Add conclusion
  summary += "\nThis summary was automatically generated based on your conversation.";
  
  return summary;
}

// Handle saving to external services
function handleSaveToServices() {
  // Check if we have enough content to save
  if (!convo || !convo.messages || convo.messages.length === 0) {
    const toast = el(`
      <div class="sc-toast">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="#EA4335" d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
        </svg>
        <span>No conversation to save</span>
      </div>
    `);
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
    return;
  }
  
  // Close any existing tooltip
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
  
  // Show export dialog
  const dialog = el(`
    <div class="sc-modal-overlay">
      <div class="sc-modal">
        <div class="sc-modal-header">
          <h3>Export Conversation</h3>
          <button class="sc-modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#5f6368">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="sc-modal-content">
          <p>Choose where to export your conversation:</p>
          <div class="sc-export-options">
            <div class="sc-export-option" data-service="keep">
              <img src="images/keep.svg" alt="Google Keep" width="24" height="24">
              <span>Google Keep</span>
            </div>
            <div class="sc-export-option" data-service="docs">
              <img src="images/docs.svg" alt="Google Docs" width="24" height="24">
              <span>Google Docs</span>
            </div>
            <div class="sc-export-option" data-service="notebook">
              <img src="images/notebook.svg" alt="NotebookLM" width="24" height="24">
              <span>NotebookLM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
  
  document.body.appendChild(dialog);
  
  // Handle close button click
  dialog.querySelector('.sc-modal-close').addEventListener('click', () => {
    dialog.classList.add('fade-out');
    setTimeout(() => dialog.remove(), 300);
  });
  
  // Handle export option clicks
  dialog.querySelectorAll('.sc-export-option').forEach(option => {
    option.addEventListener('click', () => {
      const service = option.dataset.service;
      dialog.querySelector('.sc-modal-content').innerHTML = `
        <div class="sc-export-progress">
          <div class="sc-spinner"></div>
          <p>Exporting to ${option.querySelector('span').textContent}...</p>
        </div>
      `;
      
      // Simulate export process (would be API call in a real app)
      setTimeout(() => {
        const serviceName = option.querySelector('span').textContent;
        dialog.querySelector('.sc-modal-content').innerHTML = `
          <div class="sc-export-success">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path fill="#34A853" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </svg>
            <p>Successfully exported to ${serviceName}!</p>
          </div>
        `;
        
        // Auto-close after delay
        setTimeout(() => {
          dialog.classList.add('fade-out');
          setTimeout(() => dialog.remove(), 300);
        }, 1500);
      }, 1500);
    });
  });
}

// Handle save button click
function handleSave(){
  // Create a dropdown menu for save options
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
  
  const saveOptions = [
    { name: 'Save to Google Keep', icon: 'keep.svg' },
    { name: 'Save to Google Docs', icon: 'docs.svg' },
    { name: 'Save to NotebookLM', icon: 'notebook.svg' }
  ];
  
  const saveMenu = el(`
    <div class="sc-tooltip sc-save-menu">
      <div class="sc-tooltip-title">Save conversation</div>
      <div class="sc-save-options">
        ${saveOptions.map(opt => `
          <div class="sc-save-option" data-service="${opt.name.split(' ').pop().toLowerCase()}">
            <img src="images/${opt.icon}" alt="${opt.name}" width="16" height="16">
            <span>${opt.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `);
  
  document.body.appendChild(saveMenu);
  activeTooltip = saveMenu;
  
  // Position the menu near the save button
  const btnRect = saveBtn.getBoundingClientRect();
  saveMenu.style.left = `${btnRect.left - 180}px`;
  saveMenu.style.top = `${btnRect.bottom + 10}px`;
  saveMenu.style.display = 'block';
  
  // Add click handlers to options
  const options = saveMenu.querySelectorAll('.sc-save-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const service = opt.dataset.service;
      console.log(`Saving conversation to ${service}:`, convo);
      
      // Show success message
      saveMenu.innerHTML = `
        <div class="sc-tooltip-title">Success!</div>
        <div>Conversation saved to ${opt.textContent.trim()}</div>
      `;
      
      // Auto-close after delay
      setTimeout(() => {
        saveMenu.remove();
        activeTooltip = null;
      }, 2000);
    });
  });
}

// Close when clicking outside of tooltips
document.addEventListener('click', (e) => {
  if (activeTooltip && !e.target.closest('.sc-tooltip') && !e.target.closest('#sc-save')) {
    activeTooltip.remove();
    activeTooltip = null;
  }
});

// Handle form submission
function handleSubmit(e){
  e.preventDefault();
  const text = inputEl.value.trim();
  if(!text) return;
  
  // Add user message to conversation
  const userMessage = {role:'user', text};
  convo.messages.push(userMessage);
  renderBubble(userMessage);
  inputEl.value = '';

  // Show typing indicator
  const placeholder = {role:'bot', text:'<em>Thinking…</em>'};
  renderBubble(placeholder);
  
  // Simulate API response with variable timing based on question complexity
  const responseTime = Math.max(1000, Math.min(3000, text.length * 30));
  
  setTimeout(() => {
    // Remove typing indicator
    const typingBubble = messagesEl.querySelector('.sc-bubble.typing');
    if (typingBubble) {
      typingBubble.remove();
    }
    
    // Add bot response
    const botResponse = {
      role: 'bot',
      text: generateResponse(text)
    };
    convo.messages.push(botResponse);
    renderBubble(botResponse);
  }, responseTime);
}

// Generate a mock response based on user input
function generateResponse(userText) {
  // Simple keyword matching for demo purposes
  const lowerText = userText.toLowerCase();
  
  if (lowerText.includes('how long') || lowerText.includes('length')) {
    return 'The Amazon River is approximately 6,400 kilometers (4,000 miles) long, making it the second-longest river after the Nile. However, some studies suggest it might actually be longer than the Nile. Recent research using satellite imagery has challenged traditional measurements, with some scientists arguing that the Amazon\'s true source is in southern Peru, which would make it longer than the Nile. [1]';
  } 
  else if (lowerText.includes('volume') || lowerText.includes('discharge')) {
    return 'The Amazon has by far the greatest average discharge of any river in the world, with about 209,000 cubic meters per second (7,400,000 cu ft/s), which represents approximately 20% of the world\'s freshwater discharge into the oceans. During the wet season, parts of the Amazon can be up to 30 miles (48 km) wide. The volume of water released by the Amazon to the Atlantic Ocean is approximately 1/5 of all the freshwater released to the oceans by rivers worldwide. [2]';
  }
  else if (lowerText.includes('countries') || lowerText.includes('where')) {
    return 'The Amazon River flows through three countries: Peru, Colombia, and Brazil. It has tributaries in several other South American countries including Bolivia, Ecuador, and Venezuela. The river basin, which covers about 40% of South America, includes parts of eight South American countries. The majority (about 60%) of the basin is within Brazil. [1][2]';
  }
  else if (lowerText.includes('wildlife') || lowerText.includes('animals') || lowerText.includes('species')) {
    // Add a new source if needed
    if (!convo.sources[3]) {
      convo.sources[3] = {
        title: "National Geographic - Amazon River Wildlife",
        url: "https://www.nationalgeographic.com/animals/article/amazon-river-wildlife"
      };
    }
    
    return 'The Amazon River and its surrounding rainforest form one of the most biodiverse ecosystems on Earth. The river is home to over 2,500 known species of fish, including the piranha, electric eel, and the giant arapaima, which can grow up to 15 feet long. The Amazon River dolphin (or boto) is one of the few river dolphin species in the world. The river also hosts the anaconda, one of the world\'s largest snakes, and countless invertebrate species. [1][3]';
  }
  else if (lowerText.includes('compare') || lowerText.includes('mississippi') || lowerText.includes('nile')) {
    if (lowerText.includes('mississippi')) {
      return 'The Amazon River is significantly larger than the Mississippi River in several ways: (1) Volume/Discharge: The Amazon\'s average discharge is about 209,000 cubic meters per second, which is more than 10 times that of the Mississippi (16,800 cubic meters per second). (2) Length: The Amazon is approximately 6,400 km (4,000 mi) long, while the Mississippi is about 3,730 km (2,320 mi) long. (3) Drainage Basin: The Amazon Basin covers about 7 million square kilometers, nearly 4 times larger than the Mississippi Basin at 1.85 million square kilometers. [1][3]';
    } else {
      return 'While the Nile River is traditionally considered the longest river in the world at 6,650 km (4,130 mi), the Amazon River is undoubtedly the largest by volume. The Amazon\'s discharge is about 209,000 cubic meters per second, which is approximately 20% of all freshwater that flows into oceans worldwide. The Amazon\'s drainage basin is also the largest in the world, covering about 7 million square kilometers. Some recent studies suggest the Amazon might actually be longer than the Nile, depending on where its true source is identified. [1][2]';
    }
  }
  else {
    return 'The Amazon River is the largest river in the world by volume and contains more freshwater than any other river. While the Nile is traditionally considered longer, some studies suggest the Amazon might actually be the longest river as well. The Amazon Basin is home to the largest tropical rainforest in the world, covering about 40% of South America. The river begins in the Peruvian Andes and travels about 6,400 km (4,000 mi) before emptying into the Atlantic Ocean. Its drainage basin covers approximately 7 million square kilometers and includes parts of eight South American countries. [1][2]';
  }
}
