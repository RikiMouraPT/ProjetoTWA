# Leavely

Leavely é uma aplicação de gestão interna de utilizadores e férias para empresas. O projeto permite gerir utilizadores, departamentos e pedidos de férias através de funcionalidades CRUD (Create, Read, Update, Delete).

---

## Funcionalidades

### 1. Users (Utilizadores)

* **Criar:** Adicionar novos funcionários ou administradores.
* **Ler/Listar:** Visualizar todos os utilizadores com detalhes (nome, email, departamento, cargo).
* **Atualizar:** Editar informações de utilizadores existentes.
* **Apagar:** Remover ou desativar utilizadores.

### 2. Vacations (Férias)

* **Criar:** Submeter novos pedidos de férias.
* **Ler/Listar:** Visualizar pedidos próprios ou de outros funcionários (dependendo do perfil).
* **Atualizar:** Alterar pedidos pendentes (datas ou tipo de férias).
* **Apagar:** Cancelar pedidos de férias pendentes.

### 3. Departments (Departamentos)

* **Criar:** Adicionar novos departamentos.
* **Ler/Listar:** Visualizar todos os departamentos e seus gestores.
* **Atualizar:** Modificar nome ou gestor do departamento.
* **Apagar:** Remover departamentos (geralmente apenas se não tiverem utilizadores).

### 4. LeaveType (Tipos de Férias)

* **Criar:** Adicionar novos tipos de férias (anual, compensatória, doença, etc.).
* **Ler/Listar:** Visualizar todos os tipos disponíveis.
* **Atualizar:** Modificar nome, descrição ou regras de cada tipo.
* **Apagar:** Remover tipos de férias (normalmente apenas se não houver pedidos associados).

---

## Tecnologias Utilizadas

* **Node.js** – Ambiente de execução do JavaScript no servidor.
* **Express.js** – Framework para construção de APIs e servidores HTTP.
* **MariaDB** – Base de dados para armazenamento dos dados.
* **Git & GitHub** – Controle de versão e gestão do repositório.

---

## Estrutura do Projeto

```
/leavelyNodeJS
├── index.js
├── package.json
├── routes/
│   ├── users.js
│   ├── vacations.js
│   ├── departments.js
│   └── leaveTypes.js
├── controllers/
├── middlewares/
├── migrations/
└── README.md 
```
---

## Licença

[MIT](LICENSE)
