/*
  LINA palette: the 12 colours of tokens/colors.css and the rules for combining them
  (cores.html#s-estudo-de-contraste, #s-contrastes-a-usar, #s-contrastes-a-evitar). names[0] is always the background.
*/
(function (root) {
  'use strict';

  const COLORS = {
    ferro: '#A81F0D', areia: '#E1CE7A', creme: '#FAF5C6', damasco: '#FDD692',
    turquesa: '#64B6AC', umbro: '#2A1A12',
    'ferro-fundo': '#6E1408', 'turquesa-fundo': '#2F6A62', 'turquesa-tinta': '#14322E',
    nata: '#FDF1CF', fio: '#E6DFA2', 'fio-forte': '#C9B87A',
  };
  const FAMILIES = [
    ['ferro', 'ferro-fundo'], ['turquesa', 'turquesa-fundo', 'turquesa-tinta'],
    ['areia', 'fio', 'fio-forte'], ['creme', 'nata', 'damasco'], ['umbro'],
  ];
  // Unordered pairs from cores.html#s-contrastes-a-evitar.
  const AVOID = [
    ['ferro', 'turquesa'], ['turquesa', 'creme'], ['areia', 'creme'],
    ['damasco', 'areia'], ['ferro', 'umbro'], ['turquesa-fundo', 'ferro'],
  ];

  const NAMES = Object.keys(COLORS);
  const hex = (c) => Object.hasOwn(COLORS, c) ? COLORS[c] : c;
  function lum(c) {
    const h = hex(c).replace('#', '');
    const [r, g, b] = [0, 2, 4].map((i) => {
      const v = parseInt(h.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a, b) {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  }
  const family = (n) => FAMILIES.findIndex((f) => f.includes(n));
  const avoided = (a, b) => AVOID.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
  const no = (reason) => ({ ok: false, kind: null, reason });

  function pair(a, b) {
    if (a === b) return no(`${a} sobre ${a}: mesma cor.`);
    if (family(a) === family(b)) return { ok: true, kind: 'mono', reason: '' };
    if (avoided(a, b)) return no(`${a} com ${b}: par a evitar (cores.html#s-contrastes-a-evitar).`);
    const c = contrast(a, b);
    if (c < 3) return no(`${a} com ${b}: contraste ${c.toFixed(1)} abaixo de 3.`);
    return { ok: true, kind: 'duo', reason: '' };
  }

  function check(names) {
    if (!Array.isArray(names) || names.length < 2 || names.length > 3)
      return no('Use 2 ou 3 cores.');
    const bad = names.find((n) => !Object.hasOwn(COLORS, n));
    if (bad !== undefined)
      return no(`Cor desconhecida: "${bad}". Nomes válidos: ${NAMES.join(', ')}.`);
    const d = pair(names[0], names[1]);
    if (names.length === 2) return d;
    if (!d.ok || d.kind !== 'duo') return d.ok ? no('Trio precisa de um duo como base.') : d;
    if (names[2] === names[0]) return no('A terceira cor não pode repetir o fundo.');
    if (names[2] === names[1]) return no('A terceira cor não pode repetir a segunda.');
    return { ok: true, kind: 'trio', reason: '' };
  }

  // Faixas de tom [escuros, médios, claros]: cada uma um nome ou 'none' (transparente).
  // Três pares podem se tocar (tinta sobre tinta, tinta sobre fundo); todos passam pela regra do par.
  function checkTones(t) {
    if (!Array.isArray(t) || t.length !== 3) return no('tones precisa de 3 itens: escuros, médios, claros.');
    const bad = t.find((n) => n !== 'none' && !Object.hasOwn(COLORS, n));
    if (bad !== undefined) return no(`Cor desconhecida: "${bad}". Use none ou: ${NAMES.join(', ')}.`);
    if (t.every((n) => n === 'none')) return no('tones precisa de ao menos uma faixa com cor.');
    for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
      // só escuros e médios podem repetir a cor (é uma tinta só); com o fundo seria invisível
      if (t[i] === 'none' || t[j] === 'none' || (i === 0 && j === 1 && t[i] === t[j])) continue;
      const r = pair(t[i], t[j]);
      if (!r.ok) return r;
    }
    return { ok: true, kind: null, reason: '' };
  }

  function combos(kind) {
    const out = [];
    for (const a of NAMES) for (const b of NAMES) {
      if (kind !== 'trio') { if (check([a, b]).kind === kind) out.push([a, b]); continue; }
      for (const c of NAMES) if (check([a, b, c]).kind === 'trio') out.push([a, b, c]);
    }
    return out;
  }

  root.LinaPalette = { COLORS, FAMILIES, AVOID, contrast, check, checkTones, combos };
})(typeof window !== 'undefined' ? window : globalThis);
