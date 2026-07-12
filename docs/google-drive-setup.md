# Configurar sincronização com Google Drive

O app usa o Google Identity Services (OAuth 2.0, client-side, sem backend) com o
escopo `drive.file` — o app só enxerga a pasta "Mind" que ele mesmo cria, nunca o
resto do seu Drive.

## 1. Criar o projeto e a tela de consentimento

1. Acesse https://console.cloud.google.com/ e crie um projeto novo (ou reuse um existente).
2. Vá em **APIs e serviços → Biblioteca**, busque **Google Drive API** e clique em **Ativar**.
3. Vá em **APIs e serviços → Tela de permissão OAuth**:
   - Tipo de usuário: **Externo** (a menos que você tenha Google Workspace).
   - Preencha nome do app ("Mind"), e-mail de suporte e e-mail de contato do desenvolvedor.
   - Em **Escopos**, não precisa adicionar nada manualmente (o app pede `drive.file` em tempo de execução).
   - Em **Usuários de teste**, adicione o seu próprio e-mail Google (enquanto o app não for
     verificado pelo Google, só usuários de teste conseguem autorizar).

## 2. Criar as credenciais OAuth

1. Vá em **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth**.
2. Tipo de aplicativo: **Aplicativo da Web**.
3. Em **Origens JavaScript autorizadas**, adicione:
   - `http://localhost:3000` (dev local)
   - a URL de produção, se/quando fizer deploy (ex: `https://seu-app.vercel.app`)
4. Não precisa preencher "URIs de redirecionamento" (o fluxo usado é o de token implícito,
   sem redirect).
5. Clique em **Criar** e copie o **Client ID** gerado (algo como
   `123456789-abc.apps.googleusercontent.com`).

## 3. Configurar no projeto

Cole o Client ID em `.env.local` (na raiz do projeto, já ignorado pelo git):

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=cole-aqui-seu-client-id.apps.googleusercontent.com
```

Reinicie o `npm run dev` depois de editar o `.env.local`.

## 4. Testar

1. Abra `/config`, seção **Google Drive**, clique em **Conectar Google Drive**.
2. Uma janela de consentimento do Google deve abrir — autorize com a conta que você
   adicionou como usuária de teste.
3. Clique em **Enviar para o Drive** — confira em drive.google.com que uma pasta
   **Mind** foi criada com os 5 arquivos (`tarefas.json`, `sessoes_timer.json`,
   `config.json`, `emblemas.json`, `reflexoes.json`).
4. Para testar a restauração, altere algo localmente, clique em **Restaurar do Drive**
   e confirme — a página recarrega com os dados que estavam no Drive.

## Limitações conhecidas

- O token de acesso fica só na memória da aba (nunca é salvo no localStorage, por
  segurança) e expira em cerca de 1 hora — nesse caso, um novo "Enviar"/"Restaurar"
  vai pedir autorização de novo.
- Não há sincronização automática silenciosa em segundo plano: como o fluxo de OAuth
  do navegador normalmente exige um gesto do usuário para abrir o popup de consentimento,
  a sincronização é sempre disparada pelos botões "Enviar"/"Restaurar" nesta versão.
