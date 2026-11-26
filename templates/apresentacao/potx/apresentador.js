// Janela do apresentador do deck HTML (o html.js injeta este arquivo só quando há notas). Adaptado do Vision.
// O runtime do deck-stage carrega as notas, mas só as mostra dentro de um aplicativo hospedeiro; aqui:
//   N  abre o apresentador: nota atual (fonte ajustada para caber), slide atual grande, próximo pequeno com o começo da nota dele, cronômetro, hora.
//      É uma janela comum: arraste para a tela do notebook e maximize, ou use F nela para tela cheia.
// No apresentador: setas, espaço, PageUp e PageDown movem o deck; P inicia ou pausa o cronômetro; R zera.
// O cronômetro começa sozinho na primeira troca de slide. Sem contagem regressiva (decisão do Vision).
// Notas: array JSON em #speaker-notes. Miniaturas: img/miniaturas/s-NN.jpg (o make.sh gera do PDF).
// F e H do deck principal ficam no html.js.
(() => {
  const notes = JSON.parse(document.getElementById('speaker-notes')?.textContent || '[]');
  const deck = () => document.querySelector('deck-stage');
  const url = (p) => new URL(p, location.href).href;
  let cur = 0, total = notes.length, win = null;
  let start = 0, banked = 0, running = false, tick = null; // cronômetro: ms acumulados + (agora - início) enquanto roda

  const esc = (t) => t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const mmss = (ms) => { const s = Math.floor(Math.abs(ms) / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  const img = (i) => url(`img/miniaturas/s-${String(i + 1).padStart(String(total).length, '0')}.jpg?v=${encodeURIComponent(document.lastModified)}`); // build novo, imagens novas
  const $ = (id) => win.document.getElementById(id);
  const live = () => win && !win.closed;

  const clock = () => {
    if (!live()) return;
    const el = (running ? Date.now() - start : 0) + banked;
    $('t').textContent = mmss(el);
    $('pp').textContent = running ? 'Pausar' : (el ? 'Continuar' : 'Iniciar');
    $('clk').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const toggle = () => { if (running) { banked += Date.now() - start; running = false; } else { start = Date.now(); running = true; } clock(); };
  const reset = () => { banked = 0; running = false; clock(); };

  const paint = () => {
    if (!live()) return;
    $('n').textContent = `${cur + 1} / ${total}`;
    $('ci').src = img(cur);
    const last = cur + 1 >= total;
    $('ni').hidden = last; $('end').hidden = !last;
    if (!last) $('ni').src = img(cur + 1);
    $('notes').innerHTML = notes[cur] ? notes[cur].split(/\n+/).map((p) => `<p>${esc(p)}</p>`).join('') : '<p class="none">Sem notas neste slide.</p>';
    $('nl').textContent = last ? 'Próximo' : `Próximo · ${cur + 2}`;
    $('nn').textContent = (notes[cur + 1] || '').split(/\n+/)[0]; // começo da próxima nota: só a primeira linha, em cinza
    fitNotes();
  };
  // Maior fonte (12–40 px) em que a nota cabe na coluna sem rolar.
  const fitNotes = () => {
    if (!live()) return;
    const el = $('notes'); let lo = 12, hi = 40;
    while (hi - lo > 0.5) { const m = (lo + hi) / 2; el.style.fontSize = m + 'px'; if (el.scrollHeight <= el.clientHeight) lo = m; else hi = m; }
    el.style.fontSize = lo + 'px';
  };

  const keys = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const d = deck(), k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) d?.next();
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) d?.prev();
    else if (k === 'Home') d?.goTo(0);
    else if (k === 'End') d?.goTo(total - 1);
    else if (k.toLowerCase() === 'p') toggle();
    else if (k.toLowerCase() === 'r') reset();
    else if (k.toLowerCase() === 'f') { const d = win.document; d.fullscreenElement ? d.exitFullscreen() : d.documentElement.requestFullscreen(); }
    else return;
    e.preventDefault();
  };

  const CSS = `
    body{margin:0;height:100vh;display:grid;grid-template-rows:auto 1fr;background:#2A1A12;color:#FAF5C6;
      font-family:'Outfit Light',system-ui,sans-serif;overflow:hidden}
    .bar{display:flex;flex-wrap:wrap;gap:12px 16px;align-items:center;padding:10px 16px;border-bottom:1px solid #6E1408;
      font:15px 'JetBrains Mono',monospace;color:#E6DFA2}
    #t{font-size:34px;color:#FDD692;padding:0 6px;border-radius:4px}
    #n{font-size:20px;color:#FAF5C6}
    .sp{flex:1}
    button{font:inherit;background:none;color:#FAF5C6;border:1px solid #C9B87A;border-radius:4px;padding:4px 10px;cursor:pointer}
    button:hover,button:focus-visible{background:#6E1408;outline:none}
    .main{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:16px;min-height:0}
    .col{display:flex;flex-direction:column;gap:8px;min-height:0}
    #ci{width:auto;max-width:100%;max-height:calc(100vh - 300px);align-self:start}
    .next{display:grid;grid-template-columns:32% 1fr;gap:16px;align-items:start;margin-top:8px;padding-top:16px;border-top:1px solid #6E1408}
    #ni{opacity:.55;outline:1px solid #C9B87A} /* pequeno e apagado: não confundir com o atual */
    .aviso{margin:auto 0 0;font:12px 'JetBrains Mono',monospace;color:#C9B87A}
    .lab{margin:0;font:12px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#C9B87A}
    img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#000}
    #end{aspect-ratio:16/9;display:grid;place-items:center;margin:0;border:1px dashed #C9B87A;color:#C9B87A;
      font:15px 'JetBrains Mono',monospace}
    #end[hidden],img[hidden]{display:none}
    #notes{flex:1;min-height:0;overflow:hidden;line-height:1.4}
    #notes p{margin:0 0 .6em} #notes .none{color:#C9B87A}
    #nn{margin:8px 0 0;color:#C9B87A;font-size:15px;line-height:1.3;max-height:5.2em;overflow:hidden}`;
  const HTML = `
    <div class="bar">
      <span id="t">00:00</span><button id="pp">Iniciar</button><button id="rs">Zerar</button>
      <span class="sp"></span>
      <button id="pv" aria-label="Slide anterior">◀</button><span id="n"></span><button id="nx" aria-label="Próximo slide">▶</button>
      <span class="sp"></span><span id="clk"></span>
    </div>
    <div class="main">
      <div class="col"><p class="lab">Notas</p><div id="notes"></div></div>
      <div class="col"><p class="lab">Atual</p><img id="ci" alt="Slide atual">
        <div class="next"><div><img id="ni" alt="Próximo slide"><p id="end" hidden>Fim do deck</p></div>
          <div><p class="lab" id="nl">Próximo</p><p id="nn"></p></div></div>
        <p class="aviso">Miniaturas estáticas: vídeos e animações aparecem parados.</p></div>
    </div>`;

  const open = async () => {
    if (live()) { win.focus?.(); return; }
    // Popup comum, não Document Picture-in-Picture: janela PiP não maximiza nem vai a tela cheia.
    // O Chrome transforma popup do tamanho da tela em aba: abrir menor e maximizar depois.
    const w = Math.round(screen.availWidth * 0.8), h = Math.round(screen.availHeight * 0.8);
    // Nome novo a cada vez: o Chrome reaproveita aba que já tem o nome, mesmo aberta como aba antes.
    win = window.open('', 'lina-apresentador-' + Date.now(), `popup=yes,width=${w},height=${h},left=40,top=40`);
    if (!win) return; // popup bloqueado
    const d = win.document;
    d.head.innerHTML = `<meta charset="utf-8"><link rel="stylesheet" href="${url('fonts.css')}"><style>${CSS}</style>`;
    d.title = 'Apresentador · ' + document.title; // depois do head: o innerHTML apagaria o <title>
    d.documentElement.lang = document.documentElement.lang || 'pt-BR';
    d.body.innerHTML = HTML;
    $('pp').onclick = toggle; $('rs').onclick = reset;
    $('pv').onclick = () => deck()?.prev(); $('nx').onclick = () => deck()?.next();
    d.addEventListener('keydown', keys);
    const dk = deck(); if (dk) { cur = dk.index; total = dk.length || total; }
    paint(); clock();
    clearInterval(tick); tick = setInterval(clock, 1000);
    win.addEventListener('pagehide', () => clearInterval(tick));
    win.addEventListener('resize', fitNotes);
    win.document.fonts?.ready.then(fitNotes);
  };

  document.addEventListener('slidechange', (e) => {
    cur = e.detail.index; total = e.detail.total;
    if (e.detail.reason !== 'init' && !running && !banked) toggle(); // a primeira troca inicia o cronômetro
    paint();
  });
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === 'n') open();
  });
})();
