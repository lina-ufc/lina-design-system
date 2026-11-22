// Gera os modelos Word do Documento A4 (.docx de exemplo e .dotx) a partir do HTML de referência.
// Uso (cwd = word/): node build.js  →  out/LINA-<Modelo>-exemplo.docx e out/LINA-<Modelo>.dotx
// Acrescentar um modelo: uma função de conteúdo + um objeto de tamanhos em MODELOS (POP: Task 3).
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Header, Footer, Tab, PageNumber,
  AlignmentType, BorderStyle, LineRuleType, WidthType, TableLayoutType, TableAnchorType,
  RelativeHorizontalPosition, RelativeVerticalPosition, SectionType,
} = require('docx');
const { unzipSync, zipSync, strFromU8, strToU8 } = require('fflate'); // docx 9 usa fflate, não jszip
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const A = (f) => path.join(__dirname, f);
const ROOT = (f) => path.join(__dirname, '../../..', f);

// ---------- medidas: 1 px do HTML = 15 twips = 0,75 pt ----------
const px = (n) => Math.round(n * 15);          // px para twips
const hp = (n) => Math.ceil(n * 1.5);          // tamanho de fonte em px para meio-ponto
const lh = (fonte, razao) => px(fonte * razao); // entrelinha exata em twips
const bd = (n) => Math.round(n * 6);           // espessura de borda: px para oitavos de ponto
const pts = (n) => n * 0.75;                   // px para pt (espaço de borda)
const PAGE_W = 11906, PAGE_H = 16838;          // A4
const MX = px(76), TW = PAGE_W - 2 * MX;       // margens laterais e largura do texto (9626)
const TWPX = TW / 15;                          // largura do texto em px do HTML (≈ 642)
const COL2 = { count: 2, space: px(32), equalWidth: true }; // duas colunas, entrecoluna de 32 px

const C = { ferro: 'A81F0D', ferroFundo: '6E1408', umbro: '2A1A12', nata: 'FDF1CF', fioForte: 'C9B87A' };
// opacidade vira cor: mistura de fg com bg (branco por padrão)
const mix = (fg, a, bg = 'FFFFFF') => [0, 2, 4].map((i) =>
  Math.round(parseInt(fg.substr(i, 2), 16) * a + parseInt(bg.substr(i, 2), 16) * (1 - a)).toString(16).padStart(2, '0')).join('').toUpperCase();
const F = { light: 'Outfit Light', reg: 'Outfit', med: 'Outfit Medium', xbold: 'Outfit ExtraBold', mono: 'JetBrains Mono' };
const LANG = { value: 'pt-BR' };
const EXACT = LineRuleType.EXACT, DXA = WidthType.DXA;

// ---------- tamanhos por modelo ----------
// Interno: margem superior ≈ 64 + 26 + 44 px do HTML; ajustar olhando o render.
const PG = { size: { width: PAGE_W, height: PAGE_H }, margin: { top: px(134), bottom: px(64), left: MX, right: MX, header: px(64), footer: px(40) } };
const pg = (t) => ({ ...PG, margin: { ...PG.margin, ...(t.top && { top: t.top }) } }); // top: margem superior própria do modelo
const MODELOS = {
  relatorio: {
    arq: 'Relatorio',
    ref: 'REL-2026-01 · Relatório anual de atividades',
    cabSecao: 1, // índice da seção onde entram cabeçalho e rodapé (a 0 é a capa, sem eles)
    // antes: empurra o bloco do título ao terço inferior da capa. No HTML o título começa a ~57 % da página
    // (≈ 516 px abaixo da linha do logo); a conta cheia dava 560 px e estourou no Word/LibreOffice
    // (altura de linha maior). 500 px deixa folga; ajustar olhando o render.
    rotulo: { px: 16, fio: true, antes: px(500) },
    titulo: { font: F.xbold, bold: false, px: 56, lh: 1.02, track: -0.02 },
    secao: { px: 26, lh: 1.15, track: -0.01 },
  },
  artigo: {
    arq: 'Artigo',
    ref: 'Sobrenome et al. · Título abreviado do artigo',
    cabSecao: 0,
    primeira: 'Cadernos LINA · v. 2 · n. 1 · 2026 · p. 1–18', // cabeçalho próprio da 1ª página
    rodape: 'DOI 10.0000/cl.2026.0001',
    // o HTML dá 36 px entre cabeçalho e texto; 28 px vêm do "antes" da seção (que também separa blocos no meio da página)
    top: px(134 - 28),
    rotulo: { px: 13, fio: false, antes: px(36) },
    titulo: { font: F.reg, bold: true, px: 32, lh: 1.12, track: -0.012, antes: 10 },
    secao: { px: 15, lh: 1.55, track: 0, after: 8, antes: 28 },
  },
};

