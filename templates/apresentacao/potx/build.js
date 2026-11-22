// Gera o template LINA de apresentação (16:9, 1920 × 1080 px de referência).
// Uso: node build.js  →  out/LINA-Apresentacao.pptx (depois post.py faz rodapé, cantos e .potx).
// Os layouts seguem as receitas do deck de tese (UniPG) traduzidas para a identidade LINA.
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const A = (f) => path.join(__dirname, f);

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
const tile = (x, y, s, color) => ({ text: { text: '', options: { shape: 'roundRect', x: X(x), y: X(y), w: X(s), h: X(s), rectRadius: X(s / 4), fill: { color }, line: { type: 'none' } } } });
const footer = (bar = C.ferro) => [
  { rect: { x: 0, y: X(FOOT_Y), w: X(W), h: X(84), fill: { color: bar } } },
  { image: { path: A('marca-creme.png'), x: X(M), y: X(FOOT_Y + 25), w: X(34 * 267 / 400), h: X(34) } }, // proporção do PNG
];
const slideNumber = { x: X(W - M - 120), y: X(FOOT_Y + 22), w: X(120), h: X(40), fontFace: F.mono,
  fontSize: P(20), color: C.creme, align: 'right', valign: 'middle', margin: 0 };

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
const flushLayouts = () => PEND.sort((a, b) => num(a[0])[0] - num(b[0])[0] || num(a[0])[1] - num(b[0])[1]).forEach((a) => defLayout(...a));
const defLayout = (name, objects, { bg = { color: 'FFFFFF' }, foot = true, bar } = {}) => {
  // pptxgenjs perde o tipo de espaços de imagem e tabela; post.py os restaura a partir deste registro.
  const all = [...(foot ? footer(bar) : []), ...objects];
  const ph = all.flatMap((o, i) => o.placeholder ? [{ idx: 100 + i, name: o.placeholder.options.name, type: o.placeholder.options.type,
    box: ['x', 'y', 'w', 'h'].map((k) => Math.round(o.placeholder.options[k] * 144)) }] : []);
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

  // Capa na grade: evento no pé da linha 1, título nas linhas 2–3 (até três linhas de 72), autoria na linha 4, logos institucionais com o pé a 72 da borda inferior.
  // Logos: a parte visível do brasão UFC termina 99 px abaixo de y; o pé fica a 72 da borda, como o topo da logo LINA.
  // Abertura: só a trama da capa, antes dela. No HTML a trama anima e continua sem salto na capa seguinte.
  layout('1.1 Abertura', [], { bg: { path: A('trama-capa.png') }, foot: false });

  layout('1.2 Capa', [ ...cover(M), ...insts(1080 - M - 99),
    ph('Evento', 'body', [M, row(1)[0], col(0, 8)[1], RH], { fontFace: F.mono, fontSize: P(22), color: C.creme, valign: 'bottom' }, 'Evento · DD · MM · AAAA'),
    ph('Título', 'title', [M, row(2)[0], col(0, 7)[1], row(0, 2)[1]], { ...S.title, fontSize: P(72), color: C.creme }, 'Título do trabalho em até três linhas'),
    ph('Apresentador', 'body', [M, row(4)[0], col(0, 8)[1], 44], { ...S.sub, color: C.creme }, 'Nome do Apresentador'),
    ph('Coautores', 'body', [M, row(4)[0] + 52, col(0, 8)[1], 40], { fontFace: F.light, fontSize: P(24), color: C.creme }, 'Coautores · Orientação'),
  ], { bg: { path: A('trama-capa.png') }, foot: false });

  // Variação da capa com imagem: a imagem ocupa as colunas 1–5 (margem a margem na altura); logo, evento, título,
  // autores e logos institucionais deslocados para a coluna 6. Autores em Medium 28, entrelinha 1,0, colunas de 3 e 4 módulos.
  const IX = col(5)[0], AUT = { ...S.sub, fontSize: P(28), lineSpacingMultiple: 1.0, color: C.creme };
  layout('1.3 Capa · imagem', [
    pic('Imagem', [M, M, col(0, 5)[1], 1080 - 2 * M]),
    { image: { path: A('logo-h-creme.png'), x: X(IX), y: X(M), w: X(200), h: X(68.6) } },
    ...insts(1080 - M - 99, IX - 11),
    ph('Evento', 'body', [IX, row(1)[0], col(0, 7)[1], RH], { fontFace: F.mono, fontSize: P(22), color: C.creme, valign: 'bottom' }, 'Evento · DD · MM · AAAA'),
    ph('Título', 'title', [IX, row(2)[0], col(0, 5)[1], row(0, 2)[1]], { ...S.title, fontSize: P(72), color: C.creme }, 'Título do trabalho em até três linhas'),
    ph('Autores 1', 'body', [IX, row(4)[0], col(0, 3)[1], RH], AUT, 'Nome do Autor\nNome do Autor\nNome do Autor'),
    ph('Autores 2', 'body', [col(8)[0], row(4)[0], col(0, 4)[1], RH], AUT, 'Nome do Autor\nNome do Autor\nNome do Autor'),
  ], { bg: { path: A('trama-capa.png') }, foot: false });

  // Variação da capa para vários autores com a mesma hierarquia: nomes em Medium 32 (como o apresentador), duas colunas de 4 módulos
  // na linha 4, um nome por linha (até três por coluna).
  layout('1.4 Capa · autores', [ ...cover(M), ...insts(1080 - M - 99),
    ph('Evento', 'body', [M, row(1)[0], col(0, 8)[1], RH], { fontFace: F.mono, fontSize: P(22), color: C.creme, valign: 'bottom' }, 'Evento · DD · MM · AAAA'),
    ph('Título', 'title', [M, row(2)[0], col(0, 7)[1], row(0, 2)[1]], { ...S.title, fontSize: P(72), color: C.creme }, 'Título do trabalho em até três linhas'),
    ...[0, 4].map((c, i) => ph(`Autores ${i + 1}`, 'body', [col(c)[0], row(4)[0], col(0, 4)[1], RH], { ...S.sub, color: C.creme }, 'Nome do Autor\nNome do Autor\nNome do Autor')),
  ], { bg: { path: A('trama-capa.png') }, foot: false });

  layout('1.5 Sumário', [ label(col(0, 4)[1]), title([M, TY, col(0, 4)[1], 200]),
    ph('Itens', 'body', [col(5)[0], TY, col(0, 7)[1], CB - TY], { ...S.body, fontSize: P(32), paraSpaceAfter: 18 }, 'Partes da apresentação, uma por linha'),
  ]);

  // Variação do sumário para listas curtas (como no deck UNIPG): até 4 partes repartem a altura útil (132 a 972) em faixas
  // de 210; cada faixa abre com um fio, número em mono, nome da parte e uma linha de descrição.
  const SB = (CB - TY) / 4;
  layout('1.6 Sumário · lista', [
    label(col(0, 4)[1]), title([M, TY, col(0, 4)[1], 200]),
    ...[0, 1, 2, 3].flatMap((i) => { const y = TY + i * SB; return [
      rule(col(5)[0], y, col(5, 7)[1]),
      ph(`Número ${i + 1}`, 'body', [col(5)[0], y + 30, CW, 40], { ...S.label, fontSize: P(24) }, `0${i + 1}`),
      ph(`Item ${i + 1}`, 'body', [col(6)[0], y + 22, col(0, 6)[1], 64], { ...S.sub, fontSize: P(48) }, 'Parte da apresentação'),
      ph(`Descrição ${i + 1}`, 'body', [col(6)[0], y + 94, col(0, 6)[1], 44], { ...S.body, fontSize: P(28) }, 'Uma linha sobre esta parte'),
    ]; }),
  ]);

  layout('1.7 Seção', [
    // Seção na grade (medido no render): desenho do número ocupa as linhas 2–3 (420 a 684) e começa na margem;
    // título e descrição dentro da linha 4 (708 a 828).
    ph('Número', 'body', [M - 15, row(2)[0] - 54, col(0, 4)[1], 415], { fontFace: F.bold, fontSize: P(371), color: C.damasco, lineSpacingMultiple: 0.85 }, '01'),
    ph('Título', 'title', [M, row(4)[0] - 21, col(0, 10)[1], 94], { ...S.title, fontSize: P(82), color: C.creme }, 'Nome da seção'),
    ph('Descrição', 'body', [M, row(4)[0] + 72, col(0, 7)[1], 60], { ...S.body, fontSize: P(32), color: C.creme }, 'Uma frase sobre o que esta seção vai mostrar.'),
  ], { bg: { path: A('trama-secao.png') }, foot: false });

  layout('2.1 Texto', [ label(), title([M, TY, col(0, 5)[1], 560]),
    ph('Texto', 'body', [col(6)[0], TY, col(0, 6)[1], CB - TY], S.body, 'Até três parágrafos curtos sustentam a afirmação do título.') ]);

  layout('2.2 Duas colunas', [ ...header(),
    rule(col(0)[0], CT, col(0, 6)[1]), rule(col(6)[0], CT, col(0, 6)[1]),
    ph('Subtítulo 1', 'body', [col(0)[0], CT + 24, col(0, 6)[1], 50], S.sub, 'Subtítulo'),
    ph('Coluna 1', 'body', [col(0)[0], CT + 96, col(0, 6)[1], CB - CT - 96], S.body, 'Texto da primeira coluna.'),
    ph('Subtítulo 2', 'body', [col(6)[0], CT + 24, col(0, 6)[1], 50], S.sub, 'Subtítulo'),
    ph('Coluna 2', 'body', [col(6)[0], CT + 96, col(0, 6)[1], CB - CT - 96], S.body, 'Texto da segunda coluna.') ]);

  layout('2.3 Três colunas', [ ...header(),
    ...[0, 4, 8].flatMap((c, i) => [ rule(col(c)[0], CT, col(0, 4)[1]),
      ph(`Subtítulo ${i + 1}`, 'body', [col(c)[0], CT + 24, col(0, 4)[1], 50], S.sub, 'Subtítulo'),
      ph(`Texto ${i + 1}`, 'body', [col(c)[0], CT + 96, col(0, 4)[1], CB - CT - 96], S.body, 'Texto curto.') ]) ]);

  // Ícones: tratamento sólido (ícone creme sobre ladrilho ferro).
  layout('3.1 Ícones · recursos', [ ...header(),
    ...[0, 3, 6, 9].flatMap((c, i) => [ tile(col(c)[0], CT + 10, 96, C.ferro),
      pic(`Ícone ${i + 1}`, [col(c)[0] + 20, CT + 30, 56, 56], 'Ícone'),
      ph(`Subtítulo ${i + 1}`, 'body', [col(c)[0], CT + 140, col(0, 3)[1], 50], S.sub, 'Recurso'),
      ph(`Texto ${i + 1}`, 'body', [col(c)[0], CT + 206, col(0, 3)[1], CB - CT - 206], { ...S.body, fontSize: P(26) }, 'Uma ou duas frases.') ]) ]);

  // Ícones: tratamento simples (ícone ferro, sem ladrilho), passos ligados por um fio.
  layout('3.2 Ícones · processo', [ ...header(),
    ...[0, 3, 6, 9].flatMap((c, i) => [
      ...(i < 3 ? [rule(col(c)[0] + 96, CT + 46, col(0, 3)[1] + G - 120, C.fioForte, 2)] : []),
      pic(`Ícone ${i + 1}`, [col(c)[0], CT + 10, 72, 72], 'Ícone'),
      ph(`Número ${i + 1}`, 'body', [col(c)[0], CT + 120, col(0, 3)[1], 36], S.label, `0${i + 1}`),
      ph(`Subtítulo ${i + 1}`, 'body', [col(c)[0], CT + 166, col(0, 3)[1], 50], S.sub, 'Etapa'),
      ph(`Texto ${i + 1}`, 'body', [col(c)[0], CT + 232, col(0, 3)[1], CB - CT - 232], { ...S.body, fontSize: P(26) }, 'O que acontece nesta etapa.') ]) ]);

  // Ícones: tratamento claro (ícone ferro sobre ladrilho damasco), lista ao lado de imagem sangrada.
  const IW = col(6)[0];
  layout('3.3 Ícones · lista e imagem', [ ...header(IW - M - 60),
    ...[0, 1, 2].flatMap((r) => { const y = row(1 + r * 1.5)[0]; return [ tile(M, y, 88, C.damasco),
      pic(`Ícone ${r + 1}`, [M + 18, y + 18, 52, 52], 'Ícone'),
      ph(`Subtítulo ${r + 1}`, 'body', [M + 120, y, IW - M - 180, 46], S.sub, 'Item'),
      ph(`Texto ${r + 1}`, 'body', [M + 120, y + 56, IW - M - 180, 130], { ...S.body, fontSize: P(26) }, 'Uma frase sobre o item.') ]; }),
    pic('Imagem', [IW, 0, W - IW, FOOT_Y]) ]);

  // Imagem sangrada pelo topo e pela direita; texto e legenda na coluna estreita (mapas, fotos).
  const SW = col(0, 4)[1], SX = M + SW + G;
  layout('4.1 Imagem lateral', [ label(SW), title([M, TY, SW, 170], 52),
    ph('Texto', 'body', [M, row(2)[0], SW, row(0, 2)[1]], { ...S.body, fontSize: P(26) }, 'Duas ou três frases sobre a imagem.'),
    pic('Legenda', [M, row(4)[0], SW, CB - row(4)[0]], 'Legenda (imagem ou texto)'),
    pic('Imagem', [SX, 0, W - SX, FOOT_Y]) ]);

  layout('4.2 Texto e grade 2×2', [ label(SW), title([M, TY, SW, 170], 52),
    ph('Texto', 'body', [M, row(2)[0], SW, CB - row(2)[0]], { ...S.body, fontSize: P(26) }, 'Duas ou três frases sobre as imagens.'),
    ...[0, 1, 2, 3].map((i) => { const gw = (W - SX - 8) / 2, gh = (FOOT_Y - 8) / 2;
      return pic(`Imagem ${i + 1}`, [SX + (i % 2) * (gw + 8), Math.floor(i / 2) * (gh + 8), gw, gh]); }) ]);

  layout('4.3 Imagem e texto', [ label(),
    pic('Imagem', [M, TY, col(0, 7)[1], CB - TY]),
    title([col(7)[0], TY, col(0, 5)[1], 220], 52),
    ph('Texto', 'body', [col(7)[0], row(2)[0], col(0, 5)[1], CB - row(2)[0]], S.body, 'Uma ou duas frases sobre o que observar na imagem.') ]);

  layout('4.4 Figura larga', [ ...header(),
    pic('Imagem', [M, CT, FW, CB - CT - 50], 'Imagem, mapa, diagrama ou gráfico'),
    ph('Fonte', 'body', [M, CB - 30, FW, 30], S.cap, 'Fonte: autor, ano.') ]);

  layout('4.5 Duas imagens', [ ...header(),
    ...[0, 6].flatMap((c, i) => [ pic(`Imagem ${i + 1}`, [col(c)[0], CT, col(0, 6)[1], CB - CT - 60]),
      ph(`Legenda ${i + 1}`, 'body', [col(c)[0], CB - 40, col(0, 6)[1], 40], S.cap, 'Legenda curta · fonte') ]) ]);

  layout('4.6 Três imagens', [ ...header(),
    ...[0, 4, 8].flatMap((c, i) => [ pic(`Imagem ${i + 1}`, [col(c)[0], CT, col(0, 4)[1], CB - CT - 60]),
      ph(`Legenda ${i + 1}`, 'body', [col(c)[0], CB - 40, col(0, 4)[1], 40], S.cap, 'Legenda curta') ]) ]);

  layout('4.7 Mosaico', [ ...header(),
    pic('Imagem 1', [col(0)[0], CT, col(0, 8)[1], CB - CT]),
    pic('Imagem 2', [col(8)[0], CT, col(0, 4)[1], (CB - CT - G) / 2]),
    pic('Imagem 3', [col(8)[0], CT + (CB - CT + G) / 2, col(0, 4)[1], (CB - CT - G) / 2]) ]);

  // Sem título: imagem ou vídeo ocupa tudo acima do rodapé. 'obj' (espaço de conteúdo, sem tipo) aceita os dois.
  layout('4.8 Imagem cheia', [ ph('Imagem', 'obj', [0, 0, W, FOOT_Y], {}, 'Imagem ou vídeo') ]);

  layout('4.9 Vídeo', [ ...header(),
    ph('Vídeo', 'media', [M, CT, FW, CB - CT - 50], {}, 'Vídeo'),
    ph('Legenda', 'body', [M, CB - 30, FW, 30], S.cap, 'Legenda do vídeo · duração') ]);

  layout('5.1 Gráfico', [ ...header(),
    ph('Gráfico', 'chart', [M, CT, FW, CB - CT - 50], {}, 'Gráfico'),
    ph('Fonte', 'body', [M, CB - 30, FW, 30], S.cap, 'Fonte: autor, ano.') ]);

  layout('5.2 Gráfico e leituras', [ ...header(),
    ph('Gráfico', 'chart', [col(0)[0], CT, col(0, 8)[1], CB - CT], {}, 'Gráfico'),
    rule(col(8)[0], CT, col(0, 4)[1], C.umbro, 2),
    ph('Leituras', 'body', [col(8)[0], CT + 24, col(0, 4)[1], CB - CT - 24], { ...S.body, fontSize: P(26) }, 'Três leituras do gráfico, uma por parágrafo.') ]);

  layout('2.4 Equação', [ ...header(),
    ph('Equação', 'body', [M, row(2)[0], FW, row(0, 2)[1]], { fontFace: F.math, fontSize: P(64), color: C.umbro, align: 'center', valign: 'middle' }, 'Inserir › Equação'),
    ph('Nota', 'body', [col(2)[0], row(4)[0], col(0, 8)[1], 120], { ...S.body, fontSize: P(24), align: 'center' }, 'O que cada termo representa.') ]);

  layout('5.3 Números-chave', [ ...header(),
    ...[0, 4, 8].flatMap((c, i) => [ rule(col(c)[0], CT + 40, col(0, 4)[1], C.ferro, 3),
      ph(`Número ${i + 1}`, 'body', [col(c)[0], CT + 70, col(0, 4)[1], 170], { fontFace: F.bold, fontSize: P(140), color: C.ferro, valign: 'bottom', lineSpacingMultiple: 0.9 }, '00'),
      ph(`Rótulo ${i + 1}`, 'body', [col(c)[0], CT + 270, col(0, 4)[1], 50], S.sub, 'O que o número mede'),
      ph(`Nota ${i + 1}`, 'body', [col(c)[0], CT + 336, col(0, 4)[1], CB - CT - 336], { ...S.body, fontSize: P(24) }, 'Recorte, unidade, fonte.') ]) ]);

  layout('5.4 Comparação', [ ...header(),
    { line: { x: X(W / 2), y: X(CT), w: 0, h: X(CB - CT), line: { color: C.fioForte, width: 1.5 } } },
    ...[[0, C.ferro], [6, C.turquesaFundo]].flatMap(([c, cor], i) => { const x = col(c)[0] + (i ? 20 : 0), w = col(0, 6)[1] - 20;
      return [ ph(`Lado ${i + 1}`, 'body', [x, CT, w, 50], { ...S.sub, color: cor }, i ? 'Depois' : 'Antes'),
        pic(`Imagem ${i + 1}`, [x, CT + 70, w, 380]),
        ph(`Texto ${i + 1}`, 'body', [x, CT + 480, w, CB - CT - 480], { ...S.body, fontSize: P(26) }, 'O que muda deste lado.') ]; }) ]);

  layout('5.5 Tabela', [ ...header(),
    ph('Tabela', 'tbl', [M, CT, FW, CB - CT - 50], {}, 'Tabela'),
    ph('Fonte', 'body', [M, CB - 30, FW, 30], S.cap, 'Fonte: autor, ano.') ]);

  layout('2.5 Conclusões', [ ...header(),
    ...[0, 4, 8].flatMap((c, i) => [ rule(col(c)[0], CT, col(0, 4)[1], C.umbro, 2),
      pic(`Ícone ${i + 1}`, [col(c)[0], CT + 36, 56, 56], 'Ícone'),
      ph(`Número ${i + 1}`, 'body', [col(c)[0], CT + 120, col(0, 4)[1], 36], S.label, `0${i + 1}`),
      ph(`Subtítulo ${i + 1}`, 'body', [col(c)[0], CT + 166, col(0, 4)[1], 50], S.sub, 'Conclusão'),
      ph(`Texto ${i + 1}`, 'body', [col(c)[0], CT + 232, col(0, 4)[1], CB - CT - 232], { ...S.body, fontSize: P(26) }, 'Uma ou duas frases.') ]) ]);

  layout('2.6 Só título', [ ...header() ]);

  // Encerramento centrado: logo LINA e logos institucionais nas mesmas alturas da capa (72 do topo e da base);
  // 'Obrigado' preenche a linha 2, apresentador e contato na linha 3.
  const ENC = { ty: -42, size: 171, py: 47, cy: 99 }; // py, cy: abaixo da descendente do g, que entra na linha 3
  layout('6.1 Encerramento', [
    { image: { path: A('logo-h-creme.png'), x: X((W - 200) / 2), y: X(M), w: X(200), h: X(68.6) } }, // como na capa, centrada
    ph('Título', 'title', [M, row(2)[0] + ENC.ty, FW, 200], { ...S.title, fontSize: P(ENC.size), color: C.creme, align: 'center' }, 'Obrigado'),
    ph('Apresentador', 'body', [M, row(3)[0] + ENC.py, FW, 44], { ...S.label, fontSize: P(LBL.size), color: C.creme, align: 'center' }, 'Nome do Apresentador'),
    ph('Contato', 'body', [M, row(3)[0] + ENC.cy, FW, 36], { ...S.label, color: C.creme, align: 'center' }, 'nome@ufc.br · lina.ufc.br'),
    ...insts(1080 - M - 99, 646), // como na capa: pé visível a 72 da borda
  ], { bg: { path: A('trama-capa.png') }, foot: false });
  // Variação: autores em duas colunas; a calha entre col 6 e 7 cai no centro do slide.
  layout('6.2 Encerramento · autores', [
    { image: { path: A('logo-h-creme.png'), x: X((W - 200) / 2), y: X(M), w: X(200), h: X(68.6) } },
    ph('Título', 'title', [M, row(2)[0] + ENC.ty, FW, 200], { ...S.title, fontSize: P(ENC.size), color: C.creme, align: 'center' }, 'Obrigado'),
    ...[[0, 'right'], [6, 'left']].map(([c, align], i) => ph(`Autores ${i + 1}`, 'body', [col(c)[0], row(3)[0] + ENC.py, col(0, 6)[1], RH], { ...S.label, fontSize: P(LBL.size), color: C.creme, align }, 'Nome do Autor\nNome do Autor')),
    ...insts(1080 - M - 99, 646),
  ], { bg: { path: A('trama-capa.png') }, foot: false });
}

