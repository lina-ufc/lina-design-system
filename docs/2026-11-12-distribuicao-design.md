# Distribuição do sistema de design LINA — documento de design

Data: 12/11/2026 · Responsável: Eugênio Moreira (coordenação do LINA)

## 1. Intenção

O sistema de design do LINA (logotipo, cores, padrões, animação, tipografia) existe hoje como uma pasta no Google
Drive compartilhado: tokens CSS, cartões HTML em `guidelines/`, SVGs de logos e texturas, motores JS e dois
templates HTML. Ele funciona para quem programa e para um agente que já tenha a pasta aberta, mas não para a pessoa
que mais precisa dele: o aluno ou pesquisador do lab que vai fazer um relatório, um seminário ou um pôster.

O objetivo é transformar a pasta em algo compartilhável, em três formas que saem da mesma fonte:

1. **Brand book** — um site público que ensina a marca e distribui o kit.
2. **Template kit** — arquivos prontos, abertos no programa que cada pessoa já usa.
3. **Agent skill** — uma habilidade que permite a um agente (Claude) produzir peças novas do LINA a partir do
   conteúdo do aluno.

## 2. Público

- **Principal:** alunos e pesquisadores do LINA fazendo relatórios de pesquisa, slides de seminário e pôsteres de
  congresso.
- **Secundário:** qualquer visitante do site (parceiros, outros laboratórios) que queira entender a marca ou usar o
  logotipo corretamente.

## 3. Metas, não-metas, anti-metas

**Metas**
- Um aluno novo, a partir do site, chega ao template certo em poucos cliques e produz uma peça correta sem ler o
  manual inteiro.
- Os templates abrem e se comportam bem no PowerPoint, Word, LibreOffice e na suíte ArtCraft (DeckCraft, WordCraft,
  VectorCraft).
- Um aluno entrega a um agente texto, imagens e logos de parceiros e recebe a peça pronta, dentro das regras.
- Uma única fonte de verdade: tokens, logos e texturas desta pasta alimentam site, templates e skill; nada é copiado à
  mão entre eles.

**Não-metas**
- O repositório `lina-ufc/lina-visual-code` fica fora: é um teste que ainda não segue o sistema.
- Não se cria MCP novo para os programas ArtCraft (ver §7).
- Não se redesenha a identidade. As regras do `readme.md` são a fonte; este projeto as distribui e completa as
  partes que faltam (§5.4).

**Anti-metas (falhas, mesmo que tecnicamente tudo funcione)**
- Peça com aparência de template genérico com as cores do LINA por cima.
- Pontilhado usado como enfeite em toda parte, em vez de nos lugares de identidade (capas, banners, aberturas de
  seção).
- A skill reescrever ou resumir o texto do aluno sem pedido. Ela diagrama, não edita.
- Imagens distorcidas, mal recortadas ou em resolução insuficiente para A0.
- Logos de parceiros maiores ou mais vistosos que o do LINA.
- Pôster com texto demais resolvido diminuindo a fonte, em vez de avisar o autor.
- A Neometric (licenciada) exposta publicamente.

## 4. Restrições

- **Fonte licenciada.** A Neometric só pode ser distribuída ao pessoal do lab. O site público não a serve; usa uma
  fonte substituta livre. O download da Neometric fica numa pasta do Drive restrita ao domínio da UFC, e o site
  apenas aponta para ela. Todos os templates e a skill avisam: instale a Neometric antes; sem ela, o arquivo cai na
  substituta definida.
- **Fonte substituta.** Uma fonte livre (OFL) de geometria próxima à Neometric, usada no site público e como fallback
  nos templates. Candidatas: Outfit, Poppins. Escolha final do construtor, comparando lado a lado com a Neometric.
- **Programas.** Formatos abertos e padrão: `.potx`, `.dotx`, SVG, PDF. Nada pode depender de recurso exclusivo do
  ArtCraft. O ArtCraft é a oficina de produção e verificação, não requisito do usuário.
- **Língua.** Textos públicos em português do Brasil; código e identificadores em inglês (regra já existente no
  `SKILL.md`).
- **Local.** A fonte vive nesta pasta do Drive compartilhado, que hoje não é repositório git (ver §6.1).

