/*
 * LyricPost - fonte Satoshi (Fontshare)
 * Padrao: Medium (500) nas letras e no artista; Bold (700) no titulo.
 * Versao 3 - substitui as versoes anteriores de satoshi-addon.js.
 * Inclusao recomendada no index.html, logo DEPOIS de index.js:
 * <script src="satoshi-addon.js?v=3"></script>
 */
(() => {
  'use strict';

  const FONT_FAMILY = "'Satoshi', Arial, sans-serif";
  const FONT_CSS = 'https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap';
  const AUTO = 'satoshi-auto';

  // Carrega a fonte da Fontshare, sem hospedar arquivos da fonte no repositorio.
  if (!document.getElementById('lyricpost-satoshi-font')) {
    const link = document.createElement('link');
    link.id = 'lyricpost-satoshi-font';
    link.rel = 'stylesheet';
    link.href = FONT_CSS;
    document.head.appendChild(link);
    link.addEventListener('load', preloadFonts);
  }

  // Mantem a compatibilidade com o seletor de fontes original do LyricPost.
  try {
    if (typeof FONT_STACKS !== 'undefined' && FONT_STACKS) {
      FONT_STACKS[AUTO] = FONT_FAMILY;
      FONT_STACKS['satoshi-medium'] = FONT_FAMILY;
      FONT_STACKS['satoshi-bold'] = FONT_FAMILY;
    }
  } catch (error) {
    console.warn('[LyricPost Satoshi] Nao foi possivel registrar a fonte:', error);
  }

  // As regras valem tambem para a imagem gerada a partir de .song-image.
  // !important evita que as configuracoes gerais da fonte substituam os pesos.
  const style = document.createElement('style');
  style.id = 'lyricpost-satoshi-styles';
  style.textContent = `
    body[data-lyricpost-satoshi="auto"] .song-image .lyrics,
    body[data-lyricpost-satoshi="auto"] .song-image .lyrics *,
    body[data-lyricpost-satoshi="auto"] .song-image .header .authors,
    body[data-lyricpost-satoshi="auto"] .song-image .header .authors * {
      font-family: ${FONT_FAMILY} !important;
      font-weight: 500 !important;
    }
    body[data-lyricpost-satoshi="auto"] .song-image .header .name,
    body[data-lyricpost-satoshi="auto"] .song-image .header .name * {
      font-family: ${FONT_FAMILY} !important;
      font-weight: 700 !important;
    }
    body[data-lyricpost-satoshi="medium"] .song-image .lyrics,
    body[data-lyricpost-satoshi="medium"] .song-image .lyrics *,
    body[data-lyricpost-satoshi="medium"] .song-image .header .name,
    body[data-lyricpost-satoshi="medium"] .song-image .header .name *,
    body[data-lyricpost-satoshi="medium"] .song-image .header .authors,
    body[data-lyricpost-satoshi="medium"] .song-image .header .authors * {
      font-family: ${FONT_FAMILY} !important;
      font-weight: 500 !important;
    }
    body[data-lyricpost-satoshi="bold"] .song-image .lyrics,
    body[data-lyricpost-satoshi="bold"] .song-image .lyrics *,
    body[data-lyricpost-satoshi="bold"] .song-image .header .name,
    body[data-lyricpost-satoshi="bold"] .song-image .header .name *,
    body[data-lyricpost-satoshi="bold"] .song-image .header .authors,
    body[data-lyricpost-satoshi="bold"] .song-image .header .authors * {
      font-family: ${FONT_FAMILY} !important;
      font-weight: 700 !important;
    }
  `;
  document.head.appendChild(style);

  const select = document.getElementById('text-font-family');
  if (!select) {
    console.warn('[LyricPost Satoshi] Seletor #text-font-family nao encontrado.');
    return;
  }

  // Substitui qualquer opcao antiga Satoshi, mas preserva as fontes originais.
  const oldOption = select.querySelector('option[value="satoshi"]');
  if (oldOption) oldOption.remove();
  const choices = [
    {value: AUTO, label: 'Satoshi — automatico (Medium letras / Bold titulo)'},
    {value: 'satoshi-medium', label: 'Satoshi Medium (500)'},
    {value: 'satoshi-bold', label: 'Satoshi Bold (700)'},
  ];
  for (const {value, label} of choices) {
    let option = Array.from(select.options).find(o => o.value === value);
    if (!option) {
      option = document.createElement('option');
      option.value = value;
      select.add(option);
    }
    option.textContent = label;
  }

  const modes = {
    [AUTO]: 'auto',
    'satoshi-medium': 'medium',
    'satoshi-bold': 'bold'
  };
  const sync = () => {
    if (Object.prototype.hasOwnProperty.call(modes, select.value)) {
      document.body.dataset.lyricpostSatoshi = modes[select.value];
    } else {
      delete document.body.dataset.lyricpostSatoshi;
    }
  };
  select.addEventListener('input', sync);
  select.addEventListener('change', sync);

  // Novo padrao para toda abertura do site / nova musica.
  select.value = AUTO;
  sync();

  // Notifica o controlador original depois que todos os scripts estiverem prontos.
  function notifyControllers() {
    if (select.value === AUTO) {
      select.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', notifyControllers, {once: true});
  } else {
    notifyControllers();
  }

  // Solicita os dois pesos para reduzir trocas de fonte na previa e no PNG.
  function preloadFonts() {
    if (!document.fonts || !document.fonts.load) return;
    Promise.all([
      document.fonts.load('500 20px Satoshi'),
      document.fonts.load('700 20px Satoshi')
    ]).catch(error => {
      console.warn('[LyricPost Satoshi] Falha ao carregar as fontes:', error);
    });
  }
})();