// ---------- slides de exemplo ----------
async function examples() {
  const IMG = A('gen/provisoria.png');
  const icon = (n, tag) => A(`gen/${n}-${tag}.png`);
  const s = (m, fill = {}, extra) => {
    const real = pres.addSlide({ masterName: m }), rec = { master: m, fill, charts: [], tables: [], images: [], media: [], texts: [] };
    HTML_SLIDES.push(rec);
    const sl = { addChart: (t, d, o) => (rec.charts.push({ type: t, series: d, opts: o }), real.addChart(t, d, o)),
      addTable: (r, o) => (rec.tables.push({ rows: r, opts: o }), real.addTable(r, structuredClone(o))),
      addImage: (o) => (o.placeholder || o.pptOnly || rec.images.push(o), real.addImage(o)), addText: (v, o) => (o.placeholder || rec.texts.push([v, o]), real.addText(v, o)),
      addMedia: (o) => (rec.media.push(o), real.addMedia(o)),
      anim: (a) => { rec.anim = a; }, html: (h) => { rec.html = (rec.html || '') + h; } }; // anim: efeito de entrada no deck HTML (ex.: 'aleatorio'); html: marcação crua, só no deck HTML; imagem com pptOnly: só no .pptx
    for (const [k, v] of Object.entries(fill)) {
      if (typeof v === 'object' && v && v.img) sl.addImage({ placeholder: k, path: v.img, ...v.box, ...v.ppt });
      else sl.addText(v, { placeholder: k });
    }
    extra && extra(sl);
    return sl;
  };
  // pptxgenjs: no 'cover', w/h devem ter a proporção da imagem (1600 × 1000), senão ela é esticada; sizing leva a caixa.
  const img = (box) => ({ img: IMG, box: { x: X(box[0]), y: X(box[1]), w: X(box[2]), h: X(box[3]), sizing: { type: 'cover', w: X(box[2]), h: X(box[3]) } }, ppt: { w: X(1600), h: X(1000) } });
  const ic = (n, tag, box) => ({ img: icon(n, tag), box: { x: X(box[0]), y: X(box[1]), w: X(box[2]), h: X(box[3]) } });
  const SW = col(0, 4)[1], SX = M + SW + G, IW = col(6)[0];
  // Outro deck com os mesmos layouts: DECK=arquivo.js node build.js (o módulo recebe as peças e monta os slides).
  if (process.env.DECK) return require(path.resolve(process.env.DECK))({ pres, s, ic, icon, A, C, F, P, X, col, row, CT, CB, TY, M, W, G, FW, FOOT_Y, sharp });

  s('1.1 Abertura', {});
  s('1.2 Capa', { 'Evento': 'Seminário de pesquisa · 15 · 10 · 2026', 'Título': 'Título do trabalho em até três linhas, com subtítulo após dois-pontos', 'Apresentador': 'Nome do Apresentador', 'Coautores': 'Coautora Sobrenome · Coautor Sobrenome · Orientadora Sobrenome' });
  s('1.4 Capa · autores', { 'Evento': 'Seminário de pesquisa · 15 · 10 · 2026', 'Título': 'Título do trabalho em até três linhas, com subtítulo após dois-pontos',
    'Autores 1': 'Nome do Autor\nNome da Autora\nNome do Autor', 'Autores 2': 'Nome da Autora\nNome do Autor' });
  s('1.3 Capa · imagem', { 'Imagem': img([M, M, col(0, 5)[1], 1080 - 2 * M]), 'Evento': 'Seminário de pesquisa · 15 · 10 · 2026', 'Título': 'Título do trabalho em até três linhas',
    'Autores 1': 'Nome do Autor\nNome da Autora\nNome do Autor', 'Autores 2': 'Nome da Autora\nNome do Autor' });
  s('1.5 Sumário', { 'Rótulo': 'Sumário', 'Título': 'O que vamos ver',
    'Itens': ['Contexto', 'Problema', 'Método', 'Resultados', 'Próximos passos'].flatMap((t, i, a) => [
      { text: `0${i + 1}    `, options: { fontFace: F.mono, color: C.ferro, fontSize: P(24) } }, { text: t, options: { breakLine: i < a.length - 1 } }]) });
  s('1.6 Sumário · lista', Object.assign({ 'Título': 'O que vamos ver' },
    ...['Contexto', 'Método', 'Resultados', 'Próximos passos'].map((t, i) => ({ [`Número ${i + 1}`]: `0${i + 1}`, [`Item ${i + 1}`]: t, [`Descrição ${i + 1}`]: 'Uma linha sobre esta parte' }))));
  s('1.7 Seção', { 'Número': '01', 'Título': 'Contexto', 'Descrição': 'Uma frase sobre o que esta seção vai mostrar.' });
  s('2.1 Texto', { 'Rótulo': '02 · Problema', 'Título': 'Uma afirmação por slide, escrita como frase completa',
    'Texto': [{ text: 'Até três parágrafos curtos à direita sustentam a afirmação do título.', options: { breakLine: true } },
      { text: 'Cada um com uma ideia; nada de listas com mais de quatro itens.', options: { breakLine: true } },
      { text: 'A conclusão do slide vem por último, em Medium e ferro.', options: { fontFace: F.medium, color: C.ferro } }] });
  s('2.2 Duas colunas', { 'Rótulo': '02 · Problema', 'Título': 'Duas ideias lado a lado', 'Subtítulo 1': 'O que se sabe', 'Coluna 1': 'Duas ou três frases sobre o estado atual.', 'Subtítulo 2': 'O que falta', 'Coluna 2': 'Duas ou três frases sobre a lacuna.' });
  s('2.3 Três colunas', { 'Rótulo': '02 · Problema', 'Título': 'Três escalas do mesmo problema',
    'Subtítulo 1': 'Território', 'Texto 1': 'Uma ou duas frases.', 'Subtítulo 2': 'Edifício', 'Texto 2': 'Uma ou duas frases.', 'Subtítulo 3': 'Elemento', 'Texto 3': 'Uma ou duas frases.' });
  const feat = [['scan-line', 'Levantamento'], ['layers', 'Modelagem'], ['database', 'Dados'], ['chart-line', 'Análise']];
  s('3.1 Ícones · recursos', Object.assign({ 'Rótulo': '03 · Método', 'Título': 'Quatro frentes de trabalho' },
    ...feat.map(([n, t], i) => ({ [`Ícone ${i + 1}`]: ic(n, 'creme', [col(i * 3)[0] + 20, CT + 30, 56, 56]), [`Subtítulo ${i + 1}`]: t, [`Texto ${i + 1}`]: 'Uma ou duas frases sobre esta frente.' }))));
  const proc = [['camera', 'Captura'], ['box', 'Modelo'], ['cpu', 'Simulação'], ['monitor', 'Painel']];
  s('3.2 Ícones · processo', Object.assign({ 'Rótulo': '03 · Método', 'Título': 'Do levantamento ao painel' },
    ...proc.map(([n, t], i) => ({ [`Ícone ${i + 1}`]: ic(n, 'ferro', [col(i * 3)[0], CT + 10, 72, 72]), [`Número ${i + 1}`]: `0${i + 1}`, [`Subtítulo ${i + 1}`]: t, [`Texto ${i + 1}`]: 'O que acontece nesta etapa.' }))));
  const list = [['map', 'Território'], ['landmark', 'Patrimônio'], ['users', 'Comunidade']];
  s('3.3 Ícones · lista e imagem', Object.assign({ 'Rótulo': '01 · Contexto', 'Título': 'Três dimensões do caso', 'Imagem': img([IW, 0, W - IW, FOOT_Y]) },
    ...list.map(([n, t], i) => ({ [`Ícone ${i + 1}`]: ic(n, 'ferro', [M + 18, row(1 + i * 1.5)[0] + 18, 52, 52]), [`Subtítulo ${i + 1}`]: t, [`Texto ${i + 1}`]: 'Uma frase sobre esta dimensão.' }))));
  s('4.1 Imagem lateral', { 'Rótulo': '01 · Contexto', 'Título': 'Área de estudo', 'Texto': 'Duas ou três frases sobre o recorte e a escala do mapa.', 'Imagem': img([SX, 0, W - SX, FOOT_Y]) });
  s('4.2 Texto e grade 2×2', Object.assign({ 'Rótulo': '01 · Contexto', 'Título': 'O lugar hoje', 'Texto': 'Duas ou três frases sobre as fotos.' },
    ...[0, 1, 2, 3].map((i) => { const gw = (W - SX - 8) / 2, gh = (FOOT_Y - 8) / 2;
      return { [`Imagem ${i + 1}`]: img([SX + (i % 2) * (gw + 8), Math.floor(i / 2) * (gh + 8), gw, gh]) }; })));
  s('4.3 Imagem e texto', { 'Rótulo': '03 · Método', 'Imagem': img([M, 160, col(0, 7)[1], CB - 160]), 'Título': 'Título curto da imagem', 'Texto': 'Uma ou duas frases sobre o que observar na imagem.' });
  s('4.4 Figura larga', { 'Rótulo': '03 · Método', 'Título': 'Uma figura larga com título curto', 'Imagem': img([M, CT, FW, CB - CT - 50]), 'Fonte': 'Fonte: LINA, 2026.' });
  s('4.5 Duas imagens', { 'Rótulo': '03 · Método', 'Título': 'Antes e depois do levantamento',
    'Imagem 1': img([col(0)[0], CT, col(0, 6)[1], CB - CT - 60]), 'Legenda 1': 'Nuvem de pontos · 2018',
    'Imagem 2': img([col(6)[0], CT, col(0, 6)[1], CB - CT - 60]), 'Legenda 2': 'Modelo · 2026' });
  s('4.6 Três imagens', Object.assign({ 'Rótulo': '03 · Método', 'Título': 'Três vistas do mesmo objeto' },
    ...[0, 4, 8].map((c, i) => ({ [`Imagem ${i + 1}`]: img([col(c)[0], CT, col(0, 4)[1], CB - CT - 60]), [`Legenda ${i + 1}`]: `Vista ${i + 1}` }))));
  s('4.7 Mosaico', { 'Rótulo': '03 · Método', 'Título': 'Uma imagem principal e dois detalhes',
    'Imagem 1': img([col(0)[0], CT, col(0, 8)[1], CB - CT]), 'Imagem 2': img([col(8)[0], CT, col(0, 4)[1], (CB - CT - G) / 2]),
    'Imagem 3': img([col(8)[0], CT + (CB - CT + G) / 2, col(0, 4)[1], (CB - CT - G) / 2]) });
  s('4.8 Imagem cheia', { 'Imagem': img([0, 0, W, FOOT_Y]) });
  s('4.9 Vídeo', { 'Rótulo': '03 · Método', 'Título': 'Demonstração da plataforma', 'Legenda': 'Clique no ícone do espaço para inserir o vídeo · 1 min 20 s' });
  s('5.1 Gráfico', { 'Rótulo': '04 · Resultados', 'Título': 'Série medida ao longo do ano', 'Fonte': 'Fonte: LINA, 2026.' }, (sl) => {
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    sl.addChart(pres.charts.LINE, [{ name: 'Medido', labels: meses, values: [3, 4, 6, 8, 11, 14, 16, 15, 12, 9, 6, 4] },
      { name: 'Modelo', labels: meses, values: [3.5, 4.5, 6.5, 8.5, 10.5, 13, 15, 14.5, 12.5, 9.5, 6.5, 4.5] }],
      { placeholder: 'Gráfico', chartColors: [C.ferro, C.turquesaFundo], lineSize: 3, lineDataSymbol: 'none',
        showLegend: true, legendPos: 't', legendFontFace: '+mn-lt', legendFontSize: 14, legendColor: C.umbro,
        catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 14, valAxisLabelFontSize: 14,
        catAxisLabelColor: C.umbro, valAxisLabelColor: C.umbro, valGridLine: { color: C.fio, size: 1 }, catGridLine: { style: 'none' },
        catAxisLineColor: C.fioForte, valAxisLineShow: false });
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
  s('2.4 Equação', { 'Rótulo': '03 · Método', 'Título': 'O modelo', 'Equação': '𝜃(𝑡) = 𝑇(𝑡) + 𝑆(𝑡) + 𝐷(𝑡) + 𝜀(𝑡)', 'Nota': 'Tendência, ciclo sazonal, ciclo diário e resíduo.' });
  s('5.3 Números-chave', { 'Rótulo': '04 · Resultados', 'Título': 'Em números',
    'Número 1': '76', 'Rótulo 1': 'estações monitoradas', 'Nota 1': 'Entre 2018 e 2026.',
    'Número 2': '3×', 'Rótulo 2': 'mais rápido', 'Nota 2': 'Comparado ao processo manual.',
    'Número 3': '0,8', 'Rótulo 3': 'correlação', 'Nota 3': 'Entre modelo e medição.' });
  s('5.4 Comparação', { 'Rótulo': '04 · Resultados', 'Título': 'Dois cenários',
    'Lado 1': 'Antes', 'Imagem 1': img([col(0)[0], CT + 70, col(0, 6)[1] - 20, 380]), 'Texto 1': 'O que se via antes da intervenção.',
    'Lado 2': 'Depois', 'Imagem 2': img([col(6)[0] + 20, CT + 70, col(0, 6)[1] - 20, 380]), 'Texto 2': 'O que muda com a intervenção.' });
  s('5.5 Tabela', { 'Rótulo': '03 · Método', 'Título': 'Materiais', 'Fonte': 'Fonte: literatura.' }, (sl) => {
    const h = (t) => ({ text: t, options: { fontFace: F.medium, color: C.umbro, border: [{ type: 'none' }, { type: 'none' }, { pt: 1, color: C.umbro }, { type: 'none' }] } });
    const c = (t, mono) => ({ text: t, options: { fontFace: mono ? F.mono : F.light, color: C.umbro, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: C.fioForte }, { type: 'none' }] } });
    const rows = [['Pedra', '2570', '2,34', '0,1'], ['Enchimento', '1800', '1,20', '0,15'], ['Solo', '1937', '0,01', '0,3']];
    const m = (t) => ({ text: t, options: { fontFace: F.math, fontSize: P(34) } }); // símbolos em STIX Two Math: Outfit não tem grego
    sl.addTable([[h('Material'), h([m('𝜌'), { text: ' (kg/m³)' }]), h([m('𝐸'), { text: ' (GPa)' }]), h([m('𝜈')])], ...rows.map((r) => r.map((v, i) => c(v, i > 0)))],
      { placeholder: 'Tabela', x: X(M), y: X(CT), w: X(FW), colW: [X(FW * .4), X(FW * .2), X(FW * .2), X(FW * .2)], fontSize: P(28), rowH: X(72), valign: 'middle', margin: [0, 0, 0, 0] });
  });
  const conc = [['chart-line', 'Modelo'], ['bell', 'Alerta'], ['monitor', 'Painel']];
  s('2.5 Conclusões', Object.assign({ 'Rótulo': '05 · Próximos passos', 'Título': 'O que vem a seguir' },
    ...conc.map(([n, t], i) => ({ [`Ícone ${i + 1}`]: ic(n, 'ferro', [col(i * 4)[0], CT + 36, 56, 56]), [`Número ${i + 1}`]: `0${i + 1}`, [`Subtítulo ${i + 1}`]: t, [`Texto ${i + 1}`]: 'Uma ou duas frases.' }))));
  s('2.6 Só título', { 'Rótulo': '03 · Método', 'Título': 'Diagrama livre: monte com ícones e pictogramas' });
  s('6.1 Encerramento', { 'Título': 'Obrigado', 'Apresentador': 'Nome do Apresentador', 'Contato': 'nome@ufc.br · lina.ufc.br' });
  s('6.2 Encerramento · autores', { 'Título': 'Obrigado', 'Autores 1': 'Nome do Autor\nNome da Autora\nNome do Autor', 'Autores 2': 'Nome da Autora\nNome do Autor' });
  s('2.2 Duas colunas', { 'Rótulo': 'Guia do template · apague este slide antes de apresentar', 'Título': 'Como usar',
    'Subtítulo 1': 'Montar', 'Coluna 1': 'Novo slide: Página Inicial › Novo Slide › escolha um layout LINA.\nRodapé: Inserir › Cabeçalho e Rodapé › Rodapé › “Título abreviado” › Aplicar a Todos.\nImagens e ícones: clique no ícone do espaço; a imagem recorta sozinha.',
    'Subtítulo 2': 'Regras', 'Coluna 2': 'Instale a Outfit e a JetBrains Mono (livres, em assets/fonts e Google Fonts). Ao salvar, marque “Incorporar fontes”.\nÍcones Phosphor, peso regular, um tratamento por slide: sólido, simples ou claro.\nSem emoji. Mono só para datas, números, rótulos e legendas.' });
}

