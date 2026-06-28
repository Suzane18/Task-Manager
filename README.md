# ✅ Task Manager

> A full-stack task management system for organizing work, assigning responsibilities, tracking progress, and generating reports for teams and individuals.

## 📖 Project Overview

### Problem Statement
Teams often struggle with scattered task tracking, inconsistent status updates, and poor visibility into assignment progress. Manual workflows make it difficult to manage deadlines and accountability.

### Motivation
This project was built to provide a simple yet powerful task management platform where users can create tasks, assign them to team members, update progress, and review performance from a unified dashboard.

### Solution
The application combines a React-based frontend, an Express backend, and a MongoDB database to provide role-based task management, dashboards, and report exports.

### Key Objectives
- Enable users to register and log in securely
- Allow admins to create and manage tasks for team members
- Support task progress tracking with checklist-based subtasks
- Provide dashboards and Excel report exports for visibility

## ✨ Features

- 🔐 User authentication and authorization with JWT
- 👤 Profile management and profile image upload
- 📝 Create, edit, delete, and assign tasks
- ✅ Update task status and todo checklist progress
- 📊 Admin and user dashboards with task summaries
- 📁 Attachments support for task-related files
- 📈 Report export for tasks and user workloads to Excel
- 🛡️ Role-based access for admins and regular members

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React | UI development |
| Vite | Fast frontend build tooling |
| React Router DOM | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Framer Motion | UI animations |
| Recharts | Charts and dashboard visuals |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | Runtime environment |
| Express.js | REST API development |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| multer | File upload handling |
| CORS | Cross-origin resource sharing |

### Database

| Technology | Purpose |
| --- | --- |
| MongoDB | NoSQL document database |
| Mongoose | MongoDB object modeling |

### Tools & Libraries

| Tool | Purpose |
| --- | --- |
| dotenv | Environment variable management |
| ExcelJS | Excel report generation |
| nodemon | Auto-restart during backend development |

## 🏗️ System Architecture

The system follows a three-tier architecture:

1. **Frontend**: React + Vite renders the user interface and handles navigation.
2. **Backend**: Express API handles authentication, task logic, reporting, and file uploads.
3. **Database**: MongoDB stores users, tasks, reports metadata, and user profile information.

### Workflow
- Users register or log in.
- JWT tokens are issued for accessing protected routes.
- Admins can create and assign tasks to users.
- Assigned users update task status and checklist progress.
- Reports can be exported for task and workload analysis.

## 📂 Folder Structure

```text
Task-Manager/
├─ backend/
│  ├─ config/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  ├─ uploads/
│  ├─ package.json
│  └─ server.js
├─ frontend/
│  └─ Task_Manager/
│     ├─ public/
│     ├─ src/
│     │  ├─ components/
│     │  ├─ context/
│     │  ├─ hooks/
│     │  ├─ pages/
│     │  ├─ routes/
│     │  ├─ utils/
│     │  ├─ App.jsx
│     │  └─ main.jsx
│     ├─ package.json
│     └─ vite.config.js
└─ README.md
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/Suzane18/Task-Manager.git
cd Task-Manager
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Frontend setup

```bash
cd ../frontend/Task_Manager
npm install
```

## ▶️ Running the Project

### Start the backend

```bash
cd backend
npm run dev
```

### Start the frontend

```bash
cd frontend/Task_Manager
npm run dev
```

The frontend will run at `http://localhost:5173` and the backend at `http://localhost:5000`.

### Build for production

```bash
cd frontend/Task_Manager
npm run build
```

## 🔌 API Overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login and receive JWT |
| `/api/auth/profile` | GET / PUT | View or update current user profile |
| `/api/tasks` | GET / POST | Retrieve or create tasks |
| `/api/tasks/:id` | GET / PUT / DELETE | View, update, or delete a task |
| `/api/tasks/:id/status` | PUT | Update task status |
| `/api/tasks/:id/todo` | PUT | Update checklist progress |
| `/api/users` | GET | Retrieve user records |
| `/api/reports/export/tasks` | GET | Export tasks report as Excel |
| `/api/reports/export/users` | GET | Export user workload report as Excel |

## 🗄️ Database Schema

### User
- Stores `name`, `email`, `password`, `role`, `profileImageUrl`
- Roles: `admin` or `member`

### Task
- Stores `title`, `description`, `priority`, `status`, `dueDate`, `assignedTo`, `createdBy`, `attachments`, `todoChecklist`, `progress`
- Supports assignment to one or more users

### Relationships
- A task can be assigned to multiple users
- A task is created by one user
- Each user can have multiple tasks and profile data

## 🔒 Security Features

- Passwords are hashed with `bcryptjs`
- JWT-based authentication for protected routes
- Role-based access control for admins and members
- Protected API routes through middleware
- Environment-based configuration for secrets

## 🧪 Testing

### Manual Testing
- Register and log in as different users
- Create and assign tasks
- Update task status and checklist items
- Export reports from the admin dashboard

### Recommended Future Testing
- Unit tests for controllers and utility logic
- Integration tests for API routes
- UI testing for authentication and dashboard flows

## 🌐 Deployment

### Recommended deployment flow
1. Deploy the backend to a Node.js hosting service such as Render, Railway, or Vercel serverless-compatible environment.
2. Deploy the frontend to Vercel or Netlify.
3. Configure environment variables for production.
4. Connect MongoDB Atlas for persistent storage.
5. Update the frontend `CLIENT_URL` and backend CORS settings accordingly.

## 🔮 Future Enhancements

- [ ] Add email notifications for task deadlines and updates
- [ ] Implement drag-and-drop task boards
- [ ] Add calendar-based scheduling
- [ ] Introduce dark mode
- [ ] Add advanced analytics and charts for productivity
- [ ] Add real-time collaboration with WebSockets