// ---------- estilos ----------
const P = (id, name, o = {}) => ({ id, name, basedOn: 'Normal', quickFormat: true, ...o, run: { language: LANG, ...o.run } });
const estilosP = (t) => [
  P('LINACorpo', 'LINA Corpo', { paragraph: { alignment: AlignmentType.BOTH, spacing: { after: px(10), line: lh(15, 1.55), lineRule: EXACT } }, run: { font: F.light, size: hp(15) } }),
  P('LINARotulo', 'LINA Rótulo', {
    next: 'LINATitulo',
    paragraph: {
      spacing: { before: t.rotulo.antes },
      ...(t.rotulo.fio && { border: { top: { style: BorderStyle.SINGLE, size: bd(2), color: C.ferro, space: pts(28) } } }),
    },
    run: { font: F.med, size: hp(t.rotulo.px), color: C.ferro, allCaps: true, characterSpacing: Math.round(px(t.rotulo.px) * 0.08) },
  }),
  P('LINATitulo', 'LINA Título', {
    next: 'LINASubtitulo',
    paragraph: { keepNext: true, spacing: { before: px(t.titulo.antes ?? 14), line: lh(t.titulo.px, t.titulo.lh), lineRule: EXACT } },
    run: { font: t.titulo.font, bold: t.titulo.bold || undefined, size: hp(t.titulo.px), characterSpacing: Math.round(px(t.titulo.px) * t.titulo.track) },
  }),
  // after: respiro de 64 px até a grade de metadados da capa; indent: max-width de 46ch (≈ 497 px) do HTML
  P('LINASubtitulo', 'LINA Subtítulo', {
    paragraph: { spacing: { before: px(22), after: px(64) }, indent: { right: px(TWPX - 497) } },
    run: { font: F.light, size: hp(18) },
  }),
  P('LINASecao', 'LINA Seção', {
    next: 'LINACorpo',
    paragraph: { keepNext: true, outlineLevel: 0, spacing: { before: px(t.secao.antes ?? 0), after: px(t.secao.after ?? 18), line: lh(t.secao.px, t.secao.lh), lineRule: EXACT } },
    run: { font: F.reg, bold: true, size: hp(t.secao.px), characterSpacing: Math.round(px(t.secao.px) * t.secao.track) },
  }),
  P('LINASubsecao', 'LINA Subseção', {
    next: 'LINACorpo',
    paragraph: { keepNext: true, outlineLevel: 1, spacing: { before: px(36), after: px(12) } },
    run: { font: F.reg, bold: true, size: hp(18) },
  }),
  P('LINACabecalho', 'LINA Cabeçalho', {
    paragraph: {
      rightTabStop: TW,
      border: { bottom: { style: BorderStyle.SINGLE, size: bd(1), color: C.fioForte, space: pts(12) } },
    },
    run: { size: hp(12) },
  }),
  P('LINARodape', 'LINA Rodapé', {
    paragraph: { rightTabStop: TW },
    run: { font: F.mono, size: hp(11), color: mix(C.umbro, 0.7) },
  }),
  P('LINANumero', 'LINA Número', { paragraph: { alignment: AlignmentType.RIGHT }, run: { font: F.mono, size: hp(13) } }),
  P('LINADireita', 'LINA Direita', { paragraph: { alignment: AlignmentType.RIGHT } }),
  P('LINAFigura', 'LINA Figura', { paragraph: { alignment: AlignmentType.CENTER, spacing: { before: px(28) } } }),
  P('LINALegenda', 'LINA Legenda', { paragraph: { spacing: { before: px(10), line: lh(12, 1.45), lineRule: EXACT } }, run: { size: hp(12) } }),
  P('LINAMeta', 'LINA Meta', { paragraph: { spacing: { before: px(18), line: lh(13, 1.5), lineRule: EXACT } }, run: { size: hp(13) } }),
  P('LINAMetaDireita', 'LINA Meta Direita', {
    basedOn: 'LINAMeta',
    paragraph: { alignment: AlignmentType.RIGHT, spacing: { line: lh(12, 1.5), lineRule: EXACT } },
    run: { font: F.mono, size: hp(12) },
  }),
  P('LINAMonoDireita', 'LINA Mono Direita', {
    paragraph: { alignment: AlignmentType.RIGHT, spacing: { line: lh(12, 1.6), lineRule: EXACT } },
    run: { font: F.mono, size: hp(12) },
  }),
  P('LINAEquipe', 'LINA Equipe', { paragraph: { spacing: { before: px(14), line: lh(13, 1.45), lineRule: EXACT } }, run: { size: hp(13) } }),
  // before/after de 24 px: respiro do colofão entre o fio e o texto e até a margem inferior
  P('LINAColofao', 'LINA Colofão', { paragraph: { spacing: { before: px(24), after: px(24), line: lh(12, 1.55), lineRule: EXACT } }, run: { size: hp(12) } }),
  // parágrafo mínimo (1 pt) que fecha seção ou separa tabelas
  P('LINAAutores', 'LINA Autores', { paragraph: { spacing: { before: px(18) } }, run: { size: hp(15) } }),
  P('LINAAfiliacao', 'LINA Afiliação', { paragraph: { spacing: { before: px(4) } }, run: { size: hp(12), color: mix(C.umbro, 0.75) } }),
  P('LINAResumo', 'LINA Resumo', { paragraph: { alignment: AlignmentType.BOTH, spacing: { line: lh(14, 1.55), lineRule: EXACT } }, run: { size: hp(14) } }),
  P('LINATituloTabela', 'LINA Título de Tabela', { paragraph: { keepNext: true, spacing: { before: px(28), after: px(8) } }, run: { font: F.med, size: hp(12) } }),
  P('LINAReferencia', 'LINA Referência', {
    paragraph: { alignment: AlignmentType.BOTH, keepLines: true, indent: { left: px(16), hanging: px(16) }, spacing: { after: px(8), line: lh(12, 1.5), lineRule: EXACT } },
    run: { size: hp(12) },
  }),
  // parágrafo mínimo com fio fio-forte (separa o título "Referências" das duas colunas)
  P('LINAFio', 'LINA Fio', {
    paragraph: { border: { bottom: { style: BorderStyle.SINGLE, size: bd(1), color: C.fioForte, space: 0 } }, spacing: { before: px(4), after: px(12), line: 20, lineRule: EXACT } },
    run: { size: 2 },
  }),
  P('LINAQuebra', 'LINA Quebra', { paragraph: { spacing: { before: 0, after: 0, line: 20, lineRule: EXACT } }, run: { size: 2 } }),
];
const estilosC = [
  { id: 'LINADestaque', name: 'LINA Destaque', quickFormat: true, run: { font: F.med, language: LANG } },
  { id: 'LINAMono', name: 'LINA Mono', quickFormat: true, run: { font: F.mono } },
  { id: 'LINAMonoPequeno', name: 'LINA Mono Pequeno', quickFormat: true, run: { font: F.mono, size: hp(11) } },
  { id: 'LINAFonte', name: 'LINA Fonte', quickFormat: true, run: { font: F.mono, size: hp(11), color: mix(C.umbro, 0.75) } },
  { id: 'LINARotuloMeta', name: 'LINA Rótulo Meta', quickFormat: true, run: { color: mix(C.umbro, 0.7) } },
];

