# Operação Código de Ouro - Hackathon Frontend

## 🎨 Sistema de Tema Claro/Escuro

Este projeto agora inclui um sistema completo de tema claro/escuro que se adapta automaticamente a todo o conteúdo da aplicação.

### ✨ Funcionalidades do Tema

- **Tema Escuro (Padrão)**: Cores escuras com destaque amarelo dourado
- **Tema Claro**: Cores claras com destaque amarelo
- **Alternância Automática**: Botão de toggle no header (lado direito da logo)
- **Persistência**: O tema escolhido é salvo no localStorage
- **Transições Suaves**: Animações de 300ms entre mudanças de tema

### 🎯 Localização do Botão de Tema

O botão de alternância de tema está localizado no **header superior direito**, ao lado da logo, com os seguintes ícones:
- 🌙 **Lua**: Para alternar para tema escuro (quando no tema claro)
- ☀️ **Sol**: Para alternar para tema claro (quando no tema escuro)

### 🎨 Paleta de Cores

#### Tema Escuro
- **Fundo Principal**: #000000 (preto)
- **Fundo Secundário**: #1a1a1a (cinza escuro)
- **Fundo Terciário**: #333333 (cinza médio)
- **Texto Principal**: #ffffff (branco)
- **Cor de Destaque**: #ebdb2f (amarelo dourado)

#### Tema Claro
- **Fundo Principal**: #ffffff (branco puro)
- **Fundo Secundário**: #f1f3f4 (cinza claro)
- **Fundo Tertiário**: #e8eaed (cinza médio)
- **Texto Principal**: #000000 (preto)
- **Cor de Destaque**: #ffc107 (amarelo)

### 🎯 Estrutura de Cores por Área

#### Tema Claro
- **Background Geral**: Branco puro (#ffffff)
- **Header Completo**: Cinza claro (#f1f3f4) - inclui logo, usuário, botão de tema e navegação
- **Área de Chat**: Cinza claro (#f1f3f4)
- **Área de Input**: Cinza médio (#e8eaed)
- **Campo de Digitação**: Cinza médio (#e8eaed)
- **Botões e Elementos Interativos**: Cinza claro (#f1f3f4)
- **Tooltips**: Cinza claro (#f1f3f4)

### 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Acessar no navegador
# http://localhost:5173
```

### 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **MobX** para gerenciamento de estado
- **Context API** para gerenciamento de tema


### 🔧 Implementação Técnica

O sistema de tema utiliza:
- **CSS Variables** para definição de cores
- **React Context** para gerenciamento de estado global
- **localStorage** para persistência da preferência do usuário
- **Transições CSS** para animações suaves
- **TypeScript** para tipagem segura

### 🎭 Componentes com Tema

Todos os componentes principais foram atualizados para usar as variáveis CSS:
- **Header Component**: Componente separado com CSS próprio e fundo cinza
- Botões de navegação integrados ao header
- Área de chat
- Input de mensagem
- Botões de anexo e voz
- Modal de email
- Tooltips e elementos interativos

### 🆕 Novo Componente Header

O header foi refatorado como um componente separado (`Header.tsx`) com as seguintes características:
- **CSS próprio** (`Header.css`) para melhor organização
- **Fundo cinza** separado do background branco
- **Estrutura organizada** com logo, usuário, tema e navegação
- **Responsivo** com media queries para diferentes tamanhos de tela
- **Transições suaves** entre temas
- **Bordas separadoras** para melhor definição visual

### 🌟 Recursos Adicionais

- **Responsivo**: Funciona em todos os tamanhos de tela
- **Acessível**: Inclui labels e aria-labels apropriados
- **Performance**: Transições otimizadas e re-renders mínimos
- **Compatibilidade**: Funciona em todos os navegadores modernos
