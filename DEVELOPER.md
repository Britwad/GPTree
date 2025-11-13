# GPTree – Developer Documentation

This document provides comprehensive guidelines for developers contributing to **GPTree**, a web-based learning platform that transforms AI-powered conversations into structured learning trees. It details setup, architecture, testing, deployment, and collaboration practices.

---

## **Table of Contents**

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Building and Running the Software](#building-and-running-the-software)
5. [Testing](#testing)
6. [Adding New Tests](#adding-new-tests)
7. [Building a Production Release](#building-a-production-release)
8. [Code Style Guidelines](#code-style-guidelines)
9. [Contributing](#contributing)

---

## **1. Getting Started**

### **Prerequisites**

* **Node.js:** 20.x LTS
* **npm:** 10.x
* **PostgreSQL:** 14 or newer
* **Vercel account** for deployment
* **Git** for version control

### **Obtaining the Source Code**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Britwad/GPTree.git
   cd GPTree
   ```

2. **Install Dependencies**

   ```bash
   npm install
   npx generate prisma
   ```

3. **Set Up Environment Variables**

   * Copy the provided `.env.example` and `.env.test.example` files:

     ```bash
     cp .env.example .env
     cp .env.test.example .env.test
     ```
   * Fill in values for database and API keys:

     ```bash
     DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gptree"
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="your_secret"
     GROQ_API_KEY="your_groq_api_key"
     ```

4. **Generate Prisma Client and Apply Migrations**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run Development Server**

   ```bash
   npm run dev
   ```

   Access at [http://localhost:3000](http://localhost:3000)

---

## **2. Project Structure**

```
GPTree/
├── .github/workflows/         # CI/CD workflows
├── app/                       # Next.js app routes & serverless APIs
│   └── api/                   # REST endpoints for trees, nodes, flashcards
├── backend_helpers/           # LLM and backend utility functions
├── components/                # UI components (React + Tailwind)
├── devDiagrams/               # Architecture and data flow diagrams
├── helpers/                   # Prompt templates and shared backend logic
├── lib/                       # Prisma client, auth utilities, global configs
├── prisma/                    # Database schema & migrations
│   └── schema.prisma
├── public/                    # Static assets
├── reports/                   # Living documents and reports
├── test/                      # Jest tests (unit + integration)
├── types/                     # Shared TypeScript types
├── .env.example               # Environment variable template
├── .env.test.example          # Test environment variables
├── README.md                  # Overview for users
├── USER_MANUAL.md             # End-user manual
├── coding-guidelines.md       # Style and contribution conventions
├── jest.config.js             # Jest configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Scripts and dependencies
└── next.config.ts             # Next.js configuration
```

**Key Folders:**

* `app/` – Main frontend and serverless API logic (Next.js 14 App Router)
* `components/` – Modular UI blocks (TreeView, Flashcards, Navigation)
* `lib/` – Prisma client, auth, and Groq helper utilities
* `helpers/` – System prompts, markdown parsing, LLM interfacing
* `test/` – Jest tests for API, DB, and LLM integration
* `reports/` – LivingDocument reports for design and testing documentation

---

## **3. Architecture Overview**

### **Design Patterns**

* **Model-View-Controller (MVC)** via Next.js App Router
* **Service Layer** abstraction for LLM and database calls
* **Repository Pattern** for Prisma queries
* **Dependency Injection** for testable services

### **Core Technologies**

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Frontend   | React + Next.js (TypeScript) |
| Backend    | Next.js API Routes (Node.js) |
| Database   | PostgreSQL via Prisma ORM    |
| Auth       | NextAuth.js (Google / Email) |
| LLM        | Groq API for text generation |
| Testing    | Jest + Supertest             |
| Deployment | Vercel                       |

### **Data Flow**

1. User creates a new tree → sends POST to `/api/trees`
2. API handler calls Groq API to generate summary → stores in DB
3. Frontend re-renders via React hooks (`useEffect`, `useSWR`)
4. User can expand nodes, create flashcards, and use spaced repetition UI

---

## **4. Building and Running the Software**

### **Development Build**

```bash
npm run dev
```

Launches the Next.js dev server with hot reload.

### **Production Build**

```bash
npm run build
npm start
```

### **Environment Setup**

* `.env` → Development
* `.env.test` → Jest environment
* `.env.production` → Vercel deployment

---

## **5. Testing**

### **Running Tests**

```bash
npm test
```

or in watch mode:

```bash
npm run test:watch
```

### **Test Frameworks**

* **Jest** for unit and integration testing
* **Supertest** for API endpoint validation

### **Example Command**

```bash
npx jest --runInBand
```

### **Test Coverage Includes:**

* API endpoints (`/api/trees`, `/api/nodes`)
* LLM (Groq) helper logic
* Prisma database operations
* Authentication flow

---

## **6. Adding New Tests**

### **File Naming**

* Use `[ModuleName].test.ts` for each file under `/test/`

### **Example Test**

```typescript
import { createNode } from '@/app/api/nodes';

describe('Node Creation', () => {
  it('should create a new node successfully', async () => {
    const result = await createNode('Physics', 'Explain quantum entanglement');
    expect(result).toHaveProperty('id');
  });
});
```

### **Test Categories**

1. **Unit Tests** – isolated function tests
2. **Integration Tests** – DB and API combined
3. **Mock Tests** – Groq API mock responses for deterministic output

---

## **7. Building a Production Release**

### **Pre-Release Checklist**

1. Update `.env.production` values
2. Run migrations

   ```bash
   npx prisma migrate deploy
   ```
3. Run all tests

   ```bash
   npm test
   ```
4. Commit & push changes

   ```bash
   git commit -m "build: prepare production release"
   git push origin main
   ```

### **Deployment**

* Deployment handled automatically via **Vercel**
* Protected `main` branch for production builds
* Environment variables managed in Vercel dashboard

---

## **8. Code Style Guidelines**

### **Formatting**

* Indentation: 2 spaces
* Max line length: 100 chars
* Use Prettier + ESLint (`npm run lint`)

### **Naming Conventions**

| Type       | Convention | Example                |
| ---------- | ---------- | ---------------------- |
| Components | PascalCase | `TreeView.tsx`         |
| Functions  | camelCase  | `generateFlashcards()` |
| Variables  | camelCase  | `userSession`          |
| Constants  | UPPER_CASE | `MAX_NODE_DEPTH`       |

### **Best Practices**

* Avoid `any` type; prefer TypeScript interfaces
* Keep components small and composable
* Use JSDoc for exported utilities
* Use async/await for all async operations

---

## **9. Contributing**

### **Branch Workflow**

```bash
git checkout -b feature/new-flashcard-ui
```

### **Commit Message Format**

Follow **Conventional Commits**:

* `feat:` – New features
* `fix:` – Bug fixes
* `docs:` – Documentation changes
* `refactor:` – Code improvements
* `test:` – Test updates

### **Pull Request Checklist**

1. Tests pass (`npm test`)
2. Lint clean (`npm run lint`)
3. Updated docs if needed
4. At least one reviewer approval


