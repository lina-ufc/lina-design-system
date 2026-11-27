/*
  Base comum das ferramentas do site: esquema de parâmetros, hash da URL, linha de comando
  equivalente, download e cópia. Carregar depois de lina-palette, lina-texture e lina-image.
  Funções de navegador só tocam o DOM quando chamadas.
*/
(function (root) {
  'use strict';

  const GRAIN = root.LinaTexture.DEFAULTS.grain;
  const num = (padrao, min = 0, max = 1) => ({ tipo: 'num', min, max, padrao });
  const int = (padrao, min, max) => ({ tipo: 'int', min, max, padrao });
  const str = (padrao, valores) => ({ tipo: 'str', valores, padrao });
  const bool = (padrao) => ({ tipo: 'bool', padrao });
  const cores = (min, max) => ({ tipo: 'cores', min, max, padrao: ['creme', 'ferro'] });

  // Faixas e padrões do fromParams e do DEFAULTS de cada motor (frações 0–1).
  const ESQUEMAS = {
    textura: {
      mode: str('field', ['dither', 'scatter', 'field']),
      seed: int(1, 0, 999999),
      width: int(1080, 1, 8000),
      height: int(1080, 1, 8000),
      cells: int(36, 4, 120),
      colors: cores(2, 3),
      blank: num(0.5), steps: num(0.5), quarter: num(0.3), clump: num(0.6),
      grain: num(GRAIN, 1, 20),
      stretch: num(0), accent: num(0.15),
      edges: str('bleed', ['bleed', 'seamless', 'cut']),
      pinholes: bool(true),
    },
    imagem: {
      mode: str('dither', ['dither', 'bitmap']),
      detail: num(0.46), // 84 células: 20 + 0,46 × 140
      dither: str('diffusion', ['none', 'ordered', 'diffusion']),
      brightness: num(0.5), contrast: num(0.5),
      midtones: num(0.675), // DEFAULTS.midtones 0,35 em -1..1
      cutoff: num(0.08), smooth: num(0.3),
      invert: bool(false),
      colors: cores(2, 2),
      width: int(1080, 1, 8000),
    },
  };

  const copia = (v) => (Array.isArray(v) ? v.slice() : v);
  const igual = (a, b) => String(a) === String(b);

  // Devolve o valor lido ou lança Error com o motivo.
  function ler(e, bruto) {
    if (e.tipo === 'bool') {
      if (bruto === 'true' || bruto === '1') return true;
      if (bruto === 'false' || bruto === '0') return false;
      throw new Error('use true ou false');
    }
    if (e.tipo === 'str') {
      if (!e.valores.includes(bruto)) throw new Error(`use um de ${e.valores.join(', ')}`);
      return bruto;
    }
    if (e.tipo === 'cores') {
      const lista = bruto.split(',');
      if (lista.length < e.min || lista.length > e.max) throw new Error(`use ${e.min === e.max ? e.min : `${e.min} ou ${e.max}`} cores`);
      const r = root.LinaPalette.check(lista);
      if (!r.ok) throw new Error(r.reason);
      return lista;
    }
    const n = Number(bruto);
    if (bruto.trim() === '' || !Number.isFinite(n)) throw new Error('precisa de número');
    if (e.tipo === 'int' && !Number.isInteger(n)) throw new Error('precisa de inteiro');
    if (n < e.min || n > e.max) throw new Error(`fora da faixa ${e.min} a ${e.max}`);
    return n;
  }

  // Params completos (padrão onde o hash falta ou não vale) e um aviso por valor descartado.
  function lerHash(hash, esquema) {
    const params = {}, avisos = [];
    for (const [k, e] of Object.entries(esquema)) params[k] = copia(e.padrao);
    const q = new URLSearchParams(String(hash).replace(/^#/, ''));
    for (const [k, bruto] of q) {
      if (!Object.hasOwn(esquema, k)) continue;
      try { params[k] = ler(esquema[k], bruto); }
      catch (err) { avisos.push(`${k}: ${err.message}; ficou o padrão.`); }
    }
    return { params, avisos };
  }

  function escreverHash(params, esquema) {
    const q = new URLSearchParams();
    for (const [k, e] of Object.entries(esquema))
      if (params[k] !== undefined && !igual(params[k], e.padrao)) q.set(k, String(params[k]));
    return q.toString().replace(/%2C/g, ',');
  }

  // Linha equivalente: só o que difere do padrão, mais mode e colors sempre.
  function comando(qual, params, foto = 'foto.jpg') {
    const esquema = ESQUEMAS[qual];
    const args = [];
    for (const [k, e] of Object.entries(esquema)) {
      const v = params[k];
      if (v === undefined) continue;
      if (k !== 'mode' && k !== 'colors' && igual(v, e.padrao)) continue;
      args.push(e.tipo === 'bool' ? (v ? `--${k}` : `--no-${k}`) : `--${k} ${v}`);
    }
    return ['node', `ferramentas/${qual}.mjs`, ...(qual === 'imagem' ? [foto] : []), ...args,
      '--out', `${qual}.svg`].join(' ');
  }

  function baixar(nome, svg) {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function copiar(texto, status) {
    const ok = () => { status.textContent = 'Copiado.'; };
    const falha = () => { status.textContent = 'Não foi possível copiar; selecione o texto e copie.'; };
    if (!navigator.clipboard) return falha();
    navigator.clipboard.writeText(texto).then(ok, falha);
  }

  root.LinaFerramenta = { ESQUEMAS, lerHash, escreverHash, comando, baixar, copiar };
})(typeof window !== 'undefined' ? window : globalThis);