// Páginas de ícones aplicados: um bloco de 2 linhas × 11 por tratamento, ou 1 linha por par duotone; nome na coluna 0.
function iconPages() {
  TRAT.forEach((blocos, p) => {
    const sl = pres.addSlide({ masterName: '2.6 Só título' });
    sl.addText('Ícones · copiar e colar · apague antes de apresentar', { placeholder: 'Rótulo' });
    sl.addText(['Sólido e cheio', 'Claro e simples', 'Duotone · fundos claros', 'Duotone · fundos escuros'][p], { placeholder: 'Título' });
    const linhas = p < 2 ? 2 : 1;
    blocos.forEach((t, b) => {
      sl.addText(t[0], { x: X(M), y: X(row(1 + b * linhas)[0]), w: X(CW), h: X(RH), margin: 0, valign: 'middle', ...S.cap, fontSize: P(22) });
      BIB.slice(0, 11 * linhas).forEach((n, i) => {
        const [x] = col(1 + (i % 11)), [y] = row(1 + b * linhas + Math.floor(i / 11));
        sl.addImage({ path: bibPng(t, n), x: X(x + 3), y: X(y), w: X(RH), h: X(RH), altText: n });
      });
    });
    sl.addText('Clique no ícone, copie (⌘C) e cole no seu slide. Um tratamento por slide. Nomes e outros ícones: phosphoricons.com', { x: X(M), y: X(row(5)[0] + 60), w: X(FW), h: X(60), margin: 0, valign: 'bottom', ...S.cap });
  });
}

(async () => {
  await assets();
  defineLayouts(); flushLayouts();
  await examples();
  if (!process.env.DECK) iconPages();
  fs.writeFileSync(A('out/layouts.json'), JSON.stringify(LAYOUTS));
  console.log('html', require('./html.js')({ layouts: HTML_LAYOUTS, slides: HTML_SLIDES, out: A('out/html/Apresentacao.dc.html'), C, F, W, FOOT_Y, M, R }), 'slides');
  console.log(await pres.writeFile({ fileName: A('out/LINA-Apresentacao.pptx') }));
})();
