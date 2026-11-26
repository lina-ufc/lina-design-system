// Transições tipo morph para o deck HTML (o html.js injeta este arquivo só com opcoes.transicoes = true). Do Vision.
// A cada troca de slide, os filhos diretos do slide que sai e do que entra são pareados:
//   - elemento idêntico (mesma marcação e lugar): fica parado, sem animação (rodapé, rótulo, título repetido);
//   - mesmo conteúdo em outro lugar ou tamanho: desliza da caixa antiga para a nova (FLIP);
//   - o resto: os antigos somem juntos, os novos sobem um a um (ordem de leitura).
// Filhos com animação de entrada própria (capa, imagens em fade aleatório) ficam com ela.
// Nada se move com prefers-reduced-motion, no primeiro slide mostrado ou na impressão.
(() => {
  // ms, menos RISE (px do canvas). STEP: intervalo entre partes que entram; SPAN limita a cascata em slides cheios.
  const FADE = 420, OUT = 180, IN = 560, STEP = 110, SPAN = 900, RISE = 28, MOVE = 620, EASE = 'cubic-bezier(.2,.8,.2,1)';
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let running = [];

  // Chave de conteúdo: o que faz dois elementos serem "a mesma coisa" mesmo movidos ou redimensionados.
  const key = (el) => {
    const src = el.getAttribute('src') || el.querySelector?.('img,video')?.getAttribute('src');
    if (src) return el.tagName + '|' + src;
    const t = el.textContent.replace(/\s+/g, ' ').trim();
    return t ? el.tagName + '|' + t : null;
  };
  // Idêntico = mesma tag, mesmo estilo próprio (como o navegador serializa, menos o que este script anima) e mesma
  // marcação interna, ignorando a numeração por slide do gerador (data-dc-tpl).
  const exact = (el) => el.tagName + (el.style?.cssText ?? '').replace(/\s*(opacity|transform|transform-origin)\s*:[^;]*;?/g, '').trim() +
    el.innerHTML.replace(/ data-dc-tpl="[^"]*"/g, '');
  // Mesma tag na mesma caixa (px do canvas): o mesmo lugar, seja o que for que tenha agora.
  const box = (el) => { const r = el.getBoundingClientRect(); return el.tagName + [r.left, r.top, r.width, r.height].map(Math.round).join(); };
  const kids = (s) => [...s.children].filter((c) => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE');

  const finish = () => { running.forEach((f) => f()); running = []; };

  document.addEventListener('slidechange', (e) => {
    finish();
    const { slide: to, previousSlide: from, reason } = e.detail;
    if (!from || !to || reason === 'init' || still.matches) return;

    // Mantém o slide que sai na tela enquanto suas partes somem (o deck-stage o esconde na hora). O estilo inline é
    // salvo inteiro e devolvido depois: o fundo dos slides usa a forma curta, e limpar uma propriedade o perde.
    const keep = [from.style.cssText, to.style.cssText];
    Object.assign(from.style, { visibility: 'visible', opacity: '1', zIndex: '1' });
    to.style.zIndex = '2';
    const anims = [];
    running.push(() => {
      anims.forEach((a) => a.cancel());
      [from.style.cssText, to.style.cssText] = keep;
    });

    const old = kids(from), oldExact = new Map(), oldKey = new Map(), oldBox = new Map(), used = new Set(), enter = [];
    // Fundos diferentes (capa, encerramento): o fundo do slide que entra aparece em fade sobre o que sai e nada é
    // pareado. Mesmo fundo: o fundo que entra fica transparente enquanto as partes antigas somem.
    const bg = (s) => { const c = getComputedStyle(s); return c.backgroundColor + c.backgroundImage; };
    const swap = bg(from) !== bg(to);
    if (swap) anims.push(to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE, easing: 'ease-out' }));
    else {
      Object.assign(to.style, { backgroundColor: 'transparent', backgroundImage: 'none' });
      old.forEach((c) => { oldExact.set(exact(c), c); oldBox.set(box(c), c); const k = key(c); if (k && !oldKey.has(k)) oldKey.set(k, c); });
    }
    // O deck-stage escala o canvas de 1920 x 1080; os deslocamentos do FLIP são em px de tela, então divide pela escala.
    const scale = to.getBoundingClientRect().width / to.offsetWidth || 1;

    kids(to).forEach((c) => {
      const same = oldExact.get(exact(c));
      if (same && !used.has(same)) { used.add(same); same.style.opacity = '0'; return; }  // idêntico: só troca
      const k = key(c), prev = k && oldKey.get(k);
      if (prev && !used.has(prev)) {                                                  // movido ou redimensionado: desliza
        used.add(prev); prev.style.opacity = '0';
        const a = prev.getBoundingClientRect(), b = c.getBoundingClientRect();
        // Imagem escala entre caixas; texto só se move: a caixa pode mudar de largura (rótulo de 4 colunas num
        // layout, 12 no outro) e as letras mantêm o tamanho; escalar a caixa esticava as letras.
        const pic = /^(IMG|VIDEO|svg|CANVAS)$/.test(c.tagName) || c.querySelector?.('img,video');
        const dx = (a.left - b.left) / scale, dy = (a.top - b.top) / scale;
        const sz = pic ? ` scale(${a.width / b.width},${a.height / b.height})` : '';
        if (b.width && b.height && (sz || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)) {
          anims.push(c.animate([{ transformOrigin: '0 0', transform: `translate(${dx}px,${dy}px)${sz}` },
            { transformOrigin: '0 0', transform: 'none' }], { duration: MOVE, easing: EASE }));
        }
        return;
      }
      const over = oldBox.get(box(c));
      if (over && !used.has(over) && /^(IMG|VIDEO|svg|CANVAS)$/.test(c.tagName)) {   // mesma caixa, figura nova (montada em
        used.add(over);                                                               // etapas): fade sobre ela. Texto
        // nunca faz isso: as palavras antigas apareceriam sob as novas até elas entrarem.
        anims.push(c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: IN, easing: 'ease-out' }));
        return;
      }
      if (c.getAnimations().length || c.tagName === 'LINA-DITHER-FIELD') return;     // animação própria ou fundo
      enter.push(c);
    });
    if (!swap) old.filter((c) => !used.has(c)).forEach((c) => anims.push(c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: OUT, easing: 'ease-in', fill: 'forwards' })));

    // Partes novas entram uma a uma: linha a linha de cima para baixo, da esquerda para a direita (centros verticais
    // dentro de uma calha da grade contam como uma linha, então disco e rótulo vão juntos); imagens grandes por último.
    const pos = new Map(enter.map((c) => [c, c.getBoundingClientRect()]));
    const r0 = to.getBoundingClientRect(), row = (r) => Math.round((r.top - r0.top + r.height / 2) / scale / 24);
    const big = (c) => /^(IMG|VIDEO|svg|CANVAS)$/.test(c.tagName) && pos.get(c).width * pos.get(c).height > 0.15 * r0.width * r0.height;
    enter.sort((a, b) => { const p = pos.get(a), q = pos.get(b); return big(a) - big(b) || row(p) - row(q) || p.left - q.left; });
    const step = Math.min(STEP, SPAN / Math.max(enter.length, 1));
    enter.forEach((c, i) => anims.push(c.animate(
      [{ opacity: 0, transform: `translateY(${RISE}px)` }, { opacity: 1, transform: 'none' }],
      { duration: IN, delay: OUT + i * step, easing: EASE, fill: 'backwards' })));

    const t = setTimeout(() => {
      old.forEach((c) => { c.style.opacity = ''; });
      finish();
    }, Math.max(MOVE, OUT + enter.length * step + IN) + 40);
    running.push(() => { clearTimeout(t); old.forEach((c) => { c.style.opacity = ''; }); });
  });
})();
