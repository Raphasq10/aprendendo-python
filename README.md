# ⚔️ PyQuest: As Crônicas dos Dados

**PyQuest** é um RPG web pedagógico gamificado projetado para ensinar programação em Python e fundamentos de ciência de dados do zero à maestria, conduzindo o aluno (de crianças a adultos) através dos desafios cotidianos do Vilarejo de Valedados com progressão de patentes de Júnior (níveis 1 a 50 no MVP), Pleno a Sênior, unindo a psicologia de aprendizado de Raph Koster (*A Theory of Fun for Game Design*) a livros de referência consagrados.

---

## 🚀 Como Rodar Localmente

Siga os passos simples abaixo para rodar o projeto na sua máquina:

1. **Clone ou abra a pasta do projeto:**
   ```bash
   cd c:\xampp\htdocs\python-aula
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento do Frontend:**
   ```bash
   npm run dev
   ```
   Abra no seu navegador o endereço indicado (geralmente `http://localhost:5173`).

4. **(Opcional) Inicie a API Backend com MySQL:**
   - Inicie o **MySQL** e **Apache** no painel do **XAMPP Control Panel**.
   - No terminal, acesse a pasta `server`:
     ```bash
     cd server
     npm install
     npm run dev
     ```
   - O backend rodará em `http://localhost:3001`.

---

## 🛠️ Stack Técnica

- **Frontend:** React 18 + Vite (TypeScript)
- **Estilização & UI:** Tailwind CSS + shadcn/ui (Paleta oficial: *Jet Black*, *Teal*, *Pale Sky*, *Lavender*, *White*)
- **Terminal & Editor:** xterm.js (sensação de CLI nativa) + Monaco Editor
- **Motor Python:** Pyodide WebAssembly (Python 3.12 real no navegador)
- **Backend:** Node.js + Express
- **Banco de Dados:** MySQL 8 / MariaDB (via XAMPP / phpMyAdmin, porta 3306)
- **Autenticação:** JWT + bcryptjs

---

## 📚 Documentação do Projeto

- 📋 [Documento de Requisitos do Produto (PRD.md)](./PRD.md)
- 🛠️ [Arquitetura de Software e Justificativas Técnicas (TECH_STACK.md)](./TECH_STACK.md)
- 🗄️ [Schema Relacional do MySQL (database_schema_mysql.sql)](./database_schema_mysql.sql)