## 5. Partes

### 5.1 Fonte única (esta pasta)

Organizar a pasta para ser a origem de tudo.

- **Componentes ausentes.** O `github.md` registra 29 componentes e 2 UI kits que não estão aqui (o manifesto
  `_ds_manifest.json` tem `components: []`). Verificar com o responsável se existem em outro lugar; se não,
  registrar no `github.md` que foram descartados. Os templates não dependem deles.
- **Exportações para quem não programa.** Logos (`assets/logos/sand/`) e texturas (`assets/textures/sand/`)
  exportados também em PNG (fundo transparente, em pelo menos dois tamanhos) e PDF vetorial. Conversão via
  VectorCraft (`vectorcraft-cli run`) ou PhotoCraft (`photocraft-cli convert`).
- **Versionamento.** Ver §6.1.
- **Registro de mudanças.** Um `CHANGELOG.md` curto, com data e versão, que o site exibe.

### 5.2 Template kit

Três templates, cada um com um arquivo de exemplo preenchido e o arquivo vazio.

**Relatório de pesquisa — `.dotx`, A4**
- Capa com textura do pontilhado, folha de rosto, sumário automático, referências.
- Estilos nomeados com os tokens: títulos (hierarquia do `tokens/typography.css`), texto, legenda de figura,
  tabela, citação, código (JetBrains Mono).
- Cores do tema = paleta principal + auxiliar; apenas pares de contraste permitidos pelo `readme.md`.
- Ponto de partida visual: `templates/documento-a4/DocumentoA4.dc.html` e `Aplicações PDF A4.html`.

**Slides de seminário — `.potx` 16:9 e deck HTML**
- `.potx`: 32 layouts (capa e variação para vários autores, sumário, seção, texto, colunas, ícones, imagens, gráficos, tabela, conclusões,
  encerramento etc.). Estado aprovado em 12/11/2026, registrado em `templates/apresentacao/README.md`: margens
  de 72 px (ref. 1920 × 1080), faixa do rótulo 72–108, área modular 132–972 com 12 colunas de 126 e 6 linhas de
  120 (calha 24), rodapé a partir de 996, fundo branco. Afirmação, Destaque e Ferramentas foram removidos.
- Fonte única: `templates/apresentacao/potx/build.js` gera o `.potx`, o `-exemplo.pptx` e o deck HTML com o
  mesmo conteúdo.
- **Deck HTML:** derivado de `~/My Drive/_UNIPG/presentation01` (Python + Jinja + reveal.js, conteúdo em
  `presentation.yaml`, build em `build.py`, export PDF). Trocar o sistema da UniPG pelo do LINA e remapear os tipos
  de slide para os layouts do `.potx` (mesmos nomes, mesmo conjunto). O pontilhado animado
  (`<lina-dither-field>`) aparece na capa e nas aberturas de seção. Serve aos dois caminhos: o aluno edita o YAML e
  roda o build, ou pede a um agente que preencha o YAML a partir do texto dele.
- O `.potx` não tem animação; a capa usa a textura estática.

**Pôster de congresso — A0 retrato (841 × 1189 mm)**
- Produzido no VectorCraft (MCP já conectado). Entregue como SVG, PDF de impressão e `.vctemplate`.
- Grade de colunas, faixa de título com o pontilhado, área de autores e afiliações, faixa de rodapé com logos dos
  parceiros, área para QR code.
- Tamanhos mínimos de texto legíveis a 1–2 m; o construtor define os valores e os registra no manual.

**Verificação de todos os templates:** abrir no PowerPoint/Word, LibreOffice e DeckCraft/WordCraft/VectorCraft, com
e sem a Neometric instalada. Registrar o resultado.

### 5.3 Agent skill

Substitui o `SKILL.md` atual (hoje só remete ao README).

