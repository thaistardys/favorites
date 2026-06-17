# 📌 Projeto Favoritos

Uma aplicação web simples, limpa e funcional para gerenciar e armazenar seus links e sites favoritos diretamente no navegador. O projeto foi desenvolvido seguindo o conceito **Mobile-First**, garantindo uma experiência fluida tanto em dispositivos móveis quanto em computadores.

▶️ **[Clique aqui para acessar o projeto em execução](https://thaistardys.github.io/favorites/)**

---

## 🎨 Paleta de Cores & Design
O layout foi projetado com uma estética minimalista e código limpo, utilizando a seguinte paleta de cores institucional:
*   **Fundo Geral:** `#FFFFFF` (Branco)
*   **Texto Principal:** `#000000` (Preto)
*   **Seções/Containers:** `#DCDCDC` (Cinza Claro)
*   **Botões de Ação:** `#18995D` (Verde)
*   **Detalhes e Elementos de Destaque:** `#D2A494` (Tom Pastel / Rosé)

---

## ✨ Funcionalidades

*   📱 **Abordagem Mobile-First:** Design totalmente responsivo que se adapta cirurgicamente desde telas pequenas de smartphones até monitores UltraWide.
*   🔗 **Logos Automatizadas:** Ao inserir um link comum, o sistema busca e renderiza o logotipo (favicon) oficial do site automaticamente através de uma API estável.
*   🖼️ **Suporte a Imagens Customizadas:** O campo de imagem aceita links tradicionais e imagens copiadas diretamente da internet (incluindo formatos codificados como *Data URL/Base64*).
*   💡 **Acesso Inteligente:** O botão tradicional de acessar foi removido para limpar o visual; a própria logo do card tornou-se um link clicável com efeito visual de zoom (*hover*).
*   ✏️ **Gerenciamento Completo (CRUD Local):** Permite adicionar, editar os dados de cards existentes e excluir favoritos.
*   💾 **Persistência com LocalStorage:** Seus favoritos ficam salvos de forma segura no navegador. Você pode atualizar a página ou fechar o navegador sem perder nenhum dado.
*   🛡️ **Modais Customizados:** Pop-ups nativos e elegantes integrados à identidade visual do projeto para edição de dados e confirmação segura de exclusão, evitando cliques acidentais.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído puramente com tecnologias web nativas, sem a necessidade de frameworks complexos, focando em boas práticas de estruturação:

*   **HTML5:** Estruturação semântica e acessível.
*   **CSS3:** Estilização baseada em variáveis nativas (`:root`), Flexbox e Media Queries dinâmicas.
*   **JavaScript (ES6):** Manipulação avançada do DOM, escopo assíncrono e gerenciamento de estado local.

---

## 📂 Estrutura de Arquivos

O código é modularizado e livre de redundâncias, organizado da seguinte forma:
```text
├── index.html      # Estrutura principal da página e modais
├── style.css       # Estilizações gerais e regras de responsividade
├── script.js       # Lógica de negócio, validações e persistência
└── README.md       # Documentação do projeto
```

---

## 🚀 Como executar o projeto localmente

Se você deseja rodar ou estudar este projeto na sua máquina local:

1. Faça o clone deste repositório:
   ```bash
   git clone https://github.com
   ```
2. Navegue até a pasta do projeto:
   ```bash
   cd NOME-DO-REPOSITORIO
   ```
3. Abra o arquivo `index.html` em qualquer navegador ou utilize a extensão **Live Server** no seu VS Code.

---

<p>Desenvolvido com 💚 por <a href="https://github.com">thaistardys</a></p>