// Estilos de tabela: o docx não tem API; entram no styles.xml depois de gerar.
const lado = (n, cor) => cor ? `<w:${n} w:val="single" w:sz="${bd(1)}" w:space="0" w:color="${cor}"/>` : `<w:${n} w:val="nil"/>`;
const bordas = (top, bottom, h) => `<w:tblBorders>${lado('top', top)}${lado('left')}${lado('bottom', bottom)}${lado('right')}${lado('insideH', h)}${lado('insideV')}</w:tblBorders>`;
const marg = (t, l, b, r) => `<w:tblCellMar><w:top w:w="${t}" w:type="dxa"/><w:left w:w="${l}" w:type="dxa"/><w:bottom w:w="${b}" w:type="dxa"/><w:right w:w="${r}" w:type="dxa"/></w:tblCellMar>`;
const estTab = (id, nome, { pr = '', borders, shd = '', mar, extra = '' }) =>
  `<w:style w:type="table" w:customStyle="1" w:styleId="${id}"><w:name w:val="${nome}"/><w:basedOn w:val="TableNormal"/><w:uiPriority w:val="59"/><w:qFormat/>${pr}<w:tblPr>${borders}${shd}${mar}</w:tblPr>${extra}</w:style>`;
const fonteMed = `<w:rFonts w:ascii="${F.med}" w:hAnsi="${F.med}" w:eastAsia="${F.med}" w:cs="${F.med}"/>`;
const ESTILOS_TABELA = [
  // 14 px = 10,5 pt; células com 9 px em cima e embaixo; 1ª linha em Outfit Medium
  estTab('LINATabela', 'LINA Tabela', {
    pr: `<w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:rPr><w:sz w:val="${hp(14)}"/><w:szCs w:val="${hp(14)}"/></w:rPr>`,
    borders: bordas(C.umbro, C.fioForte, C.fioForte), mar: marg(px(9), 0, px(9), 0),
    extra: `<w:tblStylePr w:type="firstRow"><w:rPr>${fonteMed}</w:rPr></w:tblStylePr>`,
  }),
  estTab('LINAMetadados', 'LINA Metadados', { borders: bordas(), mar: marg(0, 0, 0, 0) }),
  estTab('LINAMetadadosFio', 'LINA Metadados Fio', { borders: bordas(C.fioForte), mar: marg(0, 0, 0, 0) }),
  // Resumo do Artigo: fio acima e abaixo; 10 px nas células + 10 px entre linhas ≈ 20 px do HTML
  estTab('LINAMetadadosFios', 'LINA Metadados Fios', { borders: bordas(C.fioForte, C.fioForte), mar: marg(px(10), 0, px(10), 0) }),
  // provisórios: Artigo e POP (Tasks 2-3) ajustam olhando o HTML
  estTab('LINAPassos', 'LINA Passos', { borders: bordas(C.umbro, C.fioForte, C.fioForte), mar: marg(px(7), 0, px(7), px(12)) }),
  estTab('LINAAtencao', 'LINA Atenção', {
    borders: bordas(), shd: `<w:shd w:val="clear" w:color="auto" w:fill="${C.nata}"/>`, mar: marg(px(16), px(20), px(16), px(20)),
  }),
].join('');

