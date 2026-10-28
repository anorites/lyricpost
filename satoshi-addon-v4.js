(function () {
  const FONT_CSS_URL = 'https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap';

  function loadSatoshi() {
    if (!document.querySelector('link[data-satoshi-fontshare]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FONT_CSS_URL;
      link.setAttribute('data-satoshi-fontshare', 'true');
      document.head.appendChild(link);
    }
  }

  function injectStyles() {
    if (document.getElementById('satoshi-defaults-style')) return;

    const style = document.createElement('style');
    style.id = 'satoshi-defaults-style';
    style.textContent = `
      .lyrics {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 900 !important;
      }

      .header .name,
      .song-name,
      .track-name {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 700 !important;
      }

      .header .artist,
      .header .artists,
      .artist-name,
      .track-artist,
      .song-artist,
      .header .artist *,
      .header .artists * {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 500 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function patchFontStacks() {
    if (typeof window.FONT_STACKS !== 'object' || !window.FONT_STACKS) return;

    window.FONT_STACKS['satoshi-medium'] = "'Satoshi', sans-serif";
    window.FONT_STACKS['satoshi-bold'] = "'Satoshi', sans-serif";
    window.FONT_STACKS['satoshi-black'] = "'Satoshi', sans-serif";
  }

  function addOption(select, value, label) {
    if (!select || select.querySelector(`option[value="${value}"]`)) return;

    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }

  function patchFontSelect() {
    const select = document.getElementById('text-font-family');
    if (!select) return;

    addOption(select, 'satoshi-medium', 'Satoshi Medium (500)');
    addOption(select, 'satoshi-bold', 'Satoshi Bold (700)');
    addOption(select, 'satoshi-black', 'Satoshi Black (900)');
  }

  function setDefaults() {
    document.documentElement.style.setProperty('--satoshi-title-weight', '700');
    document.documentElement.style.setProperty('--satoshi-artist-weight', '500');
    document.documentElement.style.setProperty('--satoshi-lyrics-weight', '900');
  }

  function boot() {
    loadSatoshi();
    patchFontStacks();
    patchFontSelect();
    injectStyles();
    setDefaults();
  }

  const observer = new MutationObserver(() => {
    patchFontStacks();
    patchFontSelect();
    injectStyles();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      boot();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    boot();
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
