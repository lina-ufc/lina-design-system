# Molde de seção

Toda seção de um capítulo com `"molde": true` em `sistema.json` segue esta marcação. O
`sistema.py` confere: exatamente um `<p class="regra">` e `h3` só entre os quatro rótulos,
nessa ordem. Falha com `molde: <arquivo>: <motivo>`.

```html
<h2>Título</h2>
<p class="regra">Uma frase normativa.</p>          <!-- obrigatória, uma só -->
<h3>Por quê</h3> …                                  <!-- os h3 abaixo são opcionais, nesta ordem -->
<h3>Medidas</h3> …                                  <!-- dl.spec ou ul.regras -->
<h3>Faça e não faça</h3>
<div class="faca-nao"><div class="faca">…</div><div class="nao">…</div></div>
<h3>Como pedir</h3> <dl class="spec"><dt>Agente</dt><dd>…</dd><dt>Slide</dt>…<dt>Word</dt>…<dt>LaTeX</dt>…</dl>
```

Figuras de exemplo (diagramas, amostras) podem vir entre a regra e o primeiro `h3`.
Os rótulos "Faça" e "Não faça" vêm do CSS; não escrever no HTML.

## Quando usar `"livre": true`

Na entrada do `sistema.json`, para seção sem frase normativa possível: conceito, legenda de
figura ou definição que só se entende inteira. Não usar para fugir do molde: se a seção tem
uma regra, ela vira o `p.regra`. Registrar o motivo no registro da tarefa.

## Rótulos proibidos

"Não fazer", "Não recomendáveis", "a evitar" e parentes viram **Faça e não faça**.
Subtítulo fora da lista (`h3` com outro nome) falha na checagem.