// ---------- pós-processamento do zip ----------
// document.xml: a biblioteca emite bordas e sombras diretas; o estilo manda. styles.xml: acrescenta estilos de tabela.
function pos(buf, dotx) {
  const z = unzipSync(new Uint8Array(buf));
  const doc = strFromU8(z['word/document.xml'])
    .replace(/<w:(tblBorders|tcBorders)>[\s\S]*?<\/w:\1>/g, '').replace(/<w:(tblBorders|tcBorders)\/>/g, '').replace(/<w:shd\b[^>]*\/>/g, '');
  z['word/document.xml'] = strToU8(doc);
  z['word/styles.xml'] = strToU8(strFromU8(z['word/styles.xml']).replace('</w:styles>', ESTILOS_TABELA + '</w:styles>'));
  if (dotx) {
    z['[Content_Types].xml'] = strToU8(strFromU8(z['[Content_Types].xml'])
      .replace('wordprocessingml.document.main+xml', 'wordprocessingml.template.main+xml'));
  }
  return Buffer.from(zipSync(z));
}

// ---------- ativos (logo e figura marcadora) ----------
async function ativos() {
  // o desenho do HTML tem o "A" em ferro-fundo; o arquivo de assets traz umbro e metadados C2PA
  const svg = Buffer.from(fs.readFileSync(ROOT('assets/logos/sand/lina-horizontal-ferro.svg'), 'utf8')
    .replace(/<metadata>[\s\S]*?<\/metadata>/, '').replace('#2A1A12', '#' + C.ferroFundo));
  const [, vw, vh] = svg.toString().match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number); // proporção do desenho
  const png = await sharp(svg, { density: 600 }).resize({ width: 600 }).png().toBuffer(); // reserva única, serve a qualquer largura
  const FW = Math.round(TWPX); // figura de largura total
  const mkFig = (h) => sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${FW * 3}" height="${h * 3}" viewBox="0 0 ${FW} ${h}"><rect width="${FW}" height="${h}" rx="11" fill="#${C.nata}"/><text x="${FW / 2}" y="${h / 2 + 4}" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#${mix(C.umbro, 0.6, C.nata)}">[ figura ]</text></svg>`)).png().toBuffer();
  const figs = { 300: await mkFig(300), 260: await mkFig(260) }; // Relatório 300 px, Artigo 260 px
  return {
    logo: (w) => new ImageRun({
      type: 'svg', data: svg, fallback: { type: 'png', data: png },
      transformation: { width: w, height: (w * vh) / vw }, altText: { name: 'LINA', description: 'LINA', title: 'LINA' },
    }),
    figura: (h = 300) => new ImageRun({
      type: 'png', data: figs[h], transformation: { width: FW, height: h },
      altText: { name: 'Figura', description: 'Figura marcadora', title: 'Figura' },
    }),
  };
}

