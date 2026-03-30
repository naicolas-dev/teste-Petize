# 🚀 GitHub Explorer — Teste Técnico

> [!IMPORTANT]
> **Este repositório é um Teste Técnico bem documentado.**  
> O objetivo deste projeto é demonstrar habilidades em desenvolvimento Frontend, integração com APIs, arquitetura de componentes, internacionalização e refinamento de UI/UX. Não se trata de um produto comercial final.

Uma aplicação de busca de usuários do GitHub sofisticada e altamente funcional, construída com **React**, **Chakra UI** e a **GitHub REST API**.

A aplicação apresenta uma estética "Soft UI", fortemente inspirada nas linguagens de design da Apple, Notion e na própria interface do GitHub. Foi construída focando em performance, acessibilidade e uma experiência de usuário premium.

---

## 🌟 Principais Funcionalidades

### 🖥️ Design & UI
- **Modern "Soft UI"**: Interface limpa e refinada usando cantos arredondados, sombras sutis e uma paleta de cores harmoniosa.
- **Modo de Cor Adaptativo**: Suporte completo para temas Claro, Escuro e Sincronizado com o Sistema.
- **Implementação Anti-Flash**: O tema do sistema é detectado no nível mais baixo para evitar o "flash branco" durante o carregamento da página quando o modo escuro está ativo.
- **Layout Responsivo**: Experiência fluida em dispositivos móveis, tablets e desktop.
- **Micro-interações**: Elevações ao passar o mouse (hover), animações suaves de clique (scale) e efeitos de cabeçalho com glassmorfismo.

### 🔍 Exploração
- **Busca Instantânea**: Encontre qualquer usuário do GitHub e navegue pelo seu perfil público completo.
- **Repositórios Detalhados**: Visualize metadados dos repositórios, incluindo estrelas, forks e linguagens de programação.
- **Ordenação Avançada**: Ordene repositórios por "Última Atualização", "Data de Criação", "Data de Push" ou "Nome Completo" (A-Z/Z-A).
- **Carregamento Infinito**: Navegação suave pelos repositórios com paginação.

### 🌐 Localização (i18n)
- **Suporte Multi-idioma**: Totalmente traduzido para **Português (BR)** e **Inglês (US)**.
- **Toggle Dinâmico**: Troque de idioma instantaneamente através de um menu de configurações dedicado.

---

## 🛠️ Stack Tecnológica

- **Core**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **UI Framework**: [Chakra UI](https://chakra-ui.com/)
- **Lógica & Validação**: [Zod](https://zod.dev/) (Modelagem estrita de respostas da API)
- **Internacionalização**: [i18next](https://www.i18next.com/)
- **Ícones**: [React Icons](https://react-icons.github.io/react-icons/) & [Chakra Icons](https://chakra-ui.com/docs/components/icon)
- **API**: [GitHub REST API v3](https://docs.github.com/en/rest)

---

## 🚀 Como Começar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (LTS recomendado)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/naicolas-dev/teste-Petize.git
   cd teste-Petize
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configuração de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto:
   ```bash
   touch .env
   ```
   Adicione seu Token do GitHub (opcional, mas altamente recomendado):
   ```env
   VITE_GITHUB_TOKEN=seu_personal_access_token_aqui
   ```
   > **Nota**: Fornecer um token aumenta o limite de requisições da API de 60 para 5.000 requisições por hora.

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

---

## 📂 Estrutura do Projeto

- `src/components/`: Componentes de UI reutilizáveis (RepoCard, UserCard, SearchBar, etc).
- `src/pages/`: Visões principais da aplicação (HomePage, ProfilePage).
- `src/services/`: Integração com API e lógica de fetch.
- `src/schemas/`: Modelos Zod para validação de dados e segurança de tipos.
- `src/i18n/`: Arquivos de tradução e configuração de localização.
- `src/main.jsx`: Tema global, provedores e ponto de entrada.

---

## 🎨 Filosofia de Design

Este projeto evita o "preto absoluto" (#000) e o "branco absoluto" (#FFF) para reduzir a fadiga ocular. Utiliza os tokens de cores **Primer** do próprio GitHub para um visual familiar e profissional, enquanto aprimora os componentes com feedback tátil estilo **Apple** e elevações de cards estilo **Notion**.

---

Desenvolvido por **Nicolas Viana Alves**
