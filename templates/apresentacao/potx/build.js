// Gera o template LINA de apresentação (16:9, 1920 × 1080 px de referência).
// Uso: node build.js  →  out/LINA-Apresentacao.pptx (depois post.py faz rodapé, cantos e .potx).
// Os layouts seguem as receitas do deck de tese (UniPG) traduzidas para a identidade LINA.
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const A = (f) => path.join(__dirname, f);
const { resolve, pad, contido } = require('./param.js');

const X = (px) => px / 144;   // px para polegadas
const P = (px) => px / 2;     // px para pt
const C = { ferro:'A81F0D', areia:'E1CE7A', creme:'FAF5C6', damasco:'FDD692', turquesa:'64B6AC',
  umbro:'2A1A12', ferroFundo:'6E1408', ferroPt:'8A1A0B', turquesaFundo:'2F6A62', nata:'FDF1CF', fio:'E6DFA2', fioForte:'C9B87A' };
const F = { light:'Outfit Light', medium:'Outfit Medium', bold:'Outfit ExtraBold', mono:'JetBrains Mono', math:'STIX Two Math' };

// Grade modular: margem de 72 nas laterais e no topo; embaixo, calha de 24 até o rodapé de 84 (y = 996).
// Faixa do rótulo da seção: 72 a 108 (36), depois calha de 24. Nada além do rótulo entra na faixa.
// Módulos começam em 132: 12 colunas de 126 × 6 linhas de 120, calha de 24 nos dois sentidos.
// Colunas em 72 + 150·i; linhas em 132 + 144·i (132, 276, 420, 564, 708, 852; fim em 972). Título do slide na linha 0.
const M = 72, G = 24, CW = 126, RH = 120, BAND = 36, FOOT_Y = 996, W = 1920, FW = W - 2 * M;
const col = (i, s = 1) => [M + i * (CW + G), s * CW + (s - 1) * G];
const row = (i, s = 1) => [M + BAND + G + i * (RH + G), s * RH + (s - 1) * G];
const TOP = M, TY = row(0)[0], CT = row(1)[0], CB = row(5)[0] + RH;
const R = 22; // raio dos cantos (¼ de célula na escala do slide)

// ---------- ativos gerados ----------
// Nomes antigos (Lucide) mantidos como chave para os decks; o desenho é Phosphor regular.
const PH_NOME = { 'building-2': 'buildings', landmark: 'bank', sprout: 'plant', 'scan-line': 'scan', map: 'map-trifold', layers: 'stack',
  'drafting-compass': 'compass-tool', box: 'cube', radar: 'target', library: 'books', bot: 'robot', 'scan-search': 'magnifying-glass', glasses: 'eyeglasses' };
const PHD = fs.existsSync(A('phosphor/regular')) ? A('phosphor') : A('../../../assets/icons/phosphor'), PH = path.join(PHD, 'regular');
// Páginas de ícones para copiar e colar (só no .pptx): ladrilho e ícone num PNG só, um clique copia os dois.
const BIB = ['atom','bank','bell','books','buildings','camera','chart-line','compass-tool','cpu','cube','database','flask','graduation-cap','lightbulb','magnifying-glass','map-trifold','monitor','plant','robot','ruler','stack','users'];
const TRAT = [ // [rótulo, peso, ladrilho, traço, plano do duotone]
  [['Sólido', 'regular', C.ferro, C.creme], ['Cheio', 'fill', C.ferro, C.creme]],
  [['Claro', 'regular', C.damasco, C.ferro], ['Simples', 'regular', null, C.ferro]],
  [['Quente', 'duotone', C.creme, C.ferro, C.damasco], ['Terra', 'duotone', C.creme, C.umbro, C.areia], ['Frio', 'duotone', C.creme, C.turquesaFundo, C.turquesa], ['Painel', 'duotone', C.damasco, C.ferro, C.creme]],
  [['Capa', 'duotone', C.ferro, C.creme, C.ferroFundo], ['Dado', 'duotone', C.turquesa, '14322E', C.creme], ['Noturno', 'duotone', C.umbro, C.areia, C.ferroFundo]]];