// ---------- blocos ----------
const r = (text, style, br) => new TextRun({ text, ...(style && { style }), ...(br && { break: br }) });
const linhas = (ls, style) => ls.map((t, i) => r(t, style, i ? 1 : 0));
const par = (style, ...c) => new Paragraph({ style, children: c.map((x) => (typeof x === 'string' ? new TextRun(x) : x)) });
const quebra = () => par('LINAQuebra');
const cel = (w, ...ps) => new TableCell({ width: { size: w, type: DXA }, children: ps });
const tabela = (estilo, colunas, rows, extra = {}) => new Table({
  style: estilo, layout: TableLayoutType.FIXED, width: { size: TW, type: DXA }, columnWidths: colunas, rows, ...extra,
});
// Grade com respiro entre colunas: colunas de conteúdo (larg, em px; a última leva o resto) e colunas vazias de largura gap.
const grade = (estilo, larg, gap, linhasCel, extra = {}) => {
  const n = larg.length + 1, g = px(gap);
  const w = larg.map(px); w.push(TW - w.reduce((s, x) => s + x, 0) - (n - 1) * g);
  const cols = w.flatMap((x, i) => (i ? [g, x] : [x]));
  const rows = linhasCel.map((cs) => new TableRow({
    cantSplit: true,
    children: cs.flatMap((ps, i) => (i ? [cel(g, new Paragraph({})), cel(w[i], ...ps)] : [cel(w[0], ...ps)])),
  }));
  return tabela(estilo, cols, rows, extra);
};

