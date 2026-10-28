/* LyricPost — Satoshi v7
 * Default: title Black (900), artist Bold (700), lyrics Black (900).
 * This script keeps Satoshi choices in the existing font menu.
 * It does not modify search, cover art, or lyrics APIs.
 */
(function () {
  'use strict';

  const FONT_CSS = 'https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap';
  const SELECTOR = '#text-font-family';
  const IMAGE_SELECTOR = '.song-image';
  const DEFAULT = 'satoshi-auto';
  const PRESETS = [
    [DEFAULT, 'Satoshi — automático (Black / Bold / Black)', 'auto'],
    ['satoshi-medium', 'Satoshi Medium (500)', 'medium'],
    ['satoshi-bold', 'Satoshi Bold (700)', 'bold'],
    ['satoshi-black', 'Satoshi Black (900)', 'black'],
  ];

  function installFont() {
    if (document.querySelector('link[data-lyricpost-satoshi-v7]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_CSS;
    link.setAttribute('data-lyricpost-satoshi-v7', '');
    document.head.appendChild(link);
  }

  function installStyles() {
    if (document.getElementById('lyricpost-satoshi-v7-styles')) return;
    const style = document.createElement('style');
    style.id = 'lyricpost-satoshi-v7-styles';
    style.textContent = `
      /* Auto: title Black, artist Bold, lyrics Black */
      .song-image[data-satoshi-preset="auto"] .header .name,
      .song-image[data-satoshi-preset="auto"] .header .name * {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 900 !important;
      }
      .song-image[data-satoshi-preset="auto"] .header .authors,
      .song-image[data-satoshi-preset="auto"] .header .authors * {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 700 !important;
      }
      .song-image[data-satoshi-preset="auto"] .lyrics,
      .song-image[data-satoshi-preset="auto"] .lyrics * {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 900 !important;
      }

      /* Individual presets apply the chosen weight to all three texts. */
      .song-image[data-satoshi-preset="medium"] :is(.header .name, .header .authors, .lyrics),
      .song-image[data-satoshi-preset="medium"] :is(.header .name, .header .authors, .lyrics) * {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 500 !important;
      }
      .song-image[data-satoshi-preset="bold"] :is(.header .name, .header .authors, .lyrics),
      .song-image[data-satoshi-preset="bold"] :is(.header .name, .header .authors, .lyrics) * {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 700 !important;
      }
      .song-image[data-satoshi-preset="black"] :is(.header .name, .header .authors, .lyrics),
      .song-image[data-satoshi-preset="black"] :is(.header .name, .header .authors, .lyrics) * {
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 900 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // `FONT_STACKS` is a top-level `const` in the original site's classic script.
  // Such declarations are accessible from later scripts, but not via window.FONT_STACKS.
  function registerWithEditor() {
    try {
      if (typeof FONT_STACKS === 'object' && FONT_STACKS !== null) {
        for (const [value] of PRESETS) {
          FONT_STACKS[value] = "'Satoshi', sans-serif";
        }
      }
    } catch (error) {
      console.warn('[Satoshi] Não foi possível registrar a fonte no controlador.', error);
    }
  }

  function apply(value) {
    const image = document.querySelector(IMAGE_SELECTOR);
    if (!image) return;
    const preset = PRESETS.find(([name]) => name === value);
    if (preset) image.setAttribute('data-satoshi-preset', preset[2]);
    else image.removeAttribute('data-satoshi-preset');
  }

  function init() {
    installFont();
    installStyles();
    registerWithEditor();

    const select = document.querySelector(SELECTOR);
    if (!select) {
      console.warn('[Satoshi] Menu #text-font-family não encontrado.');
      return;
    }

    for (const [value, label] of [...PRESETS].reverse()) {
      if (!Array.from(select.options).some(option => option.value === value)) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        select.insertBefore(option, select.firstChild);
      }
    }

    // The combo is the default when the page opens, without having to choose it.
    select.value = DEFAULT;
    apply(DEFAULT);

    // Native font choices still work; switching away removes our CSS override.
    select.addEventListener('change', () => apply(select.value));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
