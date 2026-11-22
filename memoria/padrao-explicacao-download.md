---
name: padrao-explicacao-download
description: Explicação antes, Baixar no fim; download na seção do assunto; cap. 8 uma seção por template (Estrutura, Exemplo, Uso, Baixar); títulos simples; sem etiquetas de estado
type: regra
---

Decisão do usuário (2026-11-22), modelo na página do Logotipo:

- Ordem em toda seção com arquivo: explicação primeiro, bloco "Baixar" no fim
  (`<h2 class="h" style="font-size:18px;margin:26px 0 6px">Baixar</h2>` + `.dl`, CSS em `site.css`).
- Cada download fica na seção do seu assunto: logos e institucionais em 1.8, paleta `.ase` em 2.8,
  fontes em 5.5, ícones em 6.5. Quem depende de outro arquivo aponta para a seção dele
  (ex.: a apresentação manda às fontes em 5.5 e aos ícones em 6.5), não repete o download.
- Cap. 8 = uma seção por template, título simples, sem frase de efeito: 8.1 Apresentação,
  8.2 Documentos A4, 8.3 Pôster e banner, 8.4 Redes sociais. Dentro de cada uma, subtítulos
  Estrutura (como o layout é construído, ligação com a marca), Exemplo (o arquivo no quadro, via
  `<!--quadro caminho LxA-->` no fragmento; sem miniatura por página), Uso e Baixar (com os
  downloads complementares por referência cruzada). Template por fazer: seção curta "Ainda não feito".
- Word (.dotx) e LaTeX saem do Documento A4 e entram na 8.2.
- Títulos e textos diretos; passar pelo `humanizer` (pedido 2026-11-22).
- Sem etiquetas de estado (rascunho/revisar/aprovado) no site nem no `sistema.json`: o que está
  publicado vale, mesmo que seja revisado depois (2026-11-22).
