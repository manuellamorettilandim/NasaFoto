# NASA APOD Finder

Este é um projeto simples para buscar a Imagem Astronômica do Dia (APOD) da NASA com base em uma data fornecida pelo usuário, utilizando um backend construído em Python (FastAPI) e um frontend moderno em HTML, CSS e JavaScript.

## Estrutura do Projeto
- `backend/`: Código da API em FastAPI e configuração do ambiente.
- `frontend/`: Arquivos estáticos (HTML, CSS e JS) da interface do usuário.

## Configuração Inicial

### 1. Desbloquear a execução de scripts no PowerShell (Apenas se necessário)
Se você receber um erro ao tentar ativar o ambiente virtual informando que "a execução de scripts foi desabilitada", execute o comando abaixo no PowerShell como Administrador ou no seu terminal de usuário:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Configurar a Chave de API da NASA
Na pasta `backend`, abra o arquivo `.env` e adicione a sua chave de API da NASA (você pode conseguir uma em https://api.nasa.gov/).
```env
NASA_API_KEY=sua_chave_aqui
```
> **Nota:** Para testes temporários, nós inserimos o valor `DEMO_KEY` no arquivo. Isso funcionará para um número limitado de acessos.

---

## Como Rodar o Projeto

Para visualizar a aplicação, você precisará abrir **dois** terminais no VS Code: um para rodar o backend (API) e outro para hospedar o frontend.

### Terminal 1: Rodando o Backend (API)
Abra um terminal, navegue até a pasta `backend` e execute os seguintes comandos:

**1. Ativar o Ambiente Virtual:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

**2. Iniciar o servidor FastAPI:**
```powershell
uvicorn main:app --port 8000
```
O backend agora deve estar rodando em `http://127.0.0.1:8000`.

### Terminal 2: Rodando o Frontend
No VS Code, abra um novo terminal (clique no ícone de `+` ou divida o terminal existente), navegue até a pasta `frontend` e inicie um servidor HTTP simples:

```powershell
cd frontend
python -m http.server 8080
```

### 3. Acessar a Aplicação
Com os dois servidores rodando, abra o seu navegador e acesse:
[http://localhost:8080](http://localhost:8080)

Selecione uma data e aproveite as imagens da NASA!
