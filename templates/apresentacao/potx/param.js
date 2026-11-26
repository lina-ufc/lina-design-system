// Núcleo paramétrico dos layouts: nome de layout + preenchimento viram { base, n, name, fill }.
// Puro (sem pptxgenjs): build.js registra as famílias (FAM) e os nomes antigos (ALIAS).
// Família: { faixa?: [min, max], padrao?, unidade?, campo?, numera?, n?(fill), itens?(itens, n), build(n), opts?(n) }.
const pad = (i) => String(i).padStart(2, '0');

// Sem sufixo quando a família não tem faixa ou n é o padrão.
const nomeLayout = (base, n, fam) => (fam.faixa && n !== fam.padrao ? `${base} · ${n} ${fam.unidade}` : base);

// Expande `itens` em placeholders numerados: string vira { 'Campo i': s }; objeto, { 'Chave i': v }.
function expande(itens, n, fam) {
  if (fam.itens) return fam.itens(itens, n);
  const out = {};
  itens.forEach((it, i) => {
    const o = typeof it === 'string' ? { [fam.campo]: it } : it;
    for (const [k, v] of Object.entries(o)) out[`${k} ${i + 1}`] = v;
    if (fam.numera && !('Número' in o)) out[`Número ${i + 1}`] = pad(i + 1);
  });
  return out;
}

function resolve(m, fill, FAM, ALIAS) {
  const al = ALIAS[m];
  if (al) {
    if (al.erro) throw new Error(al.erro);
    fill = al.conv ? al.conv(fill) : fill;
    m = al.para;
  }
  let base = m, fixo;
  if (!FAM[base]) { // nome já com N: '<base> · <n> <unidade>'
    const r = /^(.+) · (\d+) (.+)$/.exec(m);
    if (r && FAM[r[1]] && FAM[r[1]].unidade === r[3]) { base = r[1]; fixo = Number(r[2]); }
  }
  const fam = FAM[base];
  if (!fam) throw new Error(`layout '${m}' não existe`);
  const { itens, ...resto } = fill;
  const re = fam.campo && new RegExp(`^${fam.campo} \\d+$`); // sem itens: conta as chaves 'Campo i' do preenchimento
  const cont = re ? Object.keys(resto).filter((k) => re.test(k)).length : 0;
  const n = fixo ?? itens?.length ?? fam.n?.(fill) ?? (cont || undefined) ?? fam.padrao ?? 1;
  if (fam.faixa && (n < fam.faixa[0] || n > fam.faixa[1]))
    throw new Error(`'${base}' aceita ${fam.faixa[0]}–${fam.faixa[1]} ${fam.unidade}, recebeu ${n}`);
  return { base, n, itens, name: nomeLayout(base, n, fam), fill: itens ? { ...resto, ...expande(itens, n, fam) } : resto };
}

module.exports = { resolve, nomeLayout, pad };
