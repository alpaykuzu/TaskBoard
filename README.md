```markdown
# 📋 TaskBoard: Full Stack Kanban Task Management App 

TaskBoard is a clean, modular, and production-ready full-stack Kanban board application built
 using ASP.NET Core 7.0 (with Clean Architecture principles) and a React + TypeScript + Vite frontend.

---

## ✨ Features 

- 🔐 JWT-based Authentication (ASP.NET Identity)
- 🗂️ Task and Board CRUD operations
- ⚙️ Clean Architecture: Domain, Application, Infrastructure, Presentation
- 🧠 Repository Pattern and Dependency Injection
- 💬 RESTful API
- 📂 SQLite for development (easily replaceable)
- ⚛️ Modern frontend with React 18, TypeScript, Vite, Tailwind CSS
- 🌐 CORS configured for localhost development

---

## 🧱 Tech Stack

| Layer         | Technology                                  |
|---------------|----------------------------------------------|
| Frontend      | React 18, TypeScript, Vite, Tailwind         |
| Backend API   | ASP.NET Core 7, Entity Framework Core        |
| Authentication| ASP.NET Identity, JWT Bearer Tokens          |
| DB            | SQLite (Local)                               |
| Architecture  | Clean Architecture + SOLID Principles        |
| Dev Tools     | EF Core CLI, Postman, Vite Dev Server        |

---

## 🗂️ Project Structure


TaskBoard-main/
├── TaskBoard.API/           # ASP.NET Core API (Presentation)
├── TaskBoard.Application/   # Application layer (UseCases, DTOs)
├── TaskBoard.Domain/        # Domain entities and contracts
├── TaskBoard.Infrastructure/# EF Core DB Context, Repositories
├── client-app/              # React + TypeScript frontend
└── TaskBoard.sln            # Solution file

````

---

## 🚀 Getting Started

### 🪰 Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- SQLite or any EF Core compatible DB

---

## 🔧 Backend Setup

1. Navigate to the API project:

```bash
cd TaskBoard.API
````

2. Run EF Core migrations (optional if `TaskBoard.db` exists):

```bash
dotnet ef database update
```

3. Run the backend API:

```bash
dotnet run
```

API runs at: `https://localhost:5001` or `http://localhost:5000`

---

## 🌐 Frontend Setup

1. Navigate to client app:

```bash
cd client-app
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 🔐 Authentication

* ASP.NET Identity handles user registration and login.
* JWT Tokens are issued at login and used for protected API endpoints.
* Default CORS allows calls from `http://localhost:5173`.

---

## 🧰 Testing (Planned)

* Backend unit/integration testing can be added via xUnit.
* Frontend testing can use Jest + React Testing Library.

---

## 📝 Future Improvements

* ✅ Drag & Drop task reordering
* ✅ Role-based authorization
* 🗕️ Due dates, task priority, tags
* 🔔 Real-time updates with SignalR
* 📱 Responsive mobile layout
* 🌐 Deployment with Docker & CI/CD

---

## 🧠 Clean Architecture Summary

* **Domain:** Entities and base interfaces
* **Application:** Business logic, Use Cases, DTOs
* **Infrastructure:** EF Core DB, Repository implementations
* **API:** Entry point, controllers, configuration

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* [Microsoft Docs - ASP.NET Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)
* [EF Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
* [Vite + React](https://vitejs.dev/guide/)

```
```
