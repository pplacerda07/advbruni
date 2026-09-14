# Site — Advocacia Trabalhista (Bruno)

Site estático de uma página. Sem build, sem dependências: é só abrir o `index.html`.

```
index.html     estrutura e textos
styles.css     design (paleta, layout, responsivo)
script.js      menu mobile, carrossel, formulário, animações
assets/img/    onde entram as fotos
```

Para rodar com servidor local (recomendado, evita bloqueios de arquivo local):

```bash
npx -y serve -l 4178 .
```

---

## 1. Trocar os placeholders de imagem

Cada área pontilhada é um bloco assim:

```html
<div class="slot slot-portrait" data-slot="hero-retrato">
  <div class="slot-info">...</div>
</div>
```

Para preencher, **troque o conteúdo interno por uma `<img>`** (mantenha o `div.slot` e suas classes):

```html
<div class="slot slot-portrait" data-slot="hero-retrato">
  <img src="assets/img/hero-retrato.png" alt="Bruno [Sobrenome], advogado trabalhista">
</div>
```

O contorno pontilhado some sozinho quando há imagem dentro.

| `data-slot` | Onde aparece | Tamanho sugerido | Situação |
|---|---|---|---|
| `hero-retrato` | Centro do bloco escuro do topo | 1000 × 1300 | ✅ `public/bruno-retrato-vertical.jpg` |
| `sobre-retrato` | Seção "O advogado" | 1200 × 800 | ✅ `public/bruno-escritorio-horizontal.jpg` |
| `atuacao-01` … `atuacao-08` | Cards do carrossel | 800 × 600 | ⬜ 8 imagens, corte horizontal |

**Sobre o retrato do hero:** a foto tem a mesma proporção da moldura, então o `cover` não cortaria nada e o Bruno ficaria pequeno. Por isso há um `transform: scale(1.25)` no desktop (aproxima o enquadramento) e um degradê sobre a foto, que funde a base no cartão escuro. No celular a moldura vira 4:3 e o `object-position: center 22%` mantém o rosto no quadro. Se trocar a foto, revise esses três valores em `styles.css` (seção "RETRATO DO HERO").

Todas as imagens usam `object-fit: cover`, então o enquadramento se ajusta sozinho.
Sempre preencha o `alt` com uma descrição real (acessibilidade e SEO).

---

## 2. Preencher os dados entre colchetes

Procure por `[` no `index.html` — todos os campos a confirmar estão marcados assim:

- `Bruno [Sobrenome completo]` — nome profissional exato
- `OAB/MS [número]` — Seccional e número de inscrição (aparece no topo, na faixa, no perfil e no rodapé)
- `[Cidade/UF]` — comarca / região de atendimento
- `[Graduação — Instituição, ano]` e `[Curso — Instituição, ano]`
- `[(67) 0000-0000]`, `[contato@exemplo.adv.br]`, `[Rua, nº — Bairro, Cidade/UF]`, `[Segunda a sexta, 9h às 18h]`
- `[MÊS/ANO]` nos artigos da tabela de conteúdos
- Links de **Política de privacidade** e **Política de cookies** no rodapé (hoje apontam para `#`)

O `<title>` e a `<meta name="description">` também precisam do nome real.

---

## 3. WhatsApp

Todo CTA do site abre uma conversa no WhatsApp com a mensagem já escrita, sempre começando por **"Olá! Vim pelo site."** Cada botão acrescenta o contexto dele — os cards de atuação, por exemplo, mandam o assunto junto.

O formulário não tem backend: ele monta a mensagem (perfil, nome, assunto, resumo) e abre a conversa preenchida. Isso mantém o site 100% estático, e nenhum dado fica armazenado aqui — o que também simplifica a LGPD.

**Para trocar o número**, ele aparece em dois lugares:
1. `script.js` — constante `WA_NUMERO` (é quem monta a mensagem)
2. `index.html` — nos `href="https://wa.me/..."`, que funcionam caso o JS não carregue. Busque e substitua `5511945837302`.

> ⚠️ O número informado (**+55 11 94583-7302**) é DDD 11, de São Paulo, mas a cidade de atendimento é Campo Grande/MS (DDD 67). Se for um celular pessoal de outro estado, tudo certo — só confirme que é esse mesmo.

**O que foi removido do formulário** para deixá-lo enxuto (estão no histórico, dá pra voltar): e-mail, telefone, cidade, "empresa e cargo", "outra parte envolvida" (verificação de conflito) e a caixa de consentimento. A verificação de conflito agora acontece na conversa — vale combinar com o Bruno que é a primeira pergunta dele.

---

## 4. Decisões de conteúdo já tomadas (e por quê)

O layout segue a referência visual enviada, mas três elementos daquele modelo foram substituídos por serem incompatíveis com o **Provimento nº 205/2021** e o Código de Ética da OAB:

| Elemento da referência | O que foi colocado no lugar |
|---|---|
| Faixa "10+ anos · 95% de sucesso · 250+ casos" | Faixa de identificação: OAB, comarca, modalidade de atendimento, frentes de atuação |
| Card de avaliações "4,9 ★ · 2k reviews" | Card de identificação profissional (nome, inscrição, atuação) |
| Tabela "Some of my legal works" com casos | Tabela de **conteúdos/artigos** (título, categoria, público, data) |

Também foram evitados: promessa de resultado, menção a honorários ou gratuidade, comparação com outros profissionais, depoimentos e exposição de casos.

Os avisos obrigatórios estão em três pontos: abaixo dos botões do topo, acima do botão de envio do formulário e no rodapé.

---

## 5. Antes de publicar

- [ ] Revisão do texto final pelo advogado responsável
- [ ] Nome e número da OAB conferidos em todas as ocorrências
- [ ] Fotos reais no lugar dos 11 placeholders
- [ ] Formulário conectado e testado
- [ ] Políticas de privacidade e de cookies publicadas e linkadas
- [ ] HTTPS ativo e antispam configurado
- [ ] Teste em celular, tablet e desktop
- [ ] Dados estruturados (`Organization` / `LocalBusiness`) com informações verdadeiras
- [ ] Google Search Console e sitemap
