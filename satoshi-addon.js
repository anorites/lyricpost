/*
 * LyricPost — complemento para a fonte Satoshi (Fontshare)
 * Coloque este arquivo na raiz do repositório e carregue-o logo após
 * <script src="classes/constants.js"></script> em index.html.
 *
 * A fonte é carregada dos servidores oficiais da Fontshare.
 * Não redistribua os arquivos da fonte no repositório.
 */
(() => {
  "use strict";

  // Fontes disponíveis: Light, Regular, Medium, Bold e Black.
  const fontUrl =
    "https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap";

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = fontUrl;
  document.head.appendChild(stylesheet);

  // Registra a fonte junto às demais famílias usadas pelo LyricPost.
  try {
    if (typeof FONT_STACKS !== "undefined" && FONT_STACKS) {
      FONT_STACKS.satoshi = "'Satoshi', Arial, sans-serif";
    } else {
      console.warn("[LyricPost/Satoshi] FONT_STACKS não encontrado.");
    }
  } catch (error) {
    console.warn("[LyricPost/Satoshi] Não foi possível registrar FONT_STACKS:", error);
  }

  // Adiciona a opção ao seletor já existente na aba Text.
  const select = document.getElementById("text-font-family");
  if (select && !select.querySelector('option[value="satoshi"]')) {
    const option = document.createElement("option");
    option.value = "satoshi";
    option.textContent = "Satoshi (Fontshare)";
    select.insertBefore(option, select.options[1] || null);
  }

  // Reserva uma regra de estilo de suporte caso a versão do LyricPost
  // use uma tabela de fontes diferente da esperada.
  const fallbackStyle = document.createElement("style");
  fallbackStyle.textContent = `
    body.lyricpost-satoshi .song-image .lyrics,
    body.lyricpost-satoshi .song-image .header .name,
    body.lyricpost-satoshi .song-image .header .authors {
      font-family: 'Satoshi', Arial, sans-serif !important;
    }
  `;
  document.head.appendChild(fallbackStyle);

  if (select) {
    const syncSelection = () => {
      document.body.classList.toggle("lyricpost-satoshi", select.value === "satoshi");
    };
    select.addEventListener("change", syncSelection);
    select.addEventListener("input", syncSelection);
    syncSelection();
  }

  // Antecipamos o carregamento dos pesos mais usados na prévia e no PNG.
  stylesheet.addEventListener("load", () => {
    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('400 19px "Satoshi"'),
        document.fonts.load('700 19px "Satoshi"'),
      ]).catch((error) => {
        console.warn("[LyricPost/Satoshi] Falha ao pré-carregar a fonte:", error);
      });
    }
  });
})();