// ---------- Relatório ----------
function relatorio(a) {
  const capa = [
    tabela('LINAMetadados', [px(150), TW - px(150)], [new TableRow({ children: [
      cel(px(150), new Paragraph({ children: [a.logo(150)] })),
      cel(TW - px(150), new Paragraph({ style: 'LINAMonoDireita', children: linhas(['LINA · UFC', 'Fortaleza, 2026']) })),
    ] })]),
    par('LINARotulo', 'Relatório institucional'),
    par('LINATitulo', 'Relatório anual de atividades 2026'),
    par('LINASubtitulo', 'Pesquisa, ensino e extensão do Laboratório de Modelagem da Informação'),
    grade('LINAMetadadosFio', [198, 198], 24, [[
      [new Paragraph({ style: 'LINAMeta', children: [r('Laboratório de Modelagem da Informação', 'LINADestaque'), r('Arte · Arquitetura · Ambiente', null, 1)] })],
      [new Paragraph({ style: 'LINAMeta', children: linhas(['Departamento de Arquitetura, Urbanismo e Design', 'Universidade Federal do Ceará']) })],
      [new Paragraph({ style: 'LINAMetaDireita', children: linhas(['REL-2026-01', 'v. 1.0']) })],
    ]]),
    quebra(),
  ];
  const nomes = (rot, ...ns) => [new Paragraph({ style: 'LINAEquipe', children: [r(rot, 'LINARotuloMeta'), ...ns.map((n) => r(n, null, 1))] })];
  const indicador = (nome) => new TableRow({ children: [
    cel(TW - 2 * px(90), par(undefined, nome)), cel(px(90), par('LINANumero', '—')), cel(px(90), par('LINANumero', '—')),
  ] });
  return [
    { page: { size: PG.size, margin: { top: px(72), bottom: px(72), left: MX, right: MX } }, children: capa },
    { type: SectionType.NEXT_PAGE, children: [par('LINASecao', '1 · Apresentação')] },
    { type: SectionType.CONTINUOUS, column: COL2, children: [
      par('LINACorpo', 'O Laboratório de Modelagem da Informação reúne pesquisadores de arquitetura, urbanismo e design em torno da informação que descreve o espaço, da escala do objeto à da paisagem. Este relatório apresenta as atividades do ano nas cinco linhas de pesquisa do grupo.'),
      par('LINACorpo', 'Cada seção descreve projetos em andamento, produção bibliográfica, orientações e parcerias. Os indicadores ao final seguem os critérios da plataforma institucional e permitem comparar o desempenho com os anos anteriores.'),
    ] },
    { type: SectionType.CONTINUOUS, children: [
      new Paragraph({ style: 'LINAFigura', children: [a.figura()] }),
      par('LINALegenda', r('Figura 1.', 'LINADestaque'), ' Legenda em Outfit 9 pt, uma linha abaixo da figura. ', r('Fonte: LINA, 2026.', 'LINAFonte')),
      par('LINASubsecao', '1.1 · Indicadores do ano'),
      tabela('LINATabela', [TW - 2 * px(90), px(90), px(90)], [
        new TableRow({ tableHeader: true, children: [
          cel(TW - 2 * px(90), par(undefined, 'Indicador')), cel(px(90), par('LINADireita', '2025')), cel(px(90), par('LINADireita', '2026')),
        ] }),
        indicador('Artigos em periódicos'),
        indicador('Orientações concluídas'),
      ], { tableLook: { firstRow: true, noHBand: true, noVBand: true } }),
      quebra(),
    ] },
    { type: SectionType.NEXT_PAGE, children: [par('LINASecao', '5 · Considerações finais')] },
    { type: SectionType.CONTINUOUS, column: COL2, children: [
      par('LINACorpo', 'Feche o documento com uma síntese do ano em dois ou três parágrafos: o que foi alcançado, o que ficou pendente e as prioridades para o próximo ciclo. Não introduza dados novos nesta seção.'),
      par('LINACorpo', 'Os anexos, quando houver, vêm antes desta página e seguem a mesma grade das páginas internas, numerados como A, B, C.'),
    ] },
    { type: SectionType.CONTINUOUS, children: [
      par('LINASubsecao', 'Equipe'),
      grade('LINAMetadadosFio', [198, 198], 24, [
        [nomes('Coordenação', 'Nome Sobrenome'), nomes('Vice-coordenação', 'Nome Sobrenome'), nomes('Pesquisadores', 'Nome Sobrenome', 'Nome Sobrenome')],
        [nomes('Pós-graduação', 'Nome Sobrenome', 'Nome Sobrenome'), nomes('Graduação', 'Nome Sobrenome', 'Nome Sobrenome'), nomes('Técnico', 'Nome Sobrenome')],
      ]),
      quebra(),
      // colofão: tabela flutuante ancorada na margem inferior (nunca caixa de texto)
      grade('LINAMetadadosFio', [110, 234], 32, [[
        [new Paragraph({ style: 'LINAColofao', children: [a.logo(110)] })],
        [new Paragraph({ style: 'LINAColofao', children: [
          r('Laboratório de Modelagem da Informação', 'LINADestaque'),
          ...['Departamento de Arquitetura, Urbanismo e Design', 'Universidade Federal do Ceará', 'Av. da Universidade, Fortaleza – CE'].map((t) => r(t, null, 1)),
        ] })],
        [new Paragraph({ style: 'LINAColofao', children: [
          r('contato@lina.ufc.br', 'LINAMonoPequeno'), r('lina.ufc.br', 'LINAMonoPequeno', 1), r('REL-2026-01 · v. 1.0 · 10/2026', 'LINAMonoPequeno', 2),
        ] })],
      ]], { float: {
        horizontalAnchor: TableAnchorType.MARGIN, verticalAnchor: TableAnchorType.MARGIN,
        relativeHorizontalPosition: RelativeHorizontalPosition.LEFT, relativeVerticalPosition: RelativeVerticalPosition.BOTTOM,
      } }),
      quebra(),
    ] },
  ];
}
MODELOS.relatorio.conteudo = relatorio;

