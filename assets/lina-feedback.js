/*
  Lógica do formulário de feedback do site: validação, corpo do POST, página de origem e envio
  ao Apps Script (feedback/apps-script.gs, fonte de TIPOS, LIMITES e regras). Cada uso exige:
    TIPOS, LIMITES, valida, corpo, paginaDe   nada (dados e texto; URLSearchParams).
    envia                                     fetch (ou o `buscar` injetado), só no navegador.
  Sem DOM aqui; a ligação ao formulário fica na página.
*/
(function (root) {
  'use strict';

  // Iguais aos do Apps Script (um teste confere).
  const TIPOS = ['Erro', 'Falta algo', 'Sugestão'];
  const LIMITES = { mensagem: 2000, nome: 120, email: 254, pagina: 200 };

  const cru = (c, k) => String(c[k] == null ? '' : c[k]).trim();

  // null se válido; senão o nome do primeiro campo recusado, na ordem do script.
  function valida(c) {
    if (TIPOS.indexOf(cru(c, 'tipo')) < 0) return 'tipo';
    const m = cru(c, 'mensagem');
    if (!m || m.length > LIMITES.mensagem) return 'mensagem';
    const n = cru(c, 'nome');
    if (!n || n.length > LIMITES.nome) return 'nome';
    const e = cru(c, 'email');
    if (e.length > LIMITES.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'email';
    if (cru(c, 'pagina').length > LIMITES.pagina) return 'pagina';
    return null;
  }

  // `isca`: valor do campo escondido `site` (robô preenche; o script descarta).
  function corpo(c, isca) {
    const b = new URLSearchParams();
    for (const k of ['tipo', 'pagina', 'mensagem', 'nome', 'email']) b.set(k, cru(c, k));
    b.set('site', String(isca == null ? '' : isca).trim());
    return b;
  }

  // Valor de ?pagina= só com o nome do arquivo; vazio se faltar ou passar do limite.
  function paginaDe(search) {
    let v = new URLSearchParams(search).get('pagina') || '';
    v = v.split('#')[0];
    v = v.slice(v.lastIndexOf('/') + 1).trim();
    return v.length > LIMITES.pagina ? '' : v;
  }

  // POST simples (sem cabeçalhos, evita preflight CORS). Nunca rejeita.
  async function envia(url, b, buscar = fetch) {
    try {
      const r = await buscar(url, { method: 'POST', body: b });
      if (!r.ok) return { ok: false, erro: 'rede' };
      const j = await r.json();
      return j && j.ok === true ? { ok: true } : { ok: false, erro: (j && j.erro) || 'rede' };
    } catch (_) {
      return { ok: false, erro: 'rede' };
    }
  }

  root.LinaFeedback = { TIPOS, LIMITES, valida, corpo, paginaDe, envia };
})(typeof window !== 'undefined' ? window : globalThis);
