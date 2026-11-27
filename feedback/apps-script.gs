// Recebe o formulário de feedback do site LINA e grava na planilha que contém este script.
// Publicar como app da web: executar como o dono, acesso a qualquer pessoa.

var TIPOS = ['Erro', 'Falta algo', 'Sugestão'];
var LIMITES = { mensagem: 2000, nome: 120, email: 254, pagina: 200 };
var TETO_EMAIL = 20;   // a partir daqui grava sem avisar por e-mail
var TETO_GRAVA = 200;  // a partir daqui descarta
var AVISA = true;
var CABECALHO = ['Data', 'Tipo', 'Página', 'Mensagem', 'Nome', 'E-mail', 'Situação'];

// Corta espaços; texto que viraria fórmula na planilha ganha ' na frente.
function limpa(texto) {
  var t = String(texto == null ? '' : texto).trim();
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}

function valida(p, agora) {
  var cru = function (k) { return String(p[k] == null ? '' : p[k]).trim(); };
  var tipo = cru('tipo'), mensagem = cru('mensagem'), nome = cru('nome'), email = cru('email'), pagina = cru('pagina');
  if (TIPOS.indexOf(tipo) < 0) return { ok: false, erro: 'tipo' };
  if (!mensagem || mensagem.length > LIMITES.mensagem) return { ok: false, erro: 'mensagem' };
  if (!nome || nome.length > LIMITES.nome) return { ok: false, erro: 'nome' };
  if (email.length > LIMITES.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, erro: 'email' };
  if (pagina.length > LIMITES.pagina) return { ok: false, erro: 'pagina' };
  return { ok: true, linha: [agora, tipo, limpa(pagina), limpa(mensagem), limpa(nome), limpa(email), 'nova'] };
}

function decide(p, contagem) {
  if (p.site || contagem >= TETO_GRAVA) return 'descarta';
  return contagem >= TETO_EMAIL ? 'grava-sem-email' : 'grava';
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = null;
  try {
    var p = (e && e.parameter) || {};
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    var props = PropertiesService.getScriptProperties();
    var chave = 'envios-' + Utilities.formatDate(new Date(), 'America/Fortaleza', 'yyyy-MM-dd');
    var contagem = Number(props.getProperty(chave)) || 0;
    var acao = decide(p, contagem);
    if (acao === 'descarta') return resposta({ ok: true });
    var r = valida(p, new Date());
    if (!r.ok) return resposta({ ok: false, erro: r.erro });
    var aba = SpreadsheetApp.getActive().getSheets()[0];
    if (aba.getLastRow() === 0) aba.appendRow(CABECALHO);
    aba.appendRow(r.linha);
    props.setProperty(chave, String(contagem + 1));
    if (acao === 'grava' && AVISA) {
      try {
        MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Feedback do site · ' + r.linha[1],
          'Tipo: ' + r.linha[1] + '\nPágina: ' + r.linha[2] + '\n\n' + r.linha[3]);
      } catch (_) { /* e-mail falhou; a linha já está gravada */ }
    }
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: 'interno' });
  } finally {
    if (lock) lock.releaseLock();
  }
}