const bibPng = (t, n) => A(`gen/bib-${t[0].toLowerCase()}-${n}.png`);
const ICONS = ['atom','building-2','landmark','sprout','scan-line','map','ruler','layers','database','cpu','users','camera','drafting-compass','box','radar','chart-line','bell','monitor','library','bot','scan-search','glasses'];
async function assets() {
  fs.mkdirSync(A('gen'), { recursive: true });
  for (const n of ICONS) for (const [tag, color] of [['ferro', '#' + C.ferro], ['creme', '#' + C.creme]]) {
    const out = A(`gen/${n}-${tag}.png`);
    if (fs.existsSync(out)) continue;
    const svg = fs.readFileSync(path.join(PH, `${PH_NOME[n] || n}.svg`), 'utf8').replace(/currentColor/g, color);
    await sharp(Buffer.from(svg), { density: 1200 }).resize(256, 256).png().toFile(out);
  }
  for (const t of TRAT.flat()) for (const n of BIB) {
    const [, peso, bg, fg, dt] = t, out = bibPng(t, n);
    if (fs.existsSync(out)) continue;
    let body = fs.readFileSync(path.join(PHD, peso, `${n}.svg`), 'utf8').trim().replace(/^<svg[^>]*>|<\/svg>$/g, '');
    if (dt) body = body.replace(/opacity="0.2"/g, `fill="#${dt}"`);
    const k = bg ? 0.5625 : 0.8, o = 128 * (1 - k); // dentro do ladrilho, ícone a 9/16 do lado (como no capítulo 6)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" rx="64" fill="#${bg}"/>` : ''}<g fill="#${fg}" transform="translate(${o} ${o}) scale(${k})">${body}</g></svg>`;
    await sharp(Buffer.from(svg), { density: 600 }).resize(384, 384).png().toFile(out);
  }
  // Imagem provisória: nata com hachura de fio forte (como o espaço vazio do deck HTML).
  const hatch = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="28" stroke="#${C.fioForte}" stroke-width="2"/></pattern></defs><rect width="100%" height="100%" fill="#${C.nata}"/><rect width="100%" height="100%" fill="url(#p)"/></svg>`;
  await sharp(Buffer.from(hatch(1600, 1000))).png().toFile(A('gen/provisoria.png'));
  for (const r of [150, 133, 75, 100]) await sharp(Buffer.from(hatch(1200, Math.round(120000 / r)))).png().toFile(A(`gen/prov-${r}.png`)); // proporção r/100 (largura/altura)
  // Seta ferro do 5.3 · antes e depois (traço de 14 px, pontas redondas), desenhada aqui para o .pptx e o HTML saírem iguais.
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><g fill="none" stroke="#${C.ferro}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"><path d="M16 80H224M156 24L224 80L156 136"/></g></svg>`)).png().toFile(A('gen/seta-ferro.png'));
  // Espaço de logo de parceiro (3:1): retângulo creme vazado, como o da capa.
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="837" height="279"><rect x="3" y="3" width="831" height="273" fill="none" stroke="#${C.creme}" stroke-width="6" stroke-dasharray="24 14"/><text x="418.5" y="150" text-anchor="middle" font-family="JetBrains Mono" font-size="54" fill="#${C.creme}">Logo parceiro</text></svg>`)).png().toFile(A('gen/logo-parceiro.png'));
}

// ---------- peças de layout ----------
const PT = { pic: 'image', tbl: 'table' };
const ph = (name, type, [x, y, w, h], opts = {}, text) => ({ placeholder: { options: { name, type: PT[type] || type,
  x: X(x), y: X(y), w: X(w), h: X(h), margin: 0, align: 'left', valign: 'top',
  ...(type === 'pic' || type === 'obj' || type === 'media' || type === 'chart' || type === 'tbl'
    ? { fontFace: F.mono, fontSize: P(22), color: C.umbro, align: 'center', valign: 'middle' } : {}), ...opts }, text } });
const S = {
  label: { fontFace: F.mono, fontSize: P(22), color: C.ferro },
  title: { fontFace: F.bold, fontSize: P(60), color: C.umbro, lineSpacingMultiple: 0.95 },
  sub:   { fontFace: F.medium, fontSize: P(32), color: C.umbro, lineSpacingMultiple: 1.1 },
  body:  { fontFace: F.light, fontSize: P(28), color: C.umbro, lineSpacingMultiple: 1.3, paraSpaceAfter: 10 },
  cap:   { fontFace: F.mono, fontSize: P(18), color: C.umbro },
};
// Rótulo da seção: dentro da faixa de 72 a 108, topo das maiúsculas a 72.
const LBL = { size: 25, dy: -5 }; // 38 − 33%; topo das maiúsculas a 72
const label = (w = FW, color = C.ferro, x = M, y = TOP) => ph('Rótulo', 'body', [x, y + LBL.dy, w, 48], { ...S.label, fontSize: P(LBL.size), color }, '02 · Nome da seção');
const title = (box = [M, TY, FW, 90], size = 60, color = C.umbro) =>
  ph('Título', 'title', box, { ...S.title, fontSize: P(size), color }, 'Título do slide');
const header = (w = FW) => [label(w), title([M, TY, w, 90])];
const pic = (name, box, prompt = 'Imagem') => ph(name, 'pic', box, {}, prompt);
const rule = (x, y, w, color = C.fioForte, width = 1.5) => ({ line: { x: X(x), y: X(y), w: X(w), h: 0, line: { color, width } } });
const tile = (x, y, s, color, borda) => ({ text: { text: '', options: { shape: 'roundRect', x: X(x), y: X(y), w: X(s), h: X(s), rectRadius: X(s / 4), fill: { color }, line: borda ? { color: borda, width: 1.5 } : { type: 'none' } } } });
const dot = (x, y, s, color = C.ferro) => ({ text: { text: '', options: { shape: 'ellipse', x: X(x), y: X(y), w: X(s), h: X(s), fill: { color }, line: { type: 'none' } } } });
const footer = (bar = C.ferro) => [
  { rect: { x: 0, y: X(FOOT_Y), w: X(W), h: X(84), fill: { color: bar } } },
  { image: { path: A('marca-creme.png'), x: X(M), y: X(FOOT_Y + 25), w: X(34 * 267 / 400), h: X(34) } }, // proporção do PNG
];
const slideNumber = { x: X(W - M - 120), y: X(FOOT_Y + 22), w: X(120), h: X(40), fontFace: F.mono,
  fontSize: P(20), color: C.creme, align: 'right', valign: 'middle', margin: 0 };

// ---------- componentes ----------
// Funções que desenham no slide só com sl.addText (formas com `shape`) e sl.addImage, para o .pptx e o HTML saírem iguais.
// Medidas em px de referência; caixa = [x, y, w, h].
const forma = (sl, shape, [x, y, w, h], color, r, opts = {}, texto = '') => sl.addText(texto, { shape, x: X(x), y: X(y), w: X(w), h: X(h), margin: 0,
  fill: { color }, line: { type: 'none' }, ...(r && { rectRadius: X(r) }), ...opts });
const txt = (sl, texto, [x, y, w, h], st, opts = {}) => sl.addText(texto, { x: X(x), y: X(y), w: X(w), h: X(h), margin: 0, align: 'left', valign: 'top', ...st, ...opts });
const DECL = { A: [C.turquesaFundo, C.creme, C.damasco], B: [C.damasco, C.umbro, C.ferro], C: [C.turquesa, C.umbro, C.umbro] }; // [fundo, texto, rótulo]
const comp = {
  // cor indefinida: fio ferro + rótulo mono + frase Medium; 'A' | 'B' | 'C': painel preenchido, fora do vermelho.
  declaracao(sl, [x, y, w, h], { rotulo, texto, cor }) {
    if (!cor) {
      forma(sl, 'rect', [x, y, w, 3], C.ferro);
      txt(sl, rotulo, [x, y + 20, w, 40], S.label);
      return txt(sl, texto, [x, y + 70, w, h - 70], { ...S.sub, fontSize: P(40) });
    }
    if (!DECL[cor]) throw new Error(`declaracao: cor '${cor}' não existe (A, B ou C)`);
    const [bg, fg, lb] = DECL[cor];
    forma(sl, 'roundRect', [x, y, w, h], bg, R);
    txt(sl, rotulo, [x + 40, y + 26, w - 80, 40], { ...S.label, color: lb });
    txt(sl, texto, [x + 40, y + 74, w - 80, h - 100], { ...S.sub, fontSize: P(36), color: fg });
  },
  cartao(sl, [x, y, w, h], { titulo, texto, icone }) {
    forma(sl, 'roundRect', [x, y, w, h], C.nata, R);
    let dy = 32;
    if (icone) { comp.tileIcone(sl, x + 32, y + 32, 64, icone); dy = 120; }
    txt(sl, titulo, [x + 32, y + dy, w - 64, 50], S.sub);
    txt(sl, texto, [x + 32, y + dy + 52, w - 64, h - dy - 76], { ...S.body, fontSize: P(26) });
  },
  tileNumero: (sl, x, y, s, i, cor = C.ferro) => forma(sl, 'roundRect', [x, y, s, s], cor, s / 4,
    { align: 'center', valign: 'middle', fontFace: F.mono, fontSize: P(s * 0.4), color: C.creme }, pad(i)),
  // Ícone ferro sobre damasco; creme sobre ferro, turquesa fundo ou umbro. Só ícones de ICONS (PNG em gen/).
  tileIcone(sl, x, y, s, icone, cor = C.damasco) {
    const f = A(`gen/${icone}-${[C.ferro, C.turquesaFundo, C.umbro].includes(cor) ? 'creme' : 'ferro'}.png`);
    if (!fs.existsSync(f)) throw new Error(`tileIcone: ícone '${icone}' sem PNG; use um de ICONS`);
    forma(sl, 'roundRect', [x, y, s, s], cor, s / 4);
    sl.addImage({ path: f, x: X(x + s * 0.22), y: X(y + s * 0.22), w: X(s * 0.56), h: X(s * 0.56) });
  },
  numeroSeta(sl, [x, y, w, h], antes, depois, unidade) {
    const n = { fontFace: F.bold, fontSize: P(96), color: C.ferro };
    txt(sl, [{ text: antes, options: n }, { text: ' → ', options: { ...n, fontFace: F.light, color: C.umbro } }, { text: depois, options: n }], [x, y, w, h - 40], { valign: 'bottom' });
    txt(sl, unidade, [x, y + h - 30, w, 30], S.cap);
  },
  legenda: (sl, [x, y, w, h], texto) => txt(sl, texto, [x, y + h + 12, w, 30], S.cap),
  legendaCores: (sl, x, y, pares) => pares.forEach(([cor, rotulo], i) => {
    forma(sl, 'rect', [x + i * 220, y, 24, 24], cor);
    txt(sl, rotulo, [x + i * 220 + 36, y, 170, 24], S.cap, { valign: 'middle' });
  }),
  // Tabela no estilo do exemplo: cabeçalho Medium com fio umbro, células Light (mono da 2ª coluna em diante), fio forte; `destaque` = índice da coluna em nata e ferro.
  // Da 2ª coluna em diante, recuo de 20 px à esquerda: o texto não encosta na faixa nata.
  // cab: textos ou trechos; colW: pesos das colunas (padrão: a 1ª vale o dobro); box: [x, y, w, h].
  tabela(sl, { cab, linhas, destaque, colW, box = [M, CT, FW, CB - CT - 50] }, placeholder = 'Tabela') {
    const [x, y, w] = box, k = colW || cab.map((_, j) => (j ? 1 : 2)), tot = k.reduce((a, b) => a + b);
    const nb = { type: 'none' }, cel = (t, j, cab_, mono) => ({ text: t, options: { fontFace: cab_ ? F.medium : mono ? F.mono : F.light,
      color: j === destaque ? C.ferro : C.umbro, ...(j === destaque && { fill: { color: C.nata } }), margin: [0, 0, 0, j ? X(20) : 0], // [topo, dir, baixo, esq] em polegadas
      border: [nb, nb, cab_ ? { pt: 1, color: C.umbro } : { pt: 0.75, color: C.fioForte }, nb] } });
    sl.addTable([cab.map((t, j) => cel(t, j, true)), ...linhas.map((r) => r.map((t, j) => cel(t, j, false, j > 0)))],
      { placeholder, x: X(x), y: X(y), w: X(w), colW: k.map((v) => X(w * v / tot)), fontSize: P(28), rowH: X(72), valign: 'middle', margin: [0, 0, 0, 0] });
  },
  marcador(sl, x, y, texto, w = 700) {
    forma(sl, 'ellipse', [x, y + 14, 16, 16], C.ferro);
    txt(sl, texto, [x + 40, y, w - 40, 110], S.body);
  },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'LINA'; pres.company = 'LINA · IAUD · UFC'; pres.title = 'Apresentação LINA';
pres.theme = { headFontFace: F.bold, bodyFontFace: F.light };

const LAYOUTS = [], HTML_LAYOUTS = {}, HTML_SLIDES = []; // nomes (pós-processamento); HTML_*: mesma fonte do deck HTML (html.js)
// Nomes numerados por família (1 Abertura, 2 Texto, 3 Ícones, 4 Imagem, 5 Dados, 6 Encerramento);
// os layouts entram no master na ordem do número, não na ordem do código.
const PEND = [];
const layout = (...a) => PEND.push(a);
const num = (n) => n.split(' ')[0].split('.').map(Number);
// Famílias paramétricas (param.js): FAM[base] constrói o layout para N itens; ALIAS traduz nomes antigos.
const FAM = {}, SLIDES = [];
// Opções do deck; o módulo DECK pode mudá-las. Vão para out/opcoes.json (post.py lê lang) e para o html.js.
const opcoes = { lang: 'pt-BR', transicoes: false };
const renomeia = (f, re, novo) => Object.fromEntries(Object.entries(f).map(([k, v]) => [k.replace(re, novo), v]));
const semChave = (f, re) => Object.fromEntries(Object.entries(f).filter(([k]) => !re.test(k)));
const ALIAS = {
  '1.4 Capa · autores': { para: '1.2 Capa' },
  '1.5 Sumário': { para: '1.4 Sumário', conv: ({ Itens, ...r }) => Itens === undefined ? r
    : { ...r, itens: Array.isArray(Itens) ? Itens.filter((x) => !(x.options && x.options.fontFace === F.mono)).map((x) => x.text) : String(Itens).split('\n') } },
  '1.6 Sumário · lista': { para: '1.4 Sumário', conv: (f) => ({ ...semChave(f, /^(Número|Item|Descrição) \d+$/),
    itens: Array.from({ length: Object.keys(f).filter((k) => /^Item \d+$/.test(k)).length }, (_, i) =>
      Object.fromEntries(['Número', 'Item', 'Descrição'].filter((k) => `${k} ${i + 1}` in f).map((k) => [k, f[`${k} ${i + 1}`]]))) }) },
  '1.7 Seção': { para: '1.5 Seção' },
  '2.2 Duas colunas': { para: '2.2 Colunas', conv: (f) => renomeia(f, /^Coluna /, 'Texto ') },
  '2.3 Três colunas': { para: '2.2 Colunas' },
  '2.5 Conclusões': { para: '2.2 Colunas · ícones' },
  '2.4 Equação': { para: '2.5 Equação' },
  '3.3 Ícones · lista e imagem': { para: '2.3 Lista · ícones e imagem', conv: (f) => renomeia(f, /^Subtítulo /, 'Item ') },
  '4.2 Texto e grade 2×2': { para: '4.2 Texto e grade · 4 imagens' },
  '4.5 Duas imagens': { para: '4.5 Imagens em linha · 2 imagens' },
  '4.6 Três imagens': { para: '4.5 Imagens em linha · 3 imagens' },
  '4.7 Mosaico': { para: '4.6 Mosaico · 3 imagens' },
  '4.8 Imagem cheia': { para: '4.7 Imagem cheia' },
  '4.9 Vídeo': { para: '4.4 Figura larga', conv: (f) => renomeia(renomeia(f, /^Vídeo$/, 'Imagem'), /^Legenda$/, 'Fonte') },
};
// Logos de parceiros da capa 1.2: à direita do IAUD, mesma linha e altura (93), proporção 3:1.
const LOGO_P = (i) => [M - 11 + 356 + 281 + G + i * (279 + G), 1080 - M - 99 + 7, 279, 93];
// Define no master, em ordem numérica e depois por N, os layouts antigos (PEND) e as variações de FAM que o deck usa.
const flushLayouts = () => {
  const usados = new Map();
  SLIDES.forEach(({ name, base, n }) => FAM[base] && usados.set(name, { base, n }));
  [...PEND.map((a) => ({ name: a[0], n: 0, def: () => defLayout(...a) })),
    ...[...usados].map(([name, { base, n }]) => ({ name, n: FAM[base].faixa ? n : 0, def: () => defLayout(name, FAM[base].build(n), FAM[base].opts && FAM[base].opts(n)) }))]
    .sort((a, b) => num(a.name)[0] - num(b.name)[0] || num(a.name)[1] - num(b.name)[1] || a.n - b.n).forEach((x) => x.def());
};
const defLayout = (name, objects, { bg = { color: 'FFFFFF' }, foot = true, bar } = {}) => {
  // pptxgenjs perde o tipo de espaços de imagem e tabela; post.py os restaura a partir deste registro.
  const all = [...(foot ? footer(bar) : []), ...objects];
  const ph = all.flatMap((o, i) => o.placeholder ? [{ idx: 100 + i, name: o.placeholder.options.name, type: o.placeholder.options.type,
    box: ['x', 'y', 'w', 'h'].map((k) => Math.round(o.placeholder.options[k] * 144)), degrade: o.placeholder.options.degrade }] : []);
  LAYOUTS.push({ name, foot, ph }); HTML_LAYOUTS[name] = { objects: all, bg, foot };
  pres.defineSlideMaster({ title: name, background: bg, ...(foot ? { slideNumber } : {}),
    objects: all });
};

// ---------- layouts ----------
function defineLayouts() {
  const cover = (logoY) => [
    { image: { path: A('logo-h-creme.png'), x: X(M), y: X(logoY), w: X(200), h: X(68.6) } }];
  // Logos institucionais fixas (UFC e IAUD, brancas). O PNG tem respiro interno: x recua 11 px para o brasão cair na margem.
  // x0 = M - 11 alinha o brasão à margem; 646 centra a parte visível do par (604 px) no slide.
  const insts = (y, x0 = M - 11) => [
    { image: { path: A('logo-ufc-branco.png'), x: X(x0), y: X(y), w: X(356), h: X(106) } },
    { image: { path: A('logo-iaud-branco.png'), x: X(x0 + 356), y: X(y + 7), w: X(281), h: X(93) } }];

  // Família 1 · Abertura, paramétrica: build(n) devolve os objetos do layout com n itens (ver param.js).
  const CAPA = () => ({ bg: { path: A('trama-capa.png') }, foot: false });
  const nomes = (k) => Array(k).fill('Nome do Autor').join('\n');
  // N a partir dos placeholders 'Autores c' do preenchimento (uma linha por nome); sem eles, o padrão da família.
  // per: nomes por coluna; o formato antigo com 'Autores 1' e 'Autores 2' pede ao menos per + 1 nomes (duas colunas), mesmo com poucos nomes.
  const conta = (f, per = 1) => { const ks = Object.keys(f).filter((k) => /^Autores \d+$/.test(k)); return Math.max(ks.reduce((a, k) => a + String(f[k]).split('\n').length, 0), ks.length && per * (ks.length - 1) + 1) || undefined; };

  // Abertura: só a trama da capa, antes dela. No HTML a trama anima e continua sem salto na capa seguinte.
  FAM['1.1 Abertura'] = { build: () => [], opts: CAPA };

  // Capa na grade: evento no pé da linha 1, título nas linhas 2–3 (até três linhas de 72), autoria na linha 4, logos institucionais com o pé a 72 da borda inferior.
  // Logos: a parte visível do brasão UFC termina 99 px abaixo de y; o pé fica a 72 da borda, como o topo da logo LINA.
  // Um autor: apresentador e coautores. De 2 a 9: nomes em Medium 32, até 3 por coluna, colunas de 4 módulos. Logo 1 e 2: parceiros à direita do IAUD.
  FAM['1.2 Capa'] = { faixa: [1, 9], unidade: 'autores', padrao: 1, campo: 'Autor', opts: CAPA,
    n: (f) => { const c = conta(f, 3); return c && Math.max(2, c); },
    itens: (it, n) => n === 1 ? { Apresentador: it[0] }
      : Object.fromEntries(Array.from({ length: Math.ceil(n / 3) }, (_, c) => [`Autores ${c + 1}`, it.slice(c * 3, c * 3 + 3).join('\n')])),
    build: (n) => [ ...cover(M), ...insts(1080 - M - 99),
      ...[0, 1].map((i) => ph(`Logo ${i + 1}`, 'pic', LOGO_P(i), { color: C.creme }, 'Logo parceiro')),
      ph('Evento', 'body', [M, row(1)[0], col(0, 8)[1], RH], { fontFace: F.mono, fontSize: P(22), color: C.creme, valign: 'bottom' }, 'Evento · DD · MM · AAAA'),
      ph('Título', 'title', [M, row(2)[0], col(0, 7)[1], row(0, 2)[1]], { ...S.title, fontSize: P(72), color: C.creme }, 'Título do trabalho em até três linhas'),
      ...(n === 1 ? [
        ph('Apresentador', 'body', [M, row(4)[0], col(0, 8)[1], 44], { ...S.sub, color: C.creme }, 'Nome do Apresentador'),
        ph('Coautores', 'body', [M, row(4)[0] + 52, col(0, 8)[1], 40], { fontFace: F.light, fontSize: P(24), color: C.creme }, 'Coautores · Orientação')]
        : Array.from({ length: Math.ceil(n / 3) }, (_, c) => ph(`Autores ${c + 1}`, 'body', [col(c * 4)[0], row(4)[0], col(0, 4)[1], RH], { ...S.sub, color: C.creme }, nomes(Math.min(3, n - c * 3))))),
    ] };

  // Variação da capa com imagem: a imagem ocupa as colunas 1–5 (margem a margem na altura); logo, evento, título,
  // autores e logos institucionais deslocados para a coluna 6. Autores em Medium 28, entrelinha 1,0, colunas de 3 e 4 módulos (a segunda só acima de 3).
  const IX = col(5)[0], AUT = { ...S.sub, fontSize: P(28), lineSpacingMultiple: 1.0, color: C.creme };
  FAM['1.3 Capa · imagem'] = { faixa: [1, 6], unidade: 'autores', padrao: 3, campo: 'Autor', opts: CAPA, n: (f) => conta(f, 3),
    itens: (it, n) => ({ 'Autores 1': it.slice(0, 3).join('\n'), ...(n > 3 && { 'Autores 2': it.slice(3).join('\n') }) }),
    build: (n) => [
      pic('Imagem', [M, M, col(0, 5)[1], 1080 - 2 * M]),
      { image: { path: A('logo-h-creme.png'), x: X(IX), y: X(M), w: X(200), h: X(68.6) } },
      ...insts(1080 - M - 99, IX - 11),
      ph('Evento', 'body', [IX, row(1)[0], col(0, 7)[1], RH], { fontFace: F.mono, fontSize: P(22), color: C.creme, valign: 'bottom' }, 'Evento · DD · MM · AAAA'),
      ph('Título', 'title', [IX, row(2)[0], col(0, 5)[1], row(0, 2)[1]], { ...S.title, fontSize: P(72), color: C.creme }, 'Título do trabalho em até três linhas'),
      ph('Autores 1', 'body', [IX, row(4)[0], col(0, 3)[1], RH], AUT, nomes(Math.min(3, n))),
      ...(n > 3 ? [ph('Autores 2', 'body', [col(8)[0], row(4)[0], col(0, 4)[1], RH], AUT, nomes(n - 3))] : []),
    ] };

  // Sumário: até 6 partes, faixas que repartem a altura útil (132 a 972); cada faixa abre com um fio, número em mono, nome e (até 5) uma linha de descrição.
  // 7–12 partes em duas colunas, 13–18 em três, sob o cabeçalho de largura total.
  FAM['1.4 Sumário'] = { faixa: [1, 18], unidade: 'itens', campo: 'Item', numera: true,
    build: (n) => {
      if (n <= 6) {
        const bh = (CB - TY) / n, big = n <= 4;
        return [ label(col(0, 4)[1]), title([M, TY, col(0, 4)[1], 200]),
          ...Array.from({ length: n }, (_, i) => { const y = TY + i * bh; return [
            rule(col(5)[0], y, col(5, 7)[1]),
            ph(`Número ${i + 1}`, 'body', [col(5)[0], y + 30, 80, 40], { ...S.label, fontSize: P(24) }, pad(i + 1)),
            ph(`Item ${i + 1}`, 'body', [col(6)[0], y + (big ? 22 : 16), col(0, 6)[1], 64], { ...S.sub, fontSize: P(big ? 48 : 40) }, 'Parte da apresentação'),
            ...(n <= 5 ? [ph(`Descrição ${i + 1}`, 'body', [col(6)[0], y + (big ? 94 : 72), col(0, 6)[1], 44], { ...S.body, fontSize: P(28) }, 'Uma linha sobre esta parte')] : []),
          ]; }).flat() ];
      }
      const nc = n <= 12 ? 2 : 3, per = Math.ceil(n / nc), s = 12 / nc, step = Math.min(120, (CB - CT) / per);
      return [ ...header(), ...Array.from({ length: n }, (_, i) => { const x = col(Math.floor(i / per) * s)[0], y = CT + (i % per) * step; return [
        rule(x, y, col(0, s)[1]),
        ph(`Número ${i + 1}`, 'body', [x, y + 26, 80, 40], { ...S.label, fontSize: P(24) }, pad(i + 1)),
        ph(`Item ${i + 1}`, 'body', [x + 96, y + 18, col(0, s)[1] - 96, 50], { ...S.sub, fontSize: P(36) }, 'Parte da apresentação'),
      ]; }).flat() ];
    } };

  // Seção na grade (medido no render): desenho do número ocupa as linhas 2–3 (420 a 684) e começa na margem;
  // título e descrição dentro da linha 4 (708 a 828).
  FAM['1.5 Seção'] = { opts: () => ({ bg: { path: A('trama-secao.png') }, foot: false }),
    build: () => [
      ph('Número', 'body', [M - 15, row(2)[0] - 54, col(0, 4)[1], 415], { fontFace: F.bold, fontSize: P(371), color: C.damasco, lineSpacingMultiple: 0.85 }, '01'),
      ph('Título', 'title', [M, row(4)[0] - 21, col(0, 10)[1], 94], { ...S.title, fontSize: P(82), color: C.creme }, 'Nome da seção'),
      ph('Descrição', 'body', [M, row(4)[0] + 72, col(0, 7)[1], 60], { ...S.body, fontSize: P(32), color: C.creme }, 'Uma frase sobre o que esta seção vai mostrar.'),
    ] };

  layout('2.1 Texto', [ label(), title([M, TY, col(0, 5)[1], 560]),
    ph('Texto', 'body', [col(6)[0], TY, col(0, 6)[1], CB - TY], S.body, 'Até três parágrafos curtos sustentam a afirmação do título.') ]);

  // Família 2 · Texto, paramétrica. Colunas: N de 2 a 4, largura igual; marcador nenhum, número ou ícone + número.
  const colunas = (mk) => (n) => { const s = 12 / n, w = col(0, s)[1];
    return [ ...header(), ...Array.from({ length: n }, (_, i) => { const x = col(i * s)[0]; let y = CT + 24;
      const o = [rule(x, CT, w, mk === 'ico' ? C.umbro : C.fioForte, mk === 'ico' ? 2 : 1.5)];
      if (mk === 'ico') { o.push(pic(`Ícone ${i + 1}`, [x, y + 12, 56, 56], 'Ícone')); y += 96; }
      if (mk) { o.push(ph(`Número ${i + 1}`, 'body', [x, y, w, 36], S.label, pad(i + 1))); y += 46; }
      return [...o, ph(`Subtítulo ${i + 1}`, 'body', [x, y, w, 50], S.sub, 'Subtítulo'),
        ph(`Texto ${i + 1}`, 'body', [x, y + 72, w, CB - y - 72], n > 3 ? { ...S.body, fontSize: P(26) } : S.body, 'Texto curto da coluna.')];
    }).flat() ]; };
  const COLS = { faixa: [2, 4], unidade: 'colunas', campo: 'Texto' };
  FAM['2.2 Colunas'] = { ...COLS, build: colunas() };
  FAM['2.2 Colunas · numeradas'] = { ...COLS, numera: true, build: colunas('num') };
  FAM['2.2 Colunas · ícones'] = { ...COLS, numera: true, build: colunas('ico') };

  // Lista: marcador tile numerado, tile com ícone ou ponto. Com imagem: 1 coluna, imagem sangrada à direita. Sem: 2 colunas acima de 5.
  const lista = (mk, img) => (n) => {
    const nc = img || n <= 5 ? 1 : 2, per = Math.ceil(n / nc), w0 = img ? col(6)[0] - G - M : nc === 1 ? col(0, 10)[1] : col(0, 6)[1] - G, step = Math.min(144, (CB - CT) / per);
    return [ ...header(img ? w0 : FW), ...Array.from({ length: n }, (_, i) => { const x = col(Math.floor(i / per) * 6)[0], y = CT + (i % per) * step;
      const m = mk === 'num' ? [tile(x, y, 72, C.ferro), ph(`Número ${i + 1}`, 'body', [x, y, 72, 72], { fontFace: F.mono, fontSize: P(29), color: C.creme, align: 'center', valign: 'middle' }, pad(i + 1))]
        : mk === 'ico' ? [tile(x, y, 72, C.damasco), pic(`Ícone ${i + 1}`, [x + 16, y + 16, 40, 40], 'Ícone')] : [dot(x + 26, y + 14, 18)];
      return [...m, ph(`Item ${i + 1}`, 'body', [x + 96, y - 2, w0 - 96, 40], S.sub, 'Item da lista'),
        ...(mk === 'dot' ? [] : [ph(`Texto ${i + 1}`, 'body', [x + 96, y + 42, w0 - 96, step - 52], { ...S.body, fontSize: P(26) }, 'Uma frase sobre o item.')])];
    }).flat(), ...(img ? [pic('Imagem', [col(6)[0], 0, W - col(6)[0], FOOT_Y])] : []) ]; };
  FAM['2.3 Lista'] = { faixa: [1, 10], unidade: 'itens', campo: 'Item', numera: true, build: lista('num') };
  FAM['2.3 Lista · ícones'] = { faixa: [1, 10], unidade: 'itens', campo: 'Item', build: lista('ico') };
  FAM['2.3 Lista · marcador'] = { faixa: [1, 10], unidade: 'itens', campo: 'Item', build: lista('dot') };
  FAM['2.3 Lista · imagem'] = { faixa: [1, 5], unidade: 'itens', campo: 'Item', numera: true, build: lista('num', true) };
  FAM['2.3 Lista · ícones e imagem'] = { faixa: [1, 5], unidade: 'itens', campo: 'Item', build: lista('ico', true) };

  // Linha do tempo: marco = célula LINA (vazada no master; `desenha` enche a dos itens com feito: true).
  // Horizontal: 1 linha até 6 marcos, 2 acima. Vertical: eixo na coluna estreita, imagem à direita.
  const SWV = col(0, 4)[1], CEL = 28, celula = (x, y) => tile(x, y, CEL, 'FFFFFF', C.ferro);
  const tempoH = (n) => { const rows = n <= 6 ? 1 : 2, per = Math.ceil(n / rows), w = (FW - (per - 1) * G) / per;
    return Array.from({ length: n }, (_, i) => { const c = i % per, y0 = CT + Math.floor(i / per) * 360; return { c, x: M + c * (w + G), w, y0, cx: M + c * (w + G), cy: y0 + 84 }; }); };
  const tempoV = (n) => { const step = (CB - CT) / n; return Array.from({ length: n }, (_, i) => ({ step, cx: M, cy: CT + i * step })); };
  const enche = (cels) => (sl, itens) => cels.forEach(({ cx, cy }, i) => itens && itens[i] && itens[i].feito &&
    sl.addText('', { shape: 'roundRect', x: X(cx), y: X(cy), w: X(CEL), h: X(CEL), rectRadius: X(CEL / 4), fill: { color: C.ferro }, line: { color: C.ferro, width: 1.5 } }));
  const semFeito = (itens) => Object.fromEntries(itens.flatMap((it, i) => Object.entries(typeof it === 'string' ? { Marco: it } : it)
    .filter(([k]) => k !== 'feito').map(([k, v]) => [`${k} ${i + 1}`, v])));
  const TEMPO = { faixa: [2, 12], unidade: 'marcos', campo: 'Marco', itens: semFeito };
  FAM['2.4 Linha do tempo'] = { ...TEMPO, desenha: (sl, it, n) => enche(tempoH(n))(sl, it),
    build: (n) => [ ...header(), ...tempoH(n).flatMap(({ c, x, w, y0, cy }, i) => [
      ...(c === 0 ? [rule(M, cy + 13, FW, C.ferro, 2)] : []),
      ph(`Data ${i + 1}`, 'body', [x, y0, w, 40], S.label, '2026'), celula(x, cy),
      ph(`Marco ${i + 1}`, 'body', [x, cy + 56, w, 40], { ...S.sub, fontSize: P(28) }, 'Marco'),
      ph(`Texto ${i + 1}`, 'body', [x, cy + 98, w, 120], { ...S.body, fontSize: P(24) }, 'O que aconteceu.')]) ] };
  FAM['2.4 Linha do tempo · vertical'] = { ...TEMPO, faixa: [2, 6], desenha: (sl, it, n) => enche(tempoV(n))(sl, it),
    build: (n) => [ label(SWV), title([M, TY, SWV, 120], 52),
      { line: { x: X(M + 13), y: X(CT + 14), w: 0, h: X((CB - CT) / n * (n - 1)), line: { color: C.ferro, width: 2 } } },
      ...tempoV(n).flatMap(({ step, cx, cy }, i) => [celula(cx, cy),
        ph(`Data ${i + 1}`, 'body', [M + 56, cy - 8, 140, 40], S.label, '2026'),
        ph(`Marco ${i + 1}`, 'body', [M + 200, cy - 8, SWV - 200, 36], { ...S.sub, fontSize: P(28) }, 'Marco'),
        ph(`Texto ${i + 1}`, 'body', [M + 200, cy + 30, SWV - 200, step - 40], { ...S.body, fontSize: P(24), lineSpacingMultiple: 1.2 }, 'Uma linha sobre ele.')]),
      pic('Imagem', [M + SWV + G, 0, W - M - SWV - G, FOOT_Y]) ] };

  FAM['2.5 Equação'] = { build: () => [ ...header(),
    ph('Equação', 'body', [M, row(2)[0], FW, row(0, 2)[1]], { fontFace: F.math, fontSize: P(64), color: C.umbro, align: 'center', valign: 'middle' }, 'Inserir › Equação'),
    ph('Nota', 'body', [col(2)[0], row(4)[0], col(0, 8)[1], 120], { ...S.body, fontSize: P(24), align: 'center' }, 'O que cada termo representa.') ] };

  // Família 3 · Ícones, paramétrica. Recursos: tile ferro com ícone creme; até 4 numa linha, acima 2 linhas com tile menor.
  const recursos = (n) => { const rows = n <= 4 ? 1 : 2, per = Math.ceil(n / rows), s = 12 / per, ts = rows === 1 ? 96 : 72, is = rows === 1 ? 56 : 40;
    return [ ...header(), ...Array.from({ length: n }, (_, i) => { const x = col((i % per) * s)[0], w = col(0, s)[1], y = CT + 10 + Math.floor(i / per) * 360; return [
      tile(x, y, ts, C.ferro), pic(`Ícone ${i + 1}`, [x + (ts - is) / 2, y + (ts - is) / 2, is, is], 'Ícone'),
      ph(`Subtítulo ${i + 1}`, 'body', [x, y + ts + 34, w, 50], S.sub, 'Recurso'),
      ph(`Texto ${i + 1}`, 'body', [x, y + ts + 96, w, 120], { ...S.body, fontSize: P(26) }, 'Uma ou duas frases.')]; }).flat() ]; };
  FAM['3.1 Ícones · recursos'] = { faixa: [2, 8], unidade: 'recursos', campo: 'Subtítulo', build: recursos };

  // Processo: ícone ferro sem tile, número, etapa e fio entre etapas; largura útil repartida por igual (N que não divide 12); acima de 6, 2 linhas.
  FAM['3.2 Ícones · processo'] = { faixa: [2, 12], unidade: 'etapas', campo: 'Subtítulo', numera: true,
    build: (n) => { const rows = n <= 6 ? 1 : 2, per = Math.ceil(n / rows), w = (FW - (per - 1) * G) / per;
      return [ ...header(), ...Array.from({ length: n }, (_, i) => { const c = i % per, x = M + c * (w + G), y = CT + 10 + Math.floor(i / per) * 360; return [
        ...(c < per - 1 && i < n - 1 ? [rule(x + 96, y + 36, w + G - 120, C.fioForte, 2)] : []),
        pic(`Ícone ${i + 1}`, [x, y, 72, 72], 'Ícone'), ph(`Número ${i + 1}`, 'body', [x, y + 110, w, 36], S.label, pad(i + 1)),
        ph(`Subtítulo ${i + 1}`, 'body', [x, y + 156, w, 50], S.sub, 'Etapa'),
        ph(`Texto ${i + 1}`, 'body', [x, y + 210, w, 120], { ...S.body, fontSize: P(26) }, 'O que acontece nesta etapa.')]; }).flat() ]; } };

  // Ilustrações: imagem de 380 de altura no lugar do ícone (N de 2 a 4).
  FAM['3.3 Ícones · ilustrações'] = { faixa: [2, 4], unidade: 'ilustrações', campo: 'Subtítulo',
    build: (n) => { const s = 12 / n, w = col(0, s)[1];
      return [ ...header(), ...Array.from({ length: n }, (_, i) => { const x = col(i * s)[0]; return [
        pic(`Ilustração ${i + 1}`, [x, CT, w, 380], 'Ilustração'),
        ph(`Subtítulo ${i + 1}`, 'body', [x, CT + 404, w, 80], { ...S.sub, fontSize: P(30) }, 'Subtítulo em até duas linhas'),
        ph(`Texto ${i + 1}`, 'body', [x, CT + 496, w, 200], { ...S.body, fontSize: P(26) }, 'Uma ou duas frases.')]; }).flat() ]; } };

  // Família 4 · Imagem, paramétrica. Imagem do fill: { img, modo?: 'cover' | 'fit', posicao? } ou { video, poster } (ver prepara()).
  // `arranja(dim, n)`: quando o arranjo depende da proporção de cada imagem, devolve { espaço: caixa } (imagens inteiras e legendas soltas).
  const SW = col(0, 4)[1], SX = M + SW + G, FIG = [SX, TY, W - M - SX, CB - 56 - TY];
  // Imagem sangrada pelo topo e pela direita; texto e legenda na coluna estreita (mapas, fotos).
  FAM['4.1 Imagem lateral'] = { build: () => [ label(SW), title([M, TY, SW, 170], 52),
    ph('Texto', 'body', [M, row(2)[0], SW, row(0, 2)[1]], { ...S.body, fontSize: P(26) }, 'Duas ou três frases sobre a imagem.'),
    pic('Legenda', [M, row(4)[0], SW, CB - row(4)[0]], 'Legenda (imagem ou texto)'),
    pic('Imagem', [SX, 0, W - SX, FOOT_Y]) ] };
  // Figura de artigo inteira (fit) com legenda colada embaixo; coluna com 1 a 3 números.
  FAM['4.1 Imagem lateral · recuada'] = { faixa: [1, 3], unidade: 'números', campo: 'Número',
    build: (n) => [ label(SW), title([M, TY, SW, 170], 52),
      ...Array.from({ length: n }, (_, i) => { const y = row(2)[0] + i * 184; return [
        ph(`Número ${i + 1}`, 'body', [M, y, SW, 90], { fontFace: F.bold, fontSize: P(80), color: C.ferro, valign: 'bottom', lineSpacingMultiple: 0.9 }, '00'),
        ph(`Nota ${i + 1}`, 'body', [M, y + 96, SW, 40], { ...S.body, fontSize: P(24) }, 'O que o número mede')]; }).flat(),
      pic('Imagem', FIG, 'Figura inteira, sem sangrar'),
      ph('Legenda', 'body', [SX, CB - 30, W - M - SX, 30], S.cap, 'Fonte: autor, ano.') ],
    arranja: (dim) => { const d = dim('Imagem'); if (!d) return {}; const [x, y, w, h] = contido(FIG, ...d);
      return { Imagem: FIG, Legenda: [x, y + h + 12, w, 30] }; } };
  // Espelhada: imagem sangrada à esquerda; coluna da direita com lista numerada de 1 a 5 itens.
  FAM['4.1 Imagem lateral · esquerda'] = { faixa: [1, 5], unidade: 'itens', campo: 'Item', numera: true,
    build: (n) => { const x0 = W - M - SW, step = Math.min(168, (CB - row(2)[0]) / n);
      return [ pic('Imagem', [0, 0, x0 - G, FOOT_Y]), label(SW, C.ferro, x0), title([x0, TY, SW, 170], 52),
        ...Array.from({ length: n }, (_, i) => { const y = row(2)[0] + i * step; return [
          tile(x0, y, 64, C.ferro), ph(`Número ${i + 1}`, 'body', [x0, y, 64, 64], { fontFace: F.mono, fontSize: P(26), color: C.creme, align: 'center', valign: 'middle' }, pad(i + 1)),
          ph(`Item ${i + 1}`, 'body', [x0 + 88, y - 2, SW - 88, 36], { ...S.sub, fontSize: P(28) }, 'Item da lista'),
          ph(`Texto ${i + 1}`, 'body', [x0 + 88, y + 36, SW - 88, step - 44], { ...S.body, fontSize: P(22) }, 'Uma frase curta.')]; }).flat() ]; } };

  // Texto e grade: 2 (empilhadas), 4 (2×2) ou 6 (3×2) imagens sangradas à direita.
  FAM['4.2 Texto e grade'] = { faixa: [2, 6], unidade: 'imagens', campo: 'Imagem',
    build: (n) => { if (n % 2) throw new Error(`'4.2 Texto e grade' aceita 2, 4 ou 6 imagens, recebeu ${n}`);
      const nc = n === 2 ? 1 : n === 4 ? 2 : 3, nr = n / nc, gw = (W - SX - 8 * (nc - 1)) / nc, gh = (FOOT_Y - 8 * (nr - 1)) / nr;
      return [ label(SW), title([M, TY, SW, 170], 52),
        ph('Texto', 'body', [M, row(2)[0], SW, CB - row(2)[0]], { ...S.body, fontSize: P(26) }, 'Duas ou três frases sobre as imagens.'),
        ...Array.from({ length: n }, (_, i) => pic(`Imagem ${i + 1}`, [SX + (i % nc) * (gw + 8), Math.floor(i / nc) * (gh + 8), gw, gh])) ]; } };

  // Imagem à direita (mudou de lado em relação à versão 1; o CHANGELOG avisa).
  FAM['4.3 Imagem e texto'] = { build: () => [ label(),
    pic('Imagem', [col(5)[0], TY, col(0, 7)[1], CB - TY]),
    title([M, TY, col(0, 5)[1], 220], 52),
    ph('Texto', 'body', [M, row(2)[0], col(0, 5)[1], CB - row(2)[0]], S.body, 'Uma ou duas frases sobre o que observar na imagem.') ] };

  // 'obj' (espaço de conteúdo, sem tipo) aceita imagem ou vídeo.
  FAM['4.4 Figura larga'] = { build: () => [ ...header(),
    ph('Imagem', 'obj', [M, CT, FW, CB - CT - 50], {}, 'Imagem, vídeo, mapa, diagrama ou gráfico'),
    ph('Fonte', 'body', [M, CB - 30, FW, 30], S.cap, 'Fonte: autor, ano.') ] };

  // Master: espaços iguais. Com imagens do fill, `arranja` põe todas na mesma altura, larguras pela proporção, legenda sob cada uma.
  FAM['4.5 Imagens em linha'] = { faixa: [2, 4], unidade: 'imagens', campo: 'Imagem',
    build: (n) => { const s = 12 / n, w = col(0, s)[1];
      return [ ...header(), ...Array.from({ length: n }, (_, i) => [ pic(`Imagem ${i + 1}`, [col(i * s)[0], CT, w, CB - CT - 60]),
        ph(`Legenda ${i + 1}`, 'body', [col(i * s)[0], CB - 40, w, 40], S.cap, 'Legenda curta · fonte')]).flat() ]; },
    arranja: (dim, n) => { const d = Array.from({ length: n }, (_, i) => dim(`Imagem ${i + 1}`)); if (!d.every(Boolean)) return {};
      const rs = d.map(([iw, ih]) => iw / ih), soma = rs.reduce((a, b) => a + b), hh = Math.min(CB - CT - 60, (FW - (n - 1) * G) / soma), o = {};
      let x = M + (FW - (soma * hh + (n - 1) * G)) / 2;
      rs.forEach((r, i) => { o[`Imagem ${i + 1}`] = [x, CT, r * hh, hh]; o[`Legenda ${i + 1}`] = [x, CT + hh + 16, r * hh, 40]; x += r * hh + G; });
      return o; } };

  // Mosaico: 3 = 1 grande + 2; 5 = 1 grande + 4 pequenas.
  FAM['4.6 Mosaico'] = { faixa: [3, 5], unidade: 'imagens', campo: 'Imagem',
    build: (n) => { if (n === 4) throw new Error("'4.6 Mosaico' aceita 3 ou 5 imagens, recebeu 4");
      const ht = CB - CT, q = (ht - G) / 2;
      return [ ...header(), ...(n === 3 ? [ pic('Imagem 1', [col(0)[0], CT, col(0, 8)[1], ht]), pic('Imagem 2', [col(8)[0], CT, col(0, 4)[1], q]), pic('Imagem 3', [col(8)[0], CT + q + G, col(0, 4)[1], q]) ]
        : [ pic('Imagem 1', [col(0)[0], CT, col(0, 6)[1], ht]), ...[0, 1, 2, 3].map((i) => pic(`Imagem ${i + 2}`, [col(6 + (i % 2) * 3)[0], CT + Math.floor(i / 2) * (q + G), col(0, 3)[1], q])) ]) ]; } };

  // Sem título: imagem ou vídeo ocupa tudo acima do rodapé.
  FAM['4.7 Imagem cheia'] = { build: () => [ ph('Imagem', 'obj', [0, 0, W, FOOT_Y], {}, 'Imagem ou vídeo') ] };
  // Com título: dois degradês ferro fundo sobre a imagem (de cima, até logo após o título; de baixo, só sob a fonte), no preenchimento dos espaços de texto.
  FAM['4.7 Imagem cheia · título'] = { build: () => [ ph('Imagem', 'obj', [0, 0, W, FOOT_Y], {}, 'Imagem ou vídeo'),
    ph('Título', 'title', [0, 0, W, 300], { ...S.title, color: C.creme, margin: [P(M), P(M), 0, P(TY)], degrade: 'cima' }, 'Título sobre a imagem'),
    label(FW, C.creme),
    ph('Fonte', 'body', [0, FOOT_Y - 110, W, 110], { ...S.cap, color: C.creme, valign: 'bottom', margin: [P(M), P(M), P(24), 0], degrade: 'baixo' }, 'Fonte: autor, ano.') ] };

  // Equipe: retratos do mesmo tamanho (olhos numa linha); 1 linha até 6, 2 até 16, 3 até 24. Cover, centrado no alto.
  FAM['4.8 Equipe'] = { faixa: [1, 24], unidade: 'pessoas', campo: 'Nome', posicao: 'north',
    build: (n) => { const rows = n <= 6 ? 1 : n <= 16 ? 2 : 3, nc = Math.ceil(n / rows), w = (FW - (nc - 1) * G) / nc, h = Math.min(w * 1.25, (CB - CT - rows * 84 - (rows - 1) * G) / rows);
      return [ ...header(), ...Array.from({ length: n }, (_, i) => { const x = M + (i % nc) * (w + G), y = CT + Math.floor(i / nc) * (h + 84 + G); return [
        pic(`Retrato ${i + 1}`, [x, y, w, h], 'Retrato'),
        ph(`Nome ${i + 1}`, 'body', [x, y + h + 12, w, 36], { ...S.sub, fontSize: P(nc > 6 ? 22 : 28) }, 'Nome Sobrenome'),
        ph(`Papel ${i + 1}`, 'body', [x, y + h + 50, w, 30], S.cap, 'Função')]; }).flat() ]; } };

  layout('5.1 Gráfico', [ ...header(),
    ph('Gráfico', 'chart', [M, CT, FW, CB - CT - 50], {}, 'Gráfico'),
    ph('Fonte', 'body', [M, CB - 30, FW, 30], S.cap, 'Fonte: autor, ano.') ]);

  layout('5.2 Gráfico e leituras', [ ...header(),
    ph('Gráfico', 'chart', [col(0)[0], CT, col(0, 8)[1], CB - CT], {}, 'Gráfico'),
    rule(col(8)[0], CT, col(0, 4)[1], C.umbro, 2),
    ph('Leituras', 'body', [col(8)[0], CT + 24, col(0, 4)[1], CB - CT - 24], { ...S.body, fontSize: P(26) }, 'Três leituras do gráfico, uma por parágrafo.') ]);

  // Números-chave: N de 2 a 4 em colunas iguais; 140 px até 3, 110 com 4 (cabe 1.234,5 em 3 módulos).
  FAM['5.3 Números-chave'] = { faixa: [2, 4], unidade: 'números', padrao: 3, campo: 'Número',
    build: (n) => { const s = 12 / n, w = col(0, s)[1];
      return [ ...header(), ...Array.from({ length: n }, (_, i) => { const x = col(i * s)[0]; return [ rule(x, CT + 40, w, C.ferro, 3),
        ph(`Número ${i + 1}`, 'body', [x, CT + 70, w, 170], { fontFace: F.bold, fontSize: P(n > 3 ? 110 : 140), color: C.ferro, valign: 'bottom', lineSpacingMultiple: 0.9 }, '00'),
        ph(`Rótulo ${i + 1}`, 'body', [x, CT + 270, w, 50], S.sub, 'O que o número mede'),
        ph(`Nota ${i + 1}`, 'body', [x, CT + 336, w, CB - CT - 336], { ...S.body, fontSize: P(24) }, 'Recorte, unidade, fonte.')]; }).flat() ]; } };
  // Antes e depois: dois números de 5 módulos com a seta ferro entre eles (PNG, igual no .pptx e no HTML); uma nota só.
  layout('5.3 Números-chave · antes e depois', [ ...header(),
    ...[0, 7].flatMap((c, i) => [ rule(col(c)[0], CT + 40, col(0, 5)[1], C.ferro, 3),
      ph(`Número ${i + 1}`, 'body', [col(c)[0], CT + 70, col(0, 5)[1], 170], { fontFace: F.bold, fontSize: P(140), color: C.ferro, valign: 'bottom', lineSpacingMultiple: 0.9 }, '00'),
      ph(`Rótulo ${i + 1}`, 'body', [col(c)[0], CT + 270, col(0, 5)[1], 50], S.sub, i ? 'Depois' : 'Antes') ]),
    { image: { path: A('gen/seta-ferro.png'), x: X(W / 2 - 60), y: X(CT + 130), w: X(120), h: X(80) } },
    ph('Nota', 'body', [M, CT + 336, col(0, 8)[1], CB - CT - 336], { ...S.body, fontSize: P(24) }, 'Recorte, unidade, fonte.') ]);

  layout('5.4 Comparação', [ ...header(),
    { line: { x: X(W / 2), y: X(CT), w: 0, h: X(CB - CT), line: { color: C.fioForte, width: 1.5 } } },
    ...[[0, C.ferro], [6, C.turquesaFundo]].flatMap(([c, cor], i) => { const x = col(c)[0] + (i ? 20 : 0), w = col(0, 6)[1] - 20;
      return [ ph(`Lado ${i + 1}`, 'body', [x, CT, w, 50], { ...S.sub, color: cor }, i ? 'Depois' : 'Antes'),
        pic(`Imagem ${i + 1}`, [x, CT + 70, w, 380]),
        ph(`Texto ${i + 1}`, 'body', [x, CT + 480, w, CB - CT - 480], { ...S.body, fontSize: P(26) }, 'O que muda deste lado.') ]; }) ]);

  layout('5.5 Tabela', [ ...header(),
    ph('Tabela', 'tbl', [M, CT, FW, CB - CT - 50], {}, 'Tabela'),
    ph('Fonte', 'body', [M, CB - 30, FW, 30], S.cap, 'Fonte: autor, ano.') ]);
  // Frase grande nas colunas 0–3 (Medium 40), tabela nas colunas 4–11.
  layout('5.5 Tabela · texto', [ ...header(),
    ph('Texto', 'body', [M, CT, col(0, 4)[1], CB - CT], { ...S.sub, fontSize: P(40), lineSpacingMultiple: 1.15 }, 'Uma frase grande que diz o que a tabela prova.'),
    ph('Tabela', 'tbl', [col(4)[0], CT, col(0, 8)[1], CB - CT - 50], {}, 'Tabela'),
    ph('Fonte', 'body', [col(4)[0], CB - 30, col(0, 8)[1], 30], S.cap, 'Fonte: autor, ano.') ]);

  layout('2.6 Só título', [ ...header() ]);

  // Encerramento centrado: logo LINA e logos institucionais nas mesmas alturas da capa (72 do topo e da base);
  // 'Obrigado' preenche a linha 2, apresentador e contato na linha 3.
  // Logos de 2 a 4: UFC e IAUD mais 0 a 2 parceiros, o grupo centrado no slide (largura visível 604 sem parceiro, 626 + 303·k com k).
  const ENC = { ty: -42, size: 171, py: 47, cy: 99 }; // py, cy: abaixo da descendente do g, que entra na linha 3
  const encTopo = () => [
    { image: { path: A('logo-h-creme.png'), x: X((W - 200) / 2), y: X(M), w: X(200), h: X(68.6) } }, // como na capa, centrada
    ph('Título', 'title', [M, row(2)[0] + ENC.ty, FW, 200], { ...S.title, fontSize: P(ENC.size), color: C.creme, align: 'center' }, 'Obrigado')];
  FAM['6.1 Encerramento'] = { faixa: [2, 4], unidade: 'logos', padrao: 2, opts: CAPA,
    n: (f) => { const c = Object.keys(f).filter((k) => /^Logo \d+$/.test(k)).length; return c ? c + 2 : undefined; },
    build: (n) => { const k = n - 2, x0 = k ? 949 - (626 + k * (279 + G)) / 2 : 646;
      return [ ...encTopo(),
        ph('Apresentador', 'body', [M, row(3)[0] + ENC.py, FW, 44], { ...S.label, fontSize: P(LBL.size), color: C.creme, align: 'center' }, 'Nome do Apresentador'),
        ph('Contato', 'body', [M, row(3)[0] + ENC.cy, FW, 36], { ...S.label, color: C.creme, align: 'center' }, 'nome@ufc.br · lina.ufc.br'),
        ...insts(1080 - M - 99, x0),
        ...Array.from({ length: k }, (_, i) => ph(`Logo ${i + 1}`, 'pic', [x0 + 637 + G + i * (279 + G), 1080 - M - 99 + 7, 279, 93], { color: C.creme }, 'Logo parceiro')) ]; } };
  // Autores: até 3 numa coluna centrada; 4 a 8 em duas, com a calha no centro do slide (esquerda alinhada à direita, direita à esquerda); 9 a 12 em três de 4 módulos.
  // Sem N explícito, `Autores 2` ou `Autores 3` no preenchimento (deck antigo) garantem as duas ou três colunas.
  FAM['6.2 Encerramento · autores'] = { faixa: [1, 12], unidade: 'autores', padrao: 2, opts: CAPA,
    n: (f) => { const c = conta(f); return c && Math.max(c, [0, 0, 4, 9][Object.keys(f).filter((k) => /^Autores \d+$/.test(k)).length] || 0); },
    itens: (it, n) => { const nc = n <= 3 ? 1 : n <= 8 ? 2 : 3, per = Math.ceil(n / nc);
      return Object.fromEntries(Array.from({ length: nc }, (_, c) => [`Autores ${c + 1}`, it.slice(c * per, (c + 1) * per).join('\n')])); },
    build: (n) => { const nc = n <= 3 ? 1 : n <= 8 ? 2 : 3, per = Math.ceil(n / nc);
      return [ ...encTopo(), ...Array.from({ length: nc }, (_, c) => { const k = Math.min(per, n - c * per), st = { ...S.label, fontSize: P(nc === 3 ? 22 : LBL.size), color: C.creme, lineSpacingMultiple: 1.1 };
        const [x, w, align] = nc === 1 ? [M, FW, 'center'] : nc === 2 ? [col(c * 6)[0], col(0, 6)[1], c ? 'left' : 'right'] : [col(c * 4)[0], col(0, 4)[1], 'center'];
        return ph(`Autores ${c + 1}`, 'body', [x, row(3)[0] + ENC.py, w, 200], { ...st, align }, nomes(k)); }),
        ...insts(1080 - M - 99, 646) ]; } };
}

// ---------- slides de exemplo ----------
async function examples() {
  const IMG = A('gen/provisoria.png');
  const icon = (n, tag) => A(`gen/${n}-${tag}.png`);
  // s() só registra: os layouts usados são definidos depois (flushLayouts) e os slides criados em criaSlides.
  // fill.notas: notas do apresentador (\n separa parágrafos); sai do fill antes da checagem de espaços.
  const s = (m, { notas, ...fill } = {}, extra) => {
    const r = !ALIAS[m] && PEND.some((x) => x[0] === m) ? { base: m, name: m, fill } : resolve(m, fill, FAM, ALIAS);
    SLIDES.push({ ...r, notas, extra });
  };
  const PROV = (r) => ({ img: A(`gen/prov-${r}.png`) }); // provisória na proporção r/100 (largura/altura)
  const ic = (n, tag, box = [0, 0, 0, 0]) => ({ img: icon(n, tag), box: { x: X(box[0]), y: X(box[1]), w: X(box[2]), h: X(box[3]) } });
  // Decks antigos (lib.js do Vision) contam e anotam `pres.slides`; os slides só nascem depois do deck, então devolve registros que guardam a nota.
  const presDeck = new Proxy(pres, { get: (t, k) => k === 'slides' ? SLIDES.map((r) => ({ addNotes: (x) => { r.notas = x; } })) : typeof t[k] === 'function' ? t[k].bind(t) : t[k] });
  // Outro deck com os mesmos layouts: DECK=arquivo.js node build.js (o módulo recebe as peças e monta os slides).
  if (process.env.DECK) return require(path.resolve(process.env.DECK))({ pres: presDeck, s, ic, icon, A, C, F, P, X, col, row, CT, CB, TY, M, W, G, FW, FOOT_Y, sharp, FAM, pad, comp, opcoes });

  opcoes.transicoes = true; // o deck de exemplo mostra as transições
  const EV = 'Seminário de pesquisa · 15 · 10 · 2026', TT = 'Título do trabalho em até três linhas, com subtítulo após dois-pontos';
  const AUTORES = ['Ana Beatriz Lima', 'Carlos Eduardo Rocha', 'Daniela Moura', 'Eduardo Pinheiro', 'Fernanda Sales', 'Gabriel Nogueira'];
  const logo = (i) => ({ img: A('gen/logo-parceiro.png'), box: { x: X(LOGO_P(i)[0]), y: X(LOGO_P(i)[1]), w: X(LOGO_P(i)[2]), h: X(LOGO_P(i)[3]) } });
  const PARTES = ['Contexto e problema', 'Método', 'Levantamento', 'Resultados', 'Discussão', 'Conclusões', 'Trabalhos futuros', 'Referências', 'Anexo A', 'Anexo B', 'Anexo C', 'Anexo D', 'Anexo E', 'Anexo F', 'Anexo G', 'Anexo H', 'Anexo I', 'Anexo J'];
  const sumario = (n) => ({ 'Rótulo': 'Sumário', 'Título': 'O que vamos ver',
    itens: PARTES.slice(0, n).map((t) => (n <= 5 ? { Item: t, Descrição: 'Uma linha sobre esta parte' } : t)) });
  s('1.1 Abertura', { notas: 'Deixe a trama rodar enquanto a sala se acomoda.\nComece quando o silêncio chegar.' });
  s('1.2 Capa', { 'Evento': EV, 'Título': TT, 'Apresentador': 'Nome do Apresentador', 'Coautores': 'Coautora Sobrenome · Coautor Sobrenome · Orientadora Sobrenome',
    notas: 'Bom dia. Eu sou [nome], do LINA.\nHoje vou mostrar o trabalho em três partes: problema, método e resultados.' });
  s('1.2 Capa', { 'Evento': EV, 'Título': TT, itens: AUTORES, 'Logo 1': logo(0) });
  s('1.2 Capa', { 'Evento': EV, 'Título': 'Título longo do trabalho, que precisa de quatro linhas para caber inteiro na capa, com subtítulo após dois-pontos e ainda uma explicação',
    'Apresentador': 'Nome do Apresentador', 'Coautores': 'Coautora Sobrenome · Coautor Sobrenome · Orientadora Sobrenome', 'Logo 1': logo(0), 'Logo 2': logo(1) });
  s('1.3 Capa · imagem', { 'Imagem': { img: IMG }, 'Evento': EV, 'Título': 'Título do trabalho em até três linhas', itens: AUTORES });
  for (const n of [4, 6, 12, 18]) s('1.4 Sumário', n === 4 ? { ...sumario(n), notas: 'Quatro blocos. Cite cada um em uma frase e diga quanto tempo leva.' } : sumario(n));
  s('1.5 Seção', { 'Número': '01', 'Título': 'Contexto', 'Descrição': 'Uma frase sobre o que esta seção vai mostrar.' });
  s('2.1 Texto', { 'Rótulo': '02 · Problema', 'Título': 'Uma afirmação por slide, escrita como frase completa',
    'Texto': [{ text: 'Até três parágrafos curtos à direita sustentam a afirmação do título.', options: { breakLine: true } },
      { text: 'Cada um com uma ideia; nada de listas com mais de quatro itens.', options: { breakLine: true } },
      { text: 'A conclusão do slide vem por último, em Medium e ferro.', options: { fontFace: F.medium, color: C.ferro } }] });
  const RT = { 'Rótulo': '02 · Problema' }, UF = 'Uma ou duas frases.';
  s('2.2 Colunas', { ...RT, 'Título': 'Duas ideias lado a lado', itens: [{ 'Subtítulo': 'O que se sabe', 'Texto': 'Duas ou três frases sobre o estado atual.' }, { 'Subtítulo': 'O que falta', 'Texto': 'Duas ou três frases sobre a lacuna.' }] });
  s('2.2 Colunas · numeradas', { ...RT, 'Título': 'Três escalas do mesmo problema', itens: ['Território', 'Edifício', 'Elemento'].map((t) => ({ 'Subtítulo': t, 'Texto': UF })) });
  const conc = [['chart-line', 'Modelo'], ['bell', 'Alerta'], ['monitor', 'Painel'], ['database', 'Dados']];
  s('2.2 Colunas · ícones', { 'Rótulo': '05 · Próximos passos', 'Título': 'O que vem a seguir', itens: conc.map(([n, t]) => ({ 'Ícone': ic(n, 'ferro'), 'Subtítulo': t, 'Texto': UF })) });
  const lst = (nomes, ico) => nomes.map((t, i) => ({ ...(ico && { 'Ícone': ic(ico[i], 'ferro') }), 'Item': t, 'Texto': 'Uma frase sobre o item.' }));
  const ITENS = ['Território', 'Patrimônio', 'Comunidade', 'Clima', 'Mobilidade', 'Energia', 'Água', 'Dados', 'Governança'], ICL = ['map', 'landmark', 'users', 'atom', 'ruler', 'cpu', 'layers', 'database', 'building-2'];
  s('2.3 Lista · imagem', { 'Rótulo': '01 · Contexto', 'Título': 'Quatro dimensões do caso', 'Imagem': { img: IMG }, itens: lst(ITENS.slice(0, 4)) });
  s('2.3 Lista · ícones', { 'Rótulo': '01 · Contexto', 'Título': 'Nove dimensões do caso', itens: lst(ITENS, ICL) });
  s('2.3 Lista · marcador', { 'Rótulo': '01 · Contexto', 'Título': 'Cinco pontos do argumento', itens: ITENS.slice(0, 5).map((t) => ({ 'Item': t })) });
  s('2.3 Lista', { 'Rótulo': '01 · Contexto', 'Título': 'Seis etapas do trabalho', itens: lst(ITENS.slice(0, 6)) });
  s('2.3 Lista · ícones e imagem', { 'Rótulo': '01 · Contexto', 'Título': 'Três dimensões do caso', 'Imagem': { img: IMG }, itens: lst(ITENS.slice(0, 3), ICL) });
  const marcos = (n, feitos) => Array.from({ length: n }, (_, i) => ({ 'Data': String(2016 + i * 2), 'Marco': 'Marco', 'Texto': 'O que aconteceu.', feito: i < feitos }));
  s('2.4 Linha do tempo', { 'Rótulo': '02 · Trajetória', 'Título': 'Dez anos de trabalho', itens: marcos(5, 2) });
  s('2.4 Linha do tempo', { 'Rótulo': '02 · Trajetória', 'Título': 'Dos primeiros testes à plataforma', itens: marcos(10, 6) });
  s('2.4 Linha do tempo · vertical', { 'Rótulo': '02 · Trajetória', 'Título': 'Trajetória', 'Imagem': { img: IMG }, itens: marcos(5, 4).map((m) => ({ ...m, 'Texto': 'Uma linha sobre o marco.' })) });
  s('2.5 Equação', { 'Rótulo': '03 · Método', 'Título': 'O modelo', 'Equação': '𝜃(𝑡) = 𝑇(𝑡) + 𝑆(𝑡) + 𝐷(𝑡) + 𝜀(𝑡)', 'Nota': 'Tendência, ciclo sazonal, ciclo diário e resíduo.' });
  s('2.6 Só título', { 'Rótulo': '03 · Método', 'Título': 'Diagrama livre: monte com ícones e pictogramas' });
  const FRASE = 'A inspeção por drone reduziu o tempo de campo em 70%.';
  s('2.6 Só título', { 'Rótulo': 'Componentes', 'Título': 'Declaração-chave · padrão e preenchido' }, (sl) => {
    const dc = (b, cor, nome) => { comp.declaracao(sl, b, { rotulo: 'Achado', texto: FRASE, cor }); comp.legenda(sl, b, nome); };
    dc([M, CT, col(0, 6)[1] - G, 210], undefined, 'Padrão: fio + rótulo mono.');
    dc([col(6)[0], CT, col(0, 6)[1], 210], 'A', 'Preenchido A · turquesa fundo, texto creme');
    dc([M, row(3)[0] + 30, col(0, 6)[1], 210], 'B', 'Preenchido B · damasco, texto umbro');
    dc([col(6)[0], row(3)[0] + 30, col(0, 6)[1], 210], 'C', 'Preenchido C · turquesa, texto umbro');
  });
  s('2.6 Só título', { 'Rótulo': 'Componentes', 'Título': 'Cartão · tiles · número com seta · legendas' }, (sl) => {
    comp.cartao(sl, [col(0)[0], CT, col(0, 4)[1], 240], { titulo: 'Cartão com ícone', texto: 'Altura pelo conteúdo, não fixa.', icone: 'camera' });
    comp.cartao(sl, [col(4)[0], CT, col(0, 4)[1], 240], { titulo: 'Cartão', texto: 'Sem ícone: o título sobe.' });
    comp.tileIcone(sl, col(8)[0], CT, 96, 'camera', C.ferro); comp.tileIcone(sl, col(9)[0], CT, 96, 'chart-line', C.turquesaFundo);
    comp.tileIcone(sl, col(10)[0], CT, 96, 'ruler', C.umbro); comp.tileNumero(sl, col(11)[0], CT, 96, 3);
    txt(sl, 'Tiles de ícone e de número.', [col(8)[0], CT + 112, col(0, 4)[1], 60], S.cap);
    comp.numeroSeta(sl, [col(8)[0], CT + 176, col(0, 4)[1], 130], '4,2', '1,1', 'antes → depois');
    const fig = [M, row(3)[0], col(0, 4)[1], 360];
    sl.addImage({ path: A('gen/provisoria.png'), x: X(fig[0]), y: X(fig[1]), w: X(fig[2]), h: X(fig[3]) });
    comp.legenda(sl, fig, 'Fonte: autor, ano. Legenda colada à figura.');
    comp.legendaCores(sl, col(5)[0], row(3)[0] + 330, [[C.ferro, 'Foco'], [C.turquesaFundo, 'Resultado'], [C.umbro, 'Referência']]);
    ['Primeiro ponto da lista', 'Segundo ponto, mais longo, que quebra a linha e mostra o recuo', 'Terceiro ponto'].forEach((t, i) => comp.marcador(sl, col(5)[0], row(3)[0] + 4 + i * 100, t, col(0, 7)[1]));
  });
  const REC = [['scan-line', 'Levantamento'], ['layers', 'Modelagem'], ['database', 'Dados'], ['chart-line', 'Análise'], ['cpu', 'Simulação'], ['users', 'Equipe'], ['camera', 'Captura'], ['monitor', 'Painel']];
  const por3 = (k, tag, t) => REC.slice(0, k).map(([n, nome]) => ({ 'Ícone': ic(n, tag), 'Subtítulo': nome, 'Texto': t }));
  for (const k of [4, 6, 8]) s('3.1 Ícones · recursos', { 'Rótulo': '03 · Método', 'Título': `${['Quatro', 'Seis', 'Oito'][[4, 6, 8].indexOf(k)]} frentes de trabalho`, itens: por3(k, 'creme', k > 4 ? 'Uma frase.' : 'Uma ou duas frases sobre esta frente.') });
  for (const k of [5, 8]) s('3.2 Ícones · processo', { 'Rótulo': '03 · Método', 'Título': 'Do levantamento ao painel', itens: [...REC.slice(6), ...REC.slice(0, 6)].slice(0, k).map(([n, nome]) => ({ 'Ícone': ic(n, 'ferro'), 'Subtítulo': nome, 'Texto': 'O que acontece nesta etapa.' })) });
  s('3.3 Ícones · ilustrações', { 'Rótulo': '03 · Método', 'Título': 'Quatro frentes, quatro cenas', itens: REC.slice(0, 4).map(([, nome]) => ({ 'Ilustração': { img: IMG }, 'Subtítulo': nome, 'Texto': 'Uma ou duas frases.' })) });
  const NR = ([n, t]) => ({ 'Número': n, 'Nota': t });
  s('4.1 Imagem lateral', { 'Rótulo': '01 · Contexto', 'Título': 'Área de estudo', 'Texto': 'Duas ou três frases sobre o recorte e a escala do mapa.', 'Imagem': { img: IMG, alt: 'Mapa provisório da área de estudo' },
    notas: 'Mostre onde fica a área e por que ela serve de caso.\nDiga a escala do mapa antes de falar dos dados.' });
  s('4.1 Imagem lateral · recuada', { 'Rótulo': '01 · Contexto', 'Título': 'Três números do estudo', 'Imagem': PROV(133), 'Legenda': 'Fonte: LINA, 2026. Legenda logo abaixo da figura.',
    itens: [['38%', 'da área construída'], ['4,2 h', 'de campo por fachada'], ['120', 'imagens térmicas']].map(NR) });
  s('4.1 Imagem lateral · esquerda', { 'Rótulo': '01 · Contexto', 'Título': 'Quatro frentes do estudo', 'Imagem': { img: IMG },
    itens: lst(ITENS.slice(0, 4)) });
  for (const n of [2, 4, 6]) s('4.2 Texto e grade', { 'Rótulo': '01 · Contexto', 'Título': 'O lugar hoje', 'Texto': 'Duas ou três frases sobre as fotos.', itens: Array.from({ length: n }, () => ({ 'Imagem': { img: IMG } })) });
  s('4.3 Imagem e texto', { 'Rótulo': '03 · Método', 'Imagem': PROV(75), 'Título': 'Título curto da imagem', 'Texto': 'Uma ou duas frases sobre o que observar na imagem.' });
  // Vídeo: { video: 'arquivo.mp4', poster: 'quadro.jpg' } no lugar da imagem. Sem mp4 no repositório, o exemplo usa imagem.
  s('4.4 Figura larga', { 'Rótulo': '03 · Método', 'Título': 'Uma figura larga com título curto', 'Imagem': { img: IMG }, 'Fonte': 'Fonte: LINA, 2026.' });
  s('4.5 Imagens em linha', { 'Rótulo': '03 · Método', 'Título': 'Antes e depois do levantamento', itens: [PROV(150), PROV(150)].map((p, i) => ({ 'Imagem': p, 'Legenda': ['Nuvem de pontos · 2018', 'Modelo · 2026'][i] })) });
  s('4.5 Imagens em linha', { 'Rótulo': '03 · Método', 'Título': 'Quatro proporções, uma altura', itens: [133, 75, 150, 100].map((r, i) => ({ 'Imagem': PROV(r), 'Legenda': `Vista ${i + 1}` })) });
  for (const n of [3, 5]) s('4.6 Mosaico', { 'Rótulo': '03 · Método', 'Título': n === 3 ? 'Uma imagem principal e dois detalhes' : 'Uma imagem principal e quatro detalhes', itens: Array.from({ length: n }, () => ({ 'Imagem': { img: IMG } })) });
  s('4.7 Imagem cheia', { 'Imagem': { img: IMG } });
  s('4.7 Imagem cheia · título', { 'Imagem': { img: IMG }, 'Título': 'Título sobre a imagem', 'Rótulo': '03 · Método', 'Fonte': 'Fonte: LINA, 2026.' });
  const EQ = ['Ana Lima', 'Carlos Rocha', 'Daniela Moura', 'Eduardo Pinheiro', 'Fernanda Sales', 'Gabriel Nogueira', 'Helena Castro', 'Igor Matos', 'Júlia Araújo', 'Lucas Ferreira', 'Mariana Teles', 'Nicolas Prado', 'Olívia Campos', 'Pedro Alves'];
  for (const n of [6, 14]) s('4.8 Equipe', { 'Rótulo': '06 · Equipe', 'Título': 'Quem fez o trabalho', itens: EQ.slice(0, n).map((nm, i) => ({ 'Retrato': { img: IMG }, 'Nome': nm, 'Papel': ['Coordenação', 'Pesquisa', 'Campo', 'Dados'][i % 4] })) });
  s('5.1 Gráfico', { 'Rótulo': '04 · Resultados', 'Título': 'Duas séries lado a lado', 'Fonte': 'Fonte: LINA, 2026.' }, (sl) => {
    const anos = ['2020', '2021', '2022', '2023', '2024'];
    sl.addChart(pres.charts.BAR, [{ name: 'Medido', labels: anos, values: [42, 55, 61, 48, 70] }, { name: 'Modelo', labels: anos, values: [30, 38, 52, 60, 66] }],
      { placeholder: 'Gráfico', barDir: 'col', barGrouping: 'clustered', chartColors: [C.ferro, C.turquesaFundo], barGapWidthPct: 40, showValue: true, dataLabelPosition: 'outEnd',
        dataLabelFontFace: '+mn-lt', dataLabelFontSize: 14, dataLabelColor: C.umbro, showLegend: true, legendPos: 't', legendFontFace: '+mn-lt', legendFontSize: 14, legendColor: C.umbro,
        catAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 14, catAxisLabelColor: C.umbro, valAxisHidden: true,
        valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, catAxisLineColor: C.fioForte });
  });
  s('5.2 Gráfico e leituras', { 'Rótulo': '04 · Resultados', 'Título': 'Onde o modelo erra mais',
    'Leituras': [{ text: 'O erro cresce no verão.', options: { breakLine: true } }, { text: 'O inverno fica dentro da margem.', options: { breakLine: true } },
      { text: 'Julho concentra o desvio.', options: { fontFace: F.medium, color: C.ferro } }] }, (sl) => {
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    sl.addChart(pres.charts.BAR, [{ name: 'Erro', labels: meses, values: [2, 2, 3, 4, 5, 7, 11, 8, 5, 3, 2, 2] }],
      { placeholder: 'Gráfico', barDir: 'col', chartColors: [C.areia, C.areia, C.areia, C.areia, C.areia, C.areia, C.ferro, C.areia, C.areia, C.areia, C.areia, C.areia],
        invertedColors: [C.areia], barGapWidthPct: 40, showValue: true, dataLabelPosition: 'outEnd', dataLabelFontFace: '+mn-lt', dataLabelFontSize: 14, dataLabelColor: C.umbro,
        catAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 14, catAxisLabelColor: C.umbro, valAxisHidden: true,
        valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, catAxisLineColor: C.fioForte, showLegend: false });
  });
  const NUM = (v) => v.map(([n, r, nt]) => ({ 'Número': n, 'Rótulo': r, 'Nota': nt }));
  s('5.3 Números-chave · antes e depois', { 'Rótulo': '04 · Resultados', 'Título': 'Uma fachada, antes e depois', 'Número 1': '4,2 h', 'Rótulo 1': 'por fachada, antes', 'Número 2': '1,1 h', 'Rótulo 2': 'por fachada, depois', 'Nota': 'Média de 12 fachadas; levantamento por drone.' });
  s('5.3 Números-chave', { 'Rótulo': '04 · Resultados', 'Título': 'Em números', itens: NUM([['76', 'estações monitoradas', 'Entre 2018 e 2026.'], ['3×', 'mais rápido', 'Comparado ao processo manual.'], ['0,8', 'correlação', 'Entre modelo e medição.']]) });
  s('5.3 Números-chave', { 'Rótulo': '04 · Resultados', 'Título': 'Quatro números do estudo', itens: NUM([['1.234,5', 'metros medidos', 'Perímetro total.'], ['38%', 'da área construída', 'Recorte: centro.'], ['4,2 h', 'de campo por fachada', 'Média de 12 fachadas.'], ['120', 'imagens térmicas', 'Entre 2018 e 2026.']]) });
  s('5.4 Comparação', { 'Rótulo': '04 · Resultados', 'Título': 'Dois cenários',
    'Lado 1': 'Antes', 'Imagem 1': { img: IMG }, 'Texto 1': 'O que se via antes da intervenção.',
    'Lado 2': 'Depois', 'Imagem 2': { img: IMG }, 'Texto 2': 'O que muda com a intervenção.' });
  const m = (t) => ({ text: t, options: { fontFace: F.math, fontSize: P(34) } }); // símbolos em STIX Two Math: Outfit não tem grego
  s('5.5 Tabela', { 'Rótulo': '03 · Método', 'Título': 'Materiais', 'Fonte': 'Fonte: literatura. Coluna destacada: a que o slide discute.' }, (sl) =>
    comp.tabela(sl, { cab: ['Material', [m('𝜌'), { text: ' (kg/m³)' }], [m('𝐸'), { text: ' (GPa)' }], [m('𝜈')]], destaque: 2, colW: [2, 1, 1, 1],
      linhas: [['Pedra', '2570', '2,34', '0,1'], ['Enchimento', '1800', '1,20', '0,15'], ['Solo', '1937', '0,01', '0,3']] }));
  s('5.5 Tabela · texto', { 'Rótulo': '04 · Resultados', 'Título': 'Fotogrametria contra laser', 'Texto': 'O laser erra menos que a fotogrametria em todas as amostras.', 'Fonte': 'Fonte: LINA, 2026.' }, (sl) =>
    comp.tabela(sl, { cab: ['Amostra', 'Método', 'Área (m²)', 'Erro'], destaque: 3, colW: [1, 1, 1, 1], box: [col(4)[0], CT, col(0, 8)[1], CB - CT - 50],
      linhas: [['A1', 'Laser', '120', '0,8%'], ['A2', 'Foto', '96', '1,2%'], ['A3', 'Laser', '210', '0,6%'], ['A4', 'Foto', '75', '1,9%'], ['A5', 'Laser', '160', '0,7%']] }));
  s('6.1 Encerramento', { 'Título': 'Obrigado', 'Apresentador': 'Nome do Apresentador', 'Contato': 'nome@ufc.br · lina.ufc.br', notas: 'Agradeça à equipe e à plateia.\nDeixe o contato na tela e abra para perguntas.' });
  s('6.1 Encerramento', { 'Título': 'Obrigado', 'Apresentador': 'Nome do Apresentador', 'Contato': 'nome@ufc.br · lina.ufc.br', 'Logo 1': logo(0) });
  s('6.2 Encerramento · autores', { 'Título': 'Obrigado', itens: AUTORES.slice(0, 3) });
  s('6.2 Encerramento · autores', { 'Título': 'Obrigado', itens: EQ.slice(0, 8) });
  s('2.2 Colunas', { 'Rótulo': 'Guia do template · apague este slide antes de apresentar', 'Título': 'Como usar', itens: [
    { 'Subtítulo': 'Montar', 'Texto': 'Novo slide: Página Inicial › Novo Slide › escolha um layout LINA.\nRodapé: Inserir › Cabeçalho e Rodapé › Rodapé › “Título abreviado” › Aplicar a Todos.\nImagens e ícones: clique no ícone do espaço; a imagem recorta sozinha.' },
    { 'Subtítulo': 'Regras', 'Texto': 'Instale a Outfit e a JetBrains Mono (livres, em assets/fonts e Google Fonts). Ao salvar, marque “Incorporar fontes”.\nÍcones Phosphor, peso regular, um tratamento por slide: sólido, simples ou claro.\nSem emoji. Mono só para datas, números, rótulos e legendas.' }] });
  // Páginas de ícones (HTML, PDF e .pptx): ladrilho e ícone num PNG só, um clique copia os dois. Só os ícones que o DS tem em assets/icons/phosphor.
  const RI = 'Ícones · copiar e colar · apague antes de apresentar';
  s('2.6 Só título', { 'Rótulo': RI, 'Título': 'Ícones · tratamentos' }, (sl) => {
    TRAT.flat().forEach((t, i) => { const x = col((i % 6) * 2)[0], y = CT + 20 + Math.floor(i / 6) * 330;
      sl.addImage({ path: bibPng(t, 'buildings'), x: X(x), y: X(y), w: X(200), h: X(200), altText: t[0] });
      txt(sl, t[0], [x, y + 226, col(0, 2)[1], 30], S.cap, { fontSize: P(22) }); });
    txt(sl, 'Phosphor, seis pesos. Cores só do DS. Um tratamento por slide.', [col(10)[0], CT + 350, col(0, 2)[1], 200], S.cap);
  });
  s('2.6 Só título', { 'Rótulo': RI, 'Título': 'Ícones · biblioteca' }, (sl) => {
    BIB.forEach((n, i) => { const x = M + (i % 8) * (FW / 8), y = CT + 10 + Math.floor(i / 8) * 170;
      sl.addImage({ path: bibPng(TRAT[0][0], n), x: X(x), y: X(y), w: X(96), h: X(96), altText: n });
      txt(sl, n, [x, y + 108, FW / 8 - 12, 30], S.cap); });
    txt(sl, 'Mais de 1.500 ícones em phosphoricons.com; os do LINA estão em assets/icons/phosphor.', [M, CB - 30, FW, 30], S.cap);
  });
}

// ---------- imagem e vídeo no fill ----------
// Valor de fill sem caixa: { img, modo?: 'cover' | 'fit', posicao? } ou { video, poster }; o formato antigo { img, box, ppt } segue valendo.
// cover: recorta na proporção da caixa e preenche o espaço. fit: imagem inteira, centrada, solta (espaço vazio). Vídeo: solto, em loop, na proporção do poster.
const novo = (v) => v && typeof v === 'object' && !Array.isArray(v) && ((v.img && !v.box) || v.video);
const hash = (...a) => require('crypto').createHash('md5').update(a.join('|')).digest('hex').slice(0, 10);
const dimensoes = async (f) => { const m = await sharp(f).metadata(); return (m.orientation || 1) > 4 ? [m.height, m.width] : [m.width, m.height]; };
async function cobre(f, w, h, posicao = 'centre') {
  const out = A(`gen/cover-${hash(f, fs.statSync(f).mtimeMs, w, h, posicao)}${/\.jpe?g$/i.test(f) ? '.jpg' : '.png'}`);
  if (!fs.existsSync(out)) await sharp(f).rotate().resize(w, h, { fit: 'cover', position: posicao }).toFile(out);
  return out;
}
// Imagem inteira na caixa já contida [x, y, w, h], em 2×; cantos de 22 quando não sangra (mesma regra do post.py).
async function inteira(f, [x, y, w, h]) {
  const [pw, ph] = [Math.round(w * 2), Math.round(h * 2)], r = x <= 0 || y <= 0 || x + w >= W - 1 || Math.min(w, h) <= 120 ? 0 : R * 2;
  const out = A(`gen/fit-${hash(f, fs.statSync(f).mtimeMs, pw, ph, r)}.png`);
  if (!fs.existsSync(out)) {
    let im = sharp(f).rotate().resize(pw, ph, { fit: 'fill' });
    if (r) im = im.composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}"><rect width="${pw}" height="${ph}" rx="${r}"/></svg>`), blend: 'dest-in' }]);
    await im.png().toFile(out);
  }
  return out;
}
// Resolve os fills novos de cada slide, com a caixa do espaço no layout (ou a de `arranja`, para arranjos pela proporção de cada imagem).
// Resultado: cover vira { img, box } (preenche o espaço); fit, vídeo e legendas de `arranja` viram { solto } (desenhados soltos em criaSlides).
async function prepara() {
  for (const sl of SLIDES) {
    const f = sl.fill, L = LAYOUTS.find((l) => l.name === sl.name), fam = FAM[sl.base] || {};
    const ks = Object.keys(f).filter((k) => novo(f[k]));
    if (!ks.length) continue;
    const dim = {}; for (const k of ks) dim[k] = await dimensoes(f[k].video ? f[k].poster : f[k].img);
    const ov = (fam.arranja && fam.arranja((k) => dim[k], sl.n)) || {};
    for (const k of ks) {
      const v = f[k], box = ov[k] || L.ph.find((p) => p.name === k).box;
      if (v.video) f[k] = { solto: { video: v.video, poster: v.poster, cover: (await sharp(v.poster).resize(1280).jpeg({ quality: 80 }).toBuffer()).toString('base64'), box: contido(box, ...dim[k]) } };
      else if (ov[k] || v.modo === 'fit') { const c = contido(box, ...dim[k]); f[k] = { solto: { img: await inteira(v.img, c), box: c, alt: v.alt } }; }
      else f[k] = { novo: true, img: await cobre(v.img, Math.round(box[2] * 2), Math.round(box[3] * 2), v.posicao || fam.posicao), box: { x: X(box[0]), y: X(box[1]), w: X(box[2]), h: X(box[3]) }, alt: v.alt };
    }
    for (const k of Object.keys(ov)) if (typeof f[k] === 'string' || Array.isArray(f[k])) f[k] = { solto: { texto: f[k], box: ov[k] } };
  }
}

