(function() {
  var CURRENT_MODE_KEY = 'hotel_site_version';
  
  function getSavedMode() {
    return localStorage.getItem(CURRENT_MODE_KEY) || 'enhanced';
  }
  
  function applyMode(mode) {
    localStorage.setItem(CURRENT_MODE_KEY, mode);
    document.documentElement.setAttribute('data-site-version', mode);
    
    var selectEls = document.querySelectorAll('.version-switcher-select');
    selectEls.forEach(function(sel) {
      if (sel.value !== mode) sel.value = mode;
    });
  }

  window.setSiteVersion = function(mode) {
    applyMode(mode);
  };

  // Immediate execution before DOM ready to prevent flash
  var initialMode = getSavedMode();
  document.documentElement.setAttribute('data-site-version', initialMode);

  document.addEventListener('DOMContentLoaded', function() {
    applyMode(getSavedMode());
  });
})();
