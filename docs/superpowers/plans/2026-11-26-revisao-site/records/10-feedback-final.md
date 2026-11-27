# 10 — Feedback: revisão final

## Texto

Revisão com `design:ux-copy`. Tom do site (direto, sem exclamação, "você"). Só linhas que mudam; o resto (introdução,
legendas, contador, avisos de validação, `Enviando…`, agradecimento, `feedback.sub`) ficou como está.

| Onde | Atual | Proposta | Motivo |
| --- | --- | --- | --- |
| Aviso de dados (`paginas/feedback.html`) | tirar dúvida sobre | tirar dúvidas sobre | plural natural |
| Aviso de dados e "indisponível" | escreva a lina.pesquisa@… | escreva para lina.pesquisa@… | regência mais comum, leitura direta |
| Botão após envio | Mandar outra | Enviar outra mensagem | mesmo verbo do botão `Enviar`; diz o que envia |
| Falha de envio (`FALHA`) | Não foi possível enviar agora. Tente de novo em instantes. | Não foi possível enviar agora. Sua mensagem continua no formulário; tente de novo em instantes. | tranquiliza: texto não se perdeu |
| Link do menu (`sistema.py`) | Apontar erro nesta página | Feedback sobre esta página | o formulário aceita 3 tipos, não só erro; casa com o nome da página |
| Frase da home (`sistema.py`) | Viu um erro ou sentiu falta de algo? Conte para a equipe. | Viu um erro, sentiu falta de algo ou tem uma sugestão? Conte para a equipe. | cobre os 3 tipos, igual à introdução |

Texto final do link do menu: Feedback sobre esta página
Frase da home: Viu um erro, sentiu falta de algo ou tem uma sugestão? [Conte para a equipe].
