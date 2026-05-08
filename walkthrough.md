# Gozmacerasi Project Setup Walkthrough

The project has been successfully set up on this machine. All dependencies are installed, Docker services are running, and the database is initialized with test data.

## Accomplishments
- [x] Cloned the repository into `d:\gozmacerasi`.
- [x] Configured environment variables ([.env](file:///d:/gozmacerasi/packages/backend/.env) files) for Backend and Web.
- [x] Installed all npm dependencies using workspaces.
- [x] Started infrastructure services via Docker (PostgreSQL, Redis, Adminer).
- [x] Initialized the database with migrations and sample data.
- [x] Verified that the application starts correctly.

## How to Run the Project

To start the entire project (Frontend + Backend), run the following command in the root directory:
```bash
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Database UI (Adminer)**: http://localhost:8080 (Server: `postgres`, User: `postgres`, Password: `postgres_password`, Database: `gozmacerasi`)

## Seed Credentials
You can use the following credentials to log in to the application. All users have the password: `Test1234!`

| User Type | Email | Description |
| :--- | :--- | :--- |
| Admin | `admin@gozmacerasi.dev` | Full system access |
| Doctor | `dr.yilmaz@gozmacerasi.dev` | Prescription and child tracking |
| Parent | `parent.aksoy@gozmacerasi.dev` | Child management and progress |

Detailed credentials and child profiles are available in [SEED_CREDENTIALS.txt](file:///d:/gozmacerasi/packages/backend/SEED_CREDENTIALS.txt).

## Maintenance Commands
- **Stop Services**: `docker-compose down`
- **Rebuild Database**: `npm run db:reset`
- **View Logs**: `docker-compose logs -f`