- **Entrada do aluno:** texto (colado, `.docx` ou Markdown), imagens, logos dos parceiros, e o tipo de peça.
- **Saída:** slides (`.pptx` ou deck HTML), relatório (`.docx`) ou pôster (SVG + PDF).
- **Comportamento:**
  - Parte sempre dos templates do kit; não desenha do zero.
  - Escolhe o layout de cada slide ou bloco pelo conteúdo.
  - Aplica as regras do manual: paleta e pares de contraste, cantos de ¼, pontilhado como padrão principal,
    sem ícones e sem emoji, convenções tipográficas do português (vírgula decimal, ¼ ½, × com espaços, ponto médio,
    caixa alta só em etiquetas).
  - Desenha formas com `assets/lina-geometry.js`, não à mão.
  - Não altera o texto do aluno sem pedido.
  - Logos de parceiros numa faixa própria, todos na mesma altura, em uma cor quando houver versão monocromática,
    nunca maiores que o LINA.
- **Revisão antes de entregar:** texto estourando a área, contraste, tamanho mínimo de fonte (especialmente A0),
  área de proteção dos logos, resolução das imagens. Problema que não se resolve sem cortar conteúdo é relatado ao
  aluno, não escondido.
- **Pacotes (mesmo conteúdo, duas embalagens):**
  - **Claude Code:** plugin com a skill, templates, ativos e scripts; pôster via VectorCraft quando disponível.
  - **claude.ai:** zip da skill; sem VectorCraft, o pôster sai em SVG + PDF gerados diretamente.
- **Fontes:** a skill não carrega a Neometric; usa a do sistema se instalada, senão a substituta.

### 5.4 Partes novas do manual

Escritas pelo construtor como rascunho, revisadas pelo responsável. Cada uma vira cartão em `guidelines/`, seção do
`readme.md` e página do site.

- **Voz e tom** — como o LINA escreve: títulos, chamadas, legendas, textos de pôster.
- **Imagens e fotografia** — recorte, proporção, tratamento de cor, sobreposição de texto, resolução mínima por
  formato.
- **Usos incorretos do logotipo** — distorcer, recolorir fora da paleta, contorno, sombra, rotacionar, aplicar sobre
  fundo sem contraste, recompor as letras.
- **Assinatura com parceiros** — logo LINA + IAUD/UFC + parceiros: ordem, altura comum, espaçamento, versão
  monocromática.

### 5.5 Site (brand book)

- **Público e aberto.** Hospedado no GitHub Pages, num repositório novo (não o `lina-visual-code`). Atualizar o site
  é publicar um commit.
- **Página inicial "Tarefa primeiro"** (escolhida em mockup): pergunta "O que você vai fazer?" com três portas.
  - **Slides** — baixar `.potx` ou deck HTML.
  - **Relatório** — baixar `.dotx`.
  - **Com o Claude** — baixar a skill e instruções de instalação para Claude Code e claude.ai.
  - Pôster entra como quarta porta ou junto a Slides, a critério do construtor.
  - Logo abaixo, entrada para o manual: logo, cores, padrões, animação, tipografia, e as partes novas.
- **Manual:** os cartões de `guidelines/` viram páginas; o conteúdo vem desta pasta, não é reescrito à mão.
- **Downloads:** logos e texturas em SVG/PNG/PDF, templates, skill, changelog.
- **Fontes:** o site usa a substituta; link para a pasta restrita da Neometric com o aviso de que é só para o lab.
- O pontilhado animado aparece na página inicial, respeitando `prefers-reduced-motion`.

## 6. Decisões e quem as tomou

| Decisão | Por quem |
| --- | --- |
| Três formatos: brand book, template kit, skill | Responsável |
| Público principal: alunos e pesquisadores; peças: relatório, seminário, pôster | Responsável |
| Ferramentas do usuário: PowerPoint, Word, deck HTML; cada um usa o programa que já tem | Responsável |
| Deck HTML a partir do `presentation01`, editável à mão e por agente | Responsável |
| Site aberto; Neometric só para o lab | Responsável |
| Home "Tarefa primeiro" | Responsável (mockup B) |
| Pôster A0 retrato, para congressos, feito no VectorCraft | Responsável |
| Partes novas do manual entram neste projeto | Responsável |
| Documento em `docs/` | Responsável |
| Formatos `.potx`/`.dotx`/SVG/PDF para compatibilidade geral | Construtor (proposto, não contestado) |
| GitHub Pages em repositório novo | Construtor (proposto, não contestado) |
| Neometric em pasta do Drive restrita ao domínio UFC | Construtor (proposto, não contestado) |
| Sem MCP novo para ArtCraft; `.potx`/`.dotx` gerados por script, conferidos nos apps | Construtor |
| Anti-metas da §3 | Construtor (proposto; responsável não objetou) |
| Faixa de parceiros em altura comum, monocromática quando possível | Construtor (proposto, não contestado) |
| Dois pacotes da skill (plugin e zip) | Construtor (proposto, não contestado) |

