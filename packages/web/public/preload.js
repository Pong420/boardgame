(() => {
  var ROOT = 'BOARDGAME_STORAGE';

  function get() {
    try {
      return JSON.parse(localStorage.getItem(ROOT)) || {};
    } catch (error) {
      return {};
    }
  }

  function save(key, value) {
    root = get();
    root[key] = value;
    return localStorage.setItem(ROOT, JSON.stringify(root));
  }

  var root = get();

  // ---
  var THEME = 'BOARDGAME_THEME';
  window.__initialTheme = root[THEME] || 'dark';
  window.__setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
      'bp3-dark'
    );
    save(THEME, theme);
  };
  window.__setTheme(window.__initialTheme);

  // ---
  var SCREEN_WIDTH = 'BOARDGAME_SCREEN_WIDTH';
  window.__initialScreenWidth = root[SCREEN_WIDTH] || 'limited';
  window.__setScreenWidth = function (screenWidth) {
    document.documentElement.setAttribute('data-screen-width', screenWidth);
    save(SCREEN_WIDTH, screenWidth);
  };
  window.__setScreenWidth(window.__initialScreenWidth);

  // ---
  document.documentElement.setAttribute(
    'data-platform',
    navigator.platform.replace(
      /[A-Z]/g,
      (char, idx) => (idx === 0 ? '' : '-') + char.toLowerCase()
    )
  );
})();
