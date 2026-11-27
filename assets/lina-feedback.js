/*
  Lógica do formulário de feedback do site: validação, corpo do POST, página de origem e envio
  ao Apps Script (feedback/apps-script.gs, fonte de TIPOS, LIMITES e regras). Cada uso exige:
    TIPOS, LIMITES, valida, corpo, paginaDe   nada (dados e texto; URLSearchParams).
    envia                                     fetch (ou o `buscar` injetado), só no navegador.
  liga: ligação ao formulário #fb da página feedback.html; só roda com DOM (o arquivo carrega em Node sem ele).
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

  const AVISOS = {
    tipo: 'Escolha o tipo da mensagem.',
    mensagem: 'Escreva uma mensagem de até ' + LIMITES.mensagem + ' caracteres.',
    nome: 'Informe seu nome (até ' + LIMITES.nome + ' caracteres).',
    email: 'Informe um e-mail válido.',
    pagina: 'A página deve ter até ' + LIMITES.pagina + ' caracteres.',
  };
  const FALHA = 'Não foi possível enviar agora. Tente de novo em instantes.';

  // `form`: #fb; `url`: Apps Script ('' = indisponível, nada é enviado).
  function liga(form, url) {
    const d = form.ownerDocument;
    const ok = d.getElementById('fb-ok');
    const status = d.getElementById('fb-status');
    const botao = form.querySelector('button[type=submit]');
    const msg = form.elements.mensagem;
    const contador = d.getElementById('fb-contador');
    if (!url) {
      form.hidden = true;
      d.getElementById('fb-indisponivel').hidden = false;
      return;
    }
    const conta = () => { contador.textContent = msg.value.length + ' de ' + LIMITES.mensagem + ' caracteres'; };
    const dados = () => {
      const c = { tipo: (form.querySelector('[name=tipo]:checked') || {}).value };
      for (const k of ['pagina', 'mensagem', 'nome', 'email']) c[k] = form.elements[k].value;
      return c;
    };
    // O campo de `tipo` é o grupo de rádios; o foco vai ao primeiro.
    const campo = (k) => form.querySelector('[name=' + k + ']');
    const limpa = () => form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    const recusa = (k) => {
      const el = campo(k);
      form.querySelectorAll('[name=' + k + ']').forEach((r) => r.setAttribute('aria-invalid', 'true'));
      status.textContent = AVISOS[k];
      el.focus();
    };

    form.elements.pagina.value = paginaDe(root.location.search);
    conta();
    msg.addEventListener('input', conta);
    form.addEventListener('input', limpa);

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (botao.disabled) return;
      limpa();
      status.textContent = '';
      const c = dados();
      const erro = valida(c);
      if (erro) return recusa(erro);
      botao.disabled = true;
      botao.textContent = 'Enviando…';
      const r = await envia(url, corpo(c, form.elements.site.value));
      botao.disabled = false;
      botao.textContent = 'Enviar';
      if (r.ok) {
        form.hidden = true;
        ok.hidden = false;
        ok.focus();
      } else if (Object.hasOwn(AVISOS, r.erro)) {
        recusa(r.erro);
      } else {
        status.textContent = FALHA;
      }
    });

    d.getElementById('fb-outra').addEventListener('click', () => {
      msg.value = '';
      conta();
      status.textContent = '';
      ok.hidden = true;
      form.hidden = false;
      msg.focus();
    });
  }

  root.LinaFeedback = { TIPOS, LIMITES, valida, corpo, paginaDe, envia, liga };
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof document !== 'undefined' && document.getElementById('fb')) {
  const f = document.getElementById('fb');
  window.LinaFeedback.liga(f, f.closest('section').dataset.url);
}
