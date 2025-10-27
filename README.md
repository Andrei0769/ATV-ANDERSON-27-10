# Portal Harmonia

Sistema web moderno para gestão de produtos com autenticação e controle de acesso.

## 📋 Sobre o Projeto

O Portal Harmonia é uma aplicação web desenvolvida com JavaScript moderno, focada em oferecer uma experiência fluida e acessível para gestão de produtos. O sistema inclui autenticação de usuários, controle de acesso baseado em perfis e um CRUD completo de produtos.

### ✨ Características Principais

- **Design Responsivo**: Interface adaptativa para diferentes dispositivos
- **Acessibilidade**: Suporte a navegação por teclado e leitores de tela
- **Segurança**: Sistema de autenticação com proteção contra tentativas múltiplas
- **UX/UI**: Feedback visual através de toasts e loaders
- **Modular**: Código organizado em módulos independentes

## 🚀 Funcionalidades

### Autenticação
- Login com usuário e senha
- Opção "Lembrar-me" para persistência de sessão
- Bloqueio após 5 tentativas falhas (5 minutos)
- Logout com invalidação de sessão

### Cadastro de Usuários
- Validação de força de senha (mínimo 8 caracteres, 1 maiúscula, 1 número)
- Verificação de e-mail/usuário duplicado
- Seleção de perfil (operacional/administrador)

### Gestão de Produtos
- Listagem com busca dinâmica
- Criação de novos produtos
- Edição de produtos existentes
- Remoção (requer perfil administrador)
- Validações de campos (preço não negativo, estoque >= 0)

## 🛠️ Tecnologias

- HTML5 + CSS3 + JavaScript (ES6+)
- LocalStorage/SessionStorage para persistência
- Sistema de módulos ES6
- Jest + Testing Library para testes

## 📦 Estrutura do Projeto

\`\`\`
portal-harmonia/
├── index.html
├── style.css
├── js/
│   ├── utils.js     # Utilitários e helpers
│   ├── auth.js      # Autenticação e sessão
│   ├── products.js  # Lógica de produtos
│   ├── router.js    # Roteamento SPA
│   └── views/       # Componentes visuais
├── tests/
│   ├── setup.js
│   ├── auth.test.js
│   ├── register.test.js
│   └── products.test.js
└── README.md
\`\`\`

## 🚦 Começando

1. Clone o repositório
2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`
3. Execute os testes:
   \`\`\`bash
   npm test
   \`\`\`
4. Abra o arquivo index.html em um servidor web local

## 👥 Usuários Padrão

- **Administrador**:
  - Usuário: admin
  - Senha: 1234

- **Operacional**:
  - Usuário: oper
  - Senha: 1234

## 🧪 Testes

O projeto possui uma extensa suíte de testes automatizados cobrindo:

- Cadastro de usuários
- Login/Logout
- CRUD de produtos
- Validações de campos
- Controle de acesso
- Acessibilidade

Para executar os testes com relatório de cobertura:
\`\`\`bash
npm run test:coverage
\`\`\`

## 🌟 Boas Práticas

- **Acessibilidade**: ARIA labels, navegação por teclado, contraste adequado
- **Segurança**: Validações client-side, proteção contra ataques básicos
- **UX**: Feedback visual, mensagens claras, estados de carregamento
- **Código**: Modularização, documentação, testes automatizados

## 🔒 Controle de Acesso

### Perfil Administrador
- Acesso total ao sistema
- Pode excluir produtos

### Perfil Operacional
- Visualização e edição de produtos
- Sem permissão para exclusão

## 🎯 Melhorias Futuras

- [ ] Implementar backend real
- [ ] Adicionar autenticação via OAuth
- [ ] Expandir validações de segurança
- [ ] Implementar upload de imagens
- [ ] Adicionar mais opções de filtros
- [ ] Desenvolver sistema de logs

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🐛 Bugs Conhecidos

- O tempo de bloqueio após tentativas falhas pode variar alguns segundos
- A busca de produtos atualiza apenas ao perder o foco
- Algumas validações client-side podem ser contornadas via console

## 📫 Contato

Para questões e sugestões, por favor abra uma issue no repositório do projeto.