### 6.1 Versionamento

A pasta está no Drive compartilhado e não é repositório git. O site exige um repositório. Opção recomendada: o
repositório novo é a fonte; a pasta do Drive recebe uma cópia de distribuição (sem `.git`) a cada versão, para quem
chega pelo Drive. Git dentro de pasta sincronizada pelo Drive é evitado (corrompe o `.git`).

## 7. Ferramentas

- **VectorCraft:** MCP `vectorcraft` (já conectado) e `vectorcraft-cli run` para lotes. Pôster e exportações.
- **DeckCraft / WordCraft:** sem MCP; abrem com `--control PORT` (servidor de controle local). Usados só para
  conferir os arquivos.
- **PhotoCraft:** `photocraft-cli convert` para PNG/JPG das texturas.
- **Skills úteis:** `anthropic-skills:pptx`, `anthropic-skills:docx`, `anthropic-skills:pdf` (templates);
  `anthropic-skills:skill-creator` e `superpowers:writing-skills` (skill e testes de acionamento);
  `frontend-design` ou `design-taste-frontend` (site); `humanizer` (revisão dos textos novos do manual).

## 8. Ordem

0. **Urgente (12/11/2026):** `.potx` 16:9 dos slides de seminário (§5.2), para uso do responsável no mesmo dia.
   Antecipado por decisão do responsável; não depende das questões abertas de fonte, repositório e licença.
1. Fonte única (§5.1) e partes novas do manual (§5.4).
2. Restante do template kit (§5.2).
3. Skill (§5.3), que usa os templates.
4. Site (§5.5), que distribui tudo.

Decisão do construtor: os `.potx`/`.dotx` nomeiam a Neometric no tema. Office não tem cadeia de fallback; sem a
fonte, o programa cai na padrão dele. Público principal é o lab, que terá a fonte.

## 9. Respostas do responsável (12/11/2026)

1. **Neometric fora do git.** Repositório público sem os OTFs; `assets/fonts/` no `.gitignore`. Pré-visualização e
   build locais leem a fonte da pasta restrita do Drive.
2. **O repositório manda.** O Drive passa a ser cópia de distribuição; edições se fazem no repositório.
3. **A licença permite embutir a fonte** em PDF, `.pptx` e `.docx`. Arquivos públicos podem sair com a Neometric
   embutida. Webfont no site público continua fora (servir os arquivos expõe a fonte).
4. **Pôster:** template `.vctemplate` para VectorCraft e um PDF. Quem usa outro programa abre o PDF. Sem `.pptx` A0.
5. **Logos institucionais fixos** (os que aparecem em toda peça): o responsável garante os arquivos corretos e revisa
   os primeiros produtos. Logos de parceiros variáveis seguem a regra da §5.3.
6. **GitHub:** organização `lina-ufc` (plano gratuito, responsável é admin). Repositório público novo
   `lina-ufc/lina-design-system`, endereço `https://lina-ufc.github.io/lina-design-system/`.
7. **Arquivos pesados** (fontes, templates, pacotes da skill, exportações PNG/PDF) ficam no Google Drive; o site
   entrega os links e explica como usar. O repositório guarda só o que é leve e gerado.

## 10. Deixado ao construtor

- Escolha da fonte substituta.
- Tamanhos mínimos de texto do pôster e resolução mínima de imagem por formato.
- ~~Lista final de layouts do `.potx`~~: fechada em 32 (ver §5.2).
- Gerador do site (HTML estático simples ou gerador leve), desde que leia esta pasta.
- Onde o pôster aparece na home.
- Estrutura interna da skill (referências, scripts).