// Cria os slides registrados por s(); preenchimento com chave que não é espaço do layout resolvido é erro.
function criaSlides() {
  for (const { name, base, n, itens, fill: f0, extra, notas } of SLIDES) {
    const fill = { ...f0 };
    const L = LAYOUTS.find((l) => l.name === name);
    for (const k of Object.keys(fill)) if (!L.ph.some((p) => p.name === k)) throw new Error(`'${k}' não é espaço de '${name}'`);
    // Imagem nova (cover) ocupa a caixa do espaço do layout resolvido (a do exemplo pode ser de outro arranjo); o formato antigo { img, box } com caixa mantém a sua.
    for (const [k, v] of Object.entries(fill)) if (v && v.img && (v.novo || !(v.box && v.box.w))) {
      const [x, y, w, h] = L.ph.find((p) => p.name === k).box.map(X);
      fill[k] = { ...v, box: { ...v.box, x, y, w, h, ...(v.box.sizing && { sizing: { ...v.box.sizing, w, h } }) } };
    }
    // Capa com título longo (mais de 60 caracteres): 56 em vez de 72, para caber nas linhas 2–3.
    if (base === '1.2 Capa' && typeof fill['Título'] === 'string' && fill['Título'].length > 60) fill['Título'] = [{ text: fill['Título'], options: { fontSize: P(56) } }];
    const real = pres.addSlide({ masterName: name }), rec = { master: name, fill: Object.fromEntries(Object.entries(fill).filter(([, v]) => !(v && v.solto))), charts: [], tables: [], images: [], media: [], texts: [], notas };
    HTML_SLIDES.push(rec);
    if (notas) real.addNotes(notas);
    const sl = { addChart: (t, d, o) => (rec.charts.push({ type: t, series: d, opts: o }), real.addChart(t, d, o)),
      addTable: (r, o) => (rec.tables.push({ rows: r, opts: o }), real.addTable(r, structuredClone(o))),
      addImage: (o) => (o.placeholder || o.pptOnly || rec.images.push(o), real.addImage(o)), addText: (v, o) => (o.placeholder || rec.texts.push([v, o]), real.addText(v, o)),
      addMedia: (o) => (rec.media.push(o), real.addMedia(o)),
      anim: (a) => { rec.anim = a; }, html: (h) => { rec.html = (rec.html || '') + h; } }; // anim: efeito de entrada no deck HTML (ex.: 'aleatorio'); html: marcação crua, só no deck HTML; imagem com pptOnly: só no .pptx
    for (const [k, v] of Object.entries(fill)) {
      if (v && v.solto) {
        const { img, video, poster, cover, texto, alt, box: [x, y, w, h] } = v.solto, b = { x: X(x), y: X(y), w: X(w), h: X(h) };
        if (img) sl.addImage({ path: img, ...b, ...(alt && { altText: alt }) });
        else if (video) sl.addMedia({ type: 'video', path: video, cover: 'data:image/jpeg;base64,' + cover, poster, loop: true, bg: '#000000', ...b });
        else sl.addText(texto, { ...b, margin: 0, align: 'left', valign: 'top', ...S.cap });
      } else if (typeof v === 'object' && v && v.img) sl.addImage({ placeholder: k, path: v.img, ...v.box, ...v.ppt, ...(v.alt && { altText: v.alt }) });
      else sl.addText(v, { placeholder: k });
    }
    FAM[base] && FAM[base].desenha && FAM[base].desenha(sl, itens, n);
    extra && extra(sl);
  }
}

(async () => {
  await assets();
  defineLayouts();
  await examples();
  fs.writeFileSync(A('out/opcoes.json'), JSON.stringify(opcoes));
  flushLayouts(); await prepara(); criaSlides();
  fs.writeFileSync(A('out/layouts.json'), JSON.stringify(LAYOUTS));
  console.log('html', require('./html.js')({ layouts: HTML_LAYOUTS, slides: HTML_SLIDES, out: A('out/html/Apresentacao.dc.html'), opcoes, C, F, W, FOOT_Y, M, R }), 'slides');
  console.log(await pres.writeFile({ fileName: A('out/LINA-Apresentacao.pptx') }));
})();