// ---------- Artigo ----------
function artigo(a) {
  const duas = COL2;
  const C1 = SectionType.CONTINUOUS, PROX = SectionType.NEXT_PAGE;
  // 2 colunas seguidas sempre de seção contínua de 1 coluna: é ela que equilibra as colunas
  const corpo = (...ts) => ts.map((t) => par('LINACorpo', t));
  const w3 = [TW - 2 * px(110), px(110), px(110)];
  const linha = (nome) => new TableRow({ children: [cel(w3[0], par(undefined, nome)), cel(w3[1], par('LINANumero', '—')), cel(w3[2], par('LINANumero', '—'))] });
  const ref = (...c) => par('LINAReferencia', ...c);
  const doi = (d) => r(d, 'LINAMonoPequeno');
  const meta = (...c) => [new Paragraph({ style: 'LINAColofao', children: c })];
  return [
    { children: [
      par('LINARotulo', 'Artigo'),
      par('LINATitulo', 'Título do artigo em até três linhas, com subtítulo após dois-pontos se necessário'),
      par('LINAAutores', r('Nome Sobrenome', 'LINADestaque'), '¹ · ', r('Nome Sobrenome', 'LINADestaque'), '¹ · ', r('Nome Sobrenome', 'LINADestaque'), '²'),
      par('LINAAfiliacao', '¹ Universidade Federal do Ceará · ² Instituição'),
      par('LINAQuebra'),
      grade('LINAMetadadosFios', [110], 18, [
        [[par('LINAResumo', r('Resumo', 'LINADestaque'))], [par('LINAResumo', 'Resumo de até 250 palavras, em parágrafo único: objetivo, método, resultados e conclusão. O resumo ocupa a largura total e é separado do corpo por dois fios areia.')]],
        [[par('LINAResumo', r('Palavras-chave', 'LINADestaque'))], [par('LINAResumo', 'três a cinco termos; separados por ponto e vírgula')]],
      ]),
      quebra(),
    ] },
    { type: C1, column: duas, children: [
      par('LINASecao', '1 · Introdução'),
      ...corpo('O corpo do artigo corre em duas colunas de 79 mm com 8 mm de entrecoluna. Seções numeradas em Bold no mesmo corpo do texto; não há recuo de primeira linha, e os parágrafos se separam por meia linha.',
        'Citações seguem a norma da publicação. Notas vão ao pé da coluna em 9 pt. Figuras ocupam uma coluna ou a largura total e sempre trazem legenda e fonte.'),
    ] },
    { type: C1, children: [quebra()] },
    { type: PROX, column: duas, children: [
      par('LINASecao', '2 · Método'),
      ...corpo('Descreva o recorte, os dados e os procedimentos em ordem de execução. Quando o método se apoiar em ferramenta própria, nomeie a versão e o repositório em mono no próprio texto.',
        'As subseções usam numeração decimal (2.1, 2.2) em Medium, sem quebra de coluna antes delas.'),
    ] },
    { type: C1, children: [
      new Paragraph({ style: 'LINAFigura', children: [a.figura(260)] }),
      par('LINALegenda', r('Figura 2.', 'LINADestaque'), ' Figuras de largura total interrompem as duas colunas e voltam a elas logo abaixo. ', r('Fonte: LINA, 2026.', 'LINAFonte')),
    ] },
    { type: C1, column: duas, children: [
      par('LINASecao', '3 · Resultados'),
      ...corpo('Apresente os resultados na mesma ordem das perguntas da introdução. Tabelas trazem título acima e fonte abaixo; figuras, legenda abaixo.',
        'Números em tabela vão em mono, alinhados, com a mesma quantidade de casas decimais por coluna.'),
    ] },
    { type: C1, children: [
      par('LINATituloTabela', 'Tabela 1. Título da tabela acima dela, em uma linha.'),
      tabela('LINATabela', w3, [
        new TableRow({ tableHeader: true, children: [cel(w3[0], par(undefined, 'Recorte')), cel(w3[1], par('LINADireita', 'Elementos')), cel(w3[2], par('LINADireita', 'Relações'))] }),
        linha('Centro'), linha('Benfica'), linha('Aldeota'),
      ], { tableLook: { firstRow: true, noHBand: true, noVBand: true } }),
      quebra(),
    ] },
    { type: PROX, column: duas, children: [
      par('LINASecao', '5 · Conclusão'),
      ...corpo('Retome o objetivo em uma frase, responda a ele com os resultados e indique o alcance e os limites do trabalho. Termine com os próximos passos da pesquisa.'),
    ] },
    { type: C1, children: [
      par('LINASecao', 'Agradecimentos'),
      par('LINAResumo', 'Agências de fomento, número do processo e pessoas que contribuíram sem autoria.'),
      par('LINASecao', 'Referências'),
      par('LINAFio'),
      quebra(),
    ] },
    { type: C1, column: duas, children: [
      ref('BERTALANFFY, Ludwig von. ', r('Teoria geral dos sistemas', 'LINADestaque'), '. Petrópolis: Vozes, 1975.'),
      ref('SOBRENOME, Nome. Título do capítulo. ', r('In', 'LINADestaque'), ': SOBRENOME, Nome (org.). ', r('Título do livro', 'LINADestaque'), '. Cidade: Editora, ano. p. 00–00.'),
      ref('SOBRENOME, Nome; SOBRENOME, Nome. Título do artigo. ', r('Periódico', 'LINADestaque'), ', v. 0, n. 0, p. 00–00, ano. DOI: ', doi('10.0000/0000'), '.'),
      ref('VIEIRA, Jorge de Albuquerque. Organização e sistemas. ', r('Informática na educação: teoria & prática', 'LINADestaque'), ', Porto Alegre, v. 3, n. 1, 2000. DOI: ', doi('10.22456/1982-1654.6363'), '.'),
      ref('SOBRENOME, Nome. ', r('Título da tese', 'LINADestaque'), '. Tese (Doutorado em Arquitetura) — Universidade, Cidade, ano.'),
    ] },
    { type: C1, children: [
      quebra(),
      // correspondência, histórico e licença: tabela flutuante ancorada na margem inferior (nunca caixa de texto)
      grade('LINAMetadadosFio', [198, 198], 24, [[
        meta(r('Correspondência', 'LINARotuloMeta'), r('Nome Sobrenome', null, 1), r('nome@ufc.br', 'LINAMonoPequeno', 1)),
        meta(r('Histórico', 'LINARotuloMeta'), r('recebido 12/02/2026', 'LINAMonoPequeno', 1), r('aceito 30/04/2026', 'LINAMonoPequeno', 1)),
        meta(r('Licença', 'LINARotuloMeta'), r('CC BY 4.0. Permitida a reprodução com citação da fonte.', null, 1)),
      ]], { float: {
        horizontalAnchor: TableAnchorType.MARGIN, verticalAnchor: TableAnchorType.MARGIN,
        relativeHorizontalPosition: RelativeHorizontalPosition.LEFT, relativeVerticalPosition: RelativeVerticalPosition.BOTTOM,
      } }),
      quebra(),
    ] },
  ];
}
MODELOS.artigo.conteudo = artigo;

