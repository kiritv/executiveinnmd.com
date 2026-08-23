(function() {
  var SETTINGS_KEY = 'hotel_a11y_settings';

  var defaultSettings = {
    fontSize: 100, // percentage
    highContrast: false,
    highlightLinks: false,
    readableFont: false,
    zoomScale: 100
  };

  function loadSettings() {
    try {
      var saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : Object.assign({}, defaultSettings);
    } catch(e) {
      return Object.assign({}, defaultSettings);
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch(e) {}
  }

  var settings = loadSettings();

  function applySettings() {
    var html = document.documentElement;
    
    // Font size adjustment
    html.style.fontSize = (settings.fontSize / 100 * 16) + 'px';
    
    // High contrast
    if (settings.highContrast) {
      html.classList.add('a11y-high-contrast');
    } else {
      html.classList.remove('a11y-high-contrast');
    }

    // Highlight links
    if (settings.highlightLinks) {
      html.classList.add('a11y-highlight-links');
    } else {
      html.classList.remove('a11y-highlight-links');
    }

    // Readable font
    if (settings.readableFont) {
      html.classList.add('a11y-readable-font');
    } else {
      html.classList.remove('a11y-readable-font');
    }

    // Zoom scale
    if (settings.zoomScale !== 100) {
      document.body.style.transform = 'scale(' + (settings.zoomScale / 100) + ')';
      document.body.style.transformOrigin = 'top center';
    } else {
      document.body.style.transform = '';
      document.body.style.transformOrigin = '';
    }

    saveSettings(settings);
    updateUIControls();
  }

  function updateUIControls() {
    var fontDisplay = document.getElementById('a11y-font-size-val');
    if (fontDisplay) fontDisplay.textContent = settings.fontSize + '%';

    var btnContrast = document.getElementById('a11y-btn-contrast');
    if (btnContrast) btnContrast.classList.toggle('active', settings.highContrast);

    var btnLinks = document.getElementById('a11y-btn-links');
    if (btnLinks) btnLinks.classList.toggle('active', settings.highlightLinks);

    var btnFont = document.getElementById('a11y-btn-font');
    if (btnFont) btnFont.classList.toggle('active', settings.readableFont);
  }

  function createWidget() {
    if (document.getElementById('a11y-widget-root')) return;

    var root = document.createElement('div');
    root.id = 'a11y-widget-root';
    root.innerHTML = `
      <button id="a11y-toggle-btn" aria-label="Accessibility Menu" title="Accessibility Options">
        <i class="fa-solid fa-universal-access"></i>
      </button>

      <div id="a11y-panel" role="dialog" aria-label="Accessibility Menu" aria-hidden="true">
        <div class="a11y-header">
          <h3><i class="fa-solid fa-universal-access"></i> Accessibility Options</h3>
          <button id="a11y-close-btn" aria-label="Close Accessibility Menu">&times;</button>
        </div>
        <div class="a11y-body">
          <div class="a11y-control-group">
            <label>Text Size</label>
            <div class="a11y-btn-row">
              <button id="a11y-font-dec" aria-label="Decrease Text Size">A-</button>
              <span id="a11y-font-size-val">100%</span>
              <button id="a11y-font-inc" aria-label="Increase Text Size">A+</button>
            </div>
          </div>

          <div class="a11y-control-group">
            <button id="a11y-btn-contrast" class="a11y-full-btn">
              <i class="fa-solid fa-circle-half-stroke"></i> High Contrast Mode
            </button>
          </div>

          <div class="a11y-control-group">
            <button id="a11y-btn-links" class="a11y-full-btn">
              <i class="fa-solid fa-link"></i> Highlight Links
            </button>
          </div>

          <div class="a11y-control-group">
            <button id="a11y-btn-font" class="a11y-full-btn">
              <i class="fa-solid fa-font"></i> Dyslexia Friendly Font
            </button>
          </div>

          <div class="a11y-control-group" style="margin-top: 15px;">
            <button id="a11y-btn-reset" class="a11y-reset-btn">
              <i class="fa-solid fa-rotate-left"></i> Reset All Settings
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    var toggleBtn = document.getElementById('a11y-toggle-btn');
    var panel = document.getElementById('a11y-panel');
    var closeBtn = document.getElementById('a11y-close-btn');

    toggleBtn.onclick = function() {
      var isOpen = panel.classList.contains('active');
      if (isOpen) {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      } else {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
      }
    };

    closeBtn.onclick = function() {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    };

    document.getElementById('a11y-font-inc').onclick = function() {
      if (settings.fontSize < 160) {
        settings.fontSize += 10;
        applySettings();
      }
    };

    document.getElementById('a11y-font-dec').onclick = function() {
      if (settings.fontSize > 80) {
        settings.fontSize -= 10;
        applySettings();
      }
    };

    document.getElementById('a11y-btn-contrast').onclick = function() {
      settings.highContrast = !settings.highContrast;
      applySettings();
    };

    document.getElementById('a11y-btn-links').onclick = function() {
      settings.highlightLinks = !settings.highlightLinks;
      applySettings();
    };

    document.getElementById('a11y-btn-font').onclick = function() {
      settings.readableFont = !settings.readableFont;
      applySettings();
    };

    document.getElementById('a11y-btn-reset').onclick = function() {
      settings = Object.assign({}, defaultSettings);
      applySettings();
    };

    applySettings();
  }

  // Execute on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applySettings();
      createWidget();
    });
  } else {
    applySettings();
    createWidget();
  }
})();