// ---------- montagem ----------
const fonte = (f) => fs.readFileSync(ROOT('assets/fonts/' + f));
const FONTES = [
  { name: F.light, data: fonte('Outfit-Light.ttf') },
  { name: F.reg, data: fonte('Outfit-Regular.ttf'), bold: fonte('Outfit-Bold.ttf') },
  { name: F.med, data: fonte('Outfit-Medium.ttf') },
  { name: F.xbold, data: fonte('Outfit-ExtraBold.ttf') },
  { name: F.mono, data: fonte('JetBrainsMono-Regular.ttf'), bold: fonte('JetBrainsMono-Bold.ttf') },
];

async function main() {
  const a = await ativos();
  fs.mkdirSync(A('out'), { recursive: true });
  for (const t of Object.values(MODELOS)) {
    const cab = (txt) => new Header({ children: [new Paragraph({ style: 'LINACabecalho', children: [a.logo(54), new TextRun({ children: [new Tab(), txt], style: 'LINAMono' })] })] });
    const rodape = () => new Footer({ children: [new Paragraph({ style: 'LINARodape', children: [new TextRun({ children: [t.rodape || 'LINA · UFC', new Tab(), PageNumber.CURRENT] })] })] });
    // conteudo() devolve as seções; a de índice t.cabSecao leva cabeçalho e rodapé, as seguintes herdam (a numeração
    // continua). Relatório: a 0 é a capa, sem eles, e conta como página 1. t.primeira: cabeçalho próprio da 1ª página.
    const sections = t.conteudo(a).map(({ children, page, ...props }, i) => ({
      properties: { page: page || pg(t), ...props, ...(t.primeira && i === t.cabSecao && { titlePage: true }) },
      children,
      ...(i === t.cabSecao && {
        headers: { default: cab(t.ref), ...(t.primeira && { first: cab(t.primeira) }) },
        footers: { default: rodape(), ...(t.primeira && { first: rodape() }) },
      }),
    }));
    const doc = new Document({
      creator: 'LINA · UFC', title: `LINA · ${t.arq}`, description: 'Modelo Word do Documento A4 (LINA Design System)',
      fonts: FONTES, hyphenation: { autoHyphenation: true },
      styles: {
        default: { document: { run: { font: F.light, size: hp(15), color: C.umbro, language: LANG } } },
        paragraphStyles: estilosP(t), characterStyles: estilosC,
      },
      sections,
    });
    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(A(`out/LINA-${t.arq}-exemplo.docx`), pos(buf, false));
    fs.writeFileSync(A(`out/LINA-${t.arq}.dotx`), pos(buf, true));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
