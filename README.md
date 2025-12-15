# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory with user authentication, role-based access control, and inventory management features.

![Sweet Shop Banner](https://via.placeholder.com/1200x300/ec4899/ffffff?text=Sweet+Shop+Management+System)

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://ai-kata.vercel.app](https://ai-kata.vercel.app)
- **Backend API (Railway)**: [https://aikata-production.up.railway.app](https://aikata-production.up.railway.app)

## 🌐 Sample Credentials

- **User**: Email - user@sweetshop.com    Password - user123
- **Admin**: Email - admin@sweetshop.com    Password - admin123

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [My AI Usage](#-my-ai-usage)
- [Development Approach](#-development-approach)
- [License](#-license)

---

## ✨ Features

### Authentication & Authorization
- 🔐 JWT-based authentication
- 👤 User registration and login
- 🔑 Role-based access control (USER, ADMIN)
- 🛡️ Protected routes and endpoints

### Sweet Management (CRUD)
- ➕ Create new sweets
- 📋 View all available sweets
- 🔍 Advanced search and filtering (by name, category, price range)
- ✏️ Update sweet details
- 🗑️ Delete sweets (Admin only)

### Inventory Operations
- 🛒 Purchase sweets (decreases quantity)
- 📦 Restock sweets (Admin only, increases quantity)
- ⚠️ Stock validation (prevent purchasing when out of stock)
- 📊 Real-time inventory tracking

### User Interface
- 🎨 Modern, responsive design with Tailwind CSS
- 🌙 Beautiful gradient backgrounds and animations
- 📱 Mobile-friendly interface
- 🔔 Toast notifications for user feedback
- 💫 Smooth transitions and hover effects

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Deployment**: Railway

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

---

## 📁 Project Structure
```
Kata_Sweet/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── decorators/    # Custom decorators (@Public, @Roles, @CurrentUser)
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── guards/        # Auth & Role guards
│   │   │   ├── strategies/    # JWT strategy
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── sweets/            # Sweets management module
│   │   │   ├── dto/           # DTOs for sweets operations
│   │   │   ├── sweets.controller.ts
│   │   │   ├── sweets.service.ts
│   │   │   └── sweets.module.ts
│   │   ├── prisma/            # Prisma ORM module
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   ├── common/            # Shared types and utilities
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── test/                  # E2E tests
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Example environment file
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── auth/          # Login/Register components
│   │   │   ├── sweets/        # Sweet cards, modals
│   │   │   ├── admin/         # Admin-specific components
│   │   │   └── layout/        # Layout components (Navbar, etc.)
│   │   ├── pages/             # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── services/          # API service layer
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   └── sweets.service.ts
│   │   ├── store/             # Zustand state management
│   │   │   ├── authStore.ts
│   │   │   └── sweetsStore.ts
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── README.md
│
├── .gitignore
├── LICENSE
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

---

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/kata-sweet.git
cd kata-sweet/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sweetshop"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application
PORT=3000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

5. **Start the backend server**
```bash
npm run start:dev
```

The backend API will be available at `http://localhost:3000`

---

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the `frontend` directory:
```bash
cp .env.example .env
```

Update the `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

4. **Start the frontend development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🎮 Running the Application

### Development Mode

1. **Start Backend** (in `backend` directory):
```bash
npm run start:dev
```

2. **Start Frontend** (in `frontend` directory):
```bash
npm run dev
```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Test Results
```
Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        2.5s

-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |     100 |      100 |     100 |     100 |
 auth/                   |     100 |      100 |     100 |     100 |
  auth.service.ts        |     100 |      100 |     100 |     100 |
 sweets/                 |     100 |      100 |     100 |     100 |
  sweets.service.ts      |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|-------------------
```

See [backend/TEST_REPORT.md](backend/TEST_REPORT.md) for detailed test documentation.

---

## 🌍 Deployment

### Backend Deployment (Railway)

The backend is deployed on [Railway](https://railway.app).

**Steps:**

1. Create account on Railway
2. Create new project from GitHub repository
3. Set root directory to `backend`
4. Add PostgreSQL database
5. Configure environment variables:
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your Vercel URL)
6. Deploy automatically triggers on push to main branch

**Live Backend**: https://aikata-production.up.railway.app

---

### Frontend Deployment (Vercel)

The frontend is deployed on [Vercel](https://vercel.com).

**Steps:**

1. Create account on Vercel
2. Import project from GitHub
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL` (your Railway backend URL)
5. Deploy automatically triggers on push to main branch

**Live Frontend**: https://ai-kata.vercel.app

---

## 📡 API Documentation

### Base URL
```
Production: https://aikata-production.up.railway.app
Local: http://localhost:3000
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbG...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Sweets Endpoints (Protected)

All sweets endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your-token>
```

#### Get All Sweets
```http
GET /api/sweets
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=candy&minPrice=1&maxPrice=10
```

#### Get Sweet by ID
```http
GET /api/sweets/:id
```

#### Create Sweet
```http
POST /api/sweets
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.5,
  "quantity": 100
}
```

#### Update Sweet
```http
PATCH /api/sweets/:id
Content-Type: application/json

{
  "price": 3.0,
  "quantity": 150
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
```

### Inventory Endpoints (Protected)

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Content-Type: application/json

{
  "quantity": 5
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Content-Type: application/json

{
  "quantity": 50
}
```

For complete API documentation, see [backend/README.md](backend/README.md).

---

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
*Modern authentication interface with gradient design*

### Home Page - Sweets Listing
![Home Page](screenshots/home.png)
*Browse and search through available sweets*

### Sweet Details & Purchase
![Purchase Modal](screenshots/purchase.png)
*Purchase sweets with real-time stock validation*

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)
*Comprehensive admin panel with inventory statistics*

### Admin - Add/Edit Sweet
![Add Sweet](screenshots/add-sweet.png)
*Intuitive forms for managing sweet inventory*

### Admin - Restock
![Restock](screenshots/restock.png)
*Quick restock functionality for inventory management*

---

## 🤖 My AI Usage

### AI Tools Used

**Primary AI Assistant**: Claude (Anthropic)

Throughout the development of this project, I leveraged Claude as an AI pair programmer to accelerate development while maintaining full understanding and ownership of the codebase.

---

### How AI Was Used

#### 1. **Project Setup & Architecture** (30% AI, 70% Manual)

**What AI Did:**
- Generated initial NestJS and React project boilerplate
- Suggested monorepo structure organization
- Provided Prisma schema templates for User and Sweet models

**My Role:**
- Decided on the overall architecture and tech stack
- Customized the folder structure to fit project requirements
- Made decisions on state management (Zustand over Redux)
- Configured build tools and deployment settings

**Example Interaction:**
> **Me**: "Set up a NestJS backend with Prisma and PostgreSQL for a sweet shop"  
> **Claude**: Generated initial schema, module structure, and configuration files  
> **Me**: Customized the schema to add specific fields like `role` enum and optimized indexes

---

#### 2. **Test-Driven Development** (40% AI, 60% Manual)

**What AI Did:**
- Generated initial test case structures following TDD Red-Green-Refactor pattern
- Suggested edge cases I might have missed (e.g., purchasing with insufficient stock)
- Provided Jest mocking patterns for bcrypt and Prisma

**My Role:**
- Wrote business logic requirements that tests should validate
- Identified critical test scenarios based on user stories
- Debugged failing tests and refined test assertions
- Ensured test coverage met quality standards

**Example Commit Message:**
```
test: add failing tests for authentication flow

Used an AI assistant to scaffold the auth module structure
and generate initial test cases, then refined validation,
error handling, and security logic manually.

Co-authored-by: Claude <AI@users.noreply.github.com>
```

**Transparency**: Every commit where AI contributed significantly includes AI co-authorship attribution.

---

#### 3. **Authentication & Security Implementation** (50% AI, 50% Manual)

**What AI Did:**
- Generated JWT strategy boilerplate
- Provided bcrypt integration patterns
- Created guard and decorator structures

**My Role:**
- Made security decisions (salt rounds, token expiration)
- Implemented role-based access control logic
- Configured CORS and security headers
- Validated authentication flow end-to-end

**Key Decision**: When AI suggested storing tokens in localStorage, I verified this approach was acceptable for the project scope but noted that httpOnly cookies would be more secure for production applications.

---

#### 4. **API Development & Business Logic** (25% AI, 75% Manual)

**What AI Did:**
- Generated RESTful endpoint structures
- Provided Prisma query patterns
- Created DTO validation classes

**My Role:**
- **Inventory Management Logic**: Wrote the core business rules for purchase and restock operations, including transaction handling
- **Search Functionality**: Implemented complex filtering with multiple parameters
- **Error Handling**: Designed user-friendly error messages and HTTP status codes
- **Data Validation**: Configured class-validator rules specific to business requirements

**Example**: For the purchase endpoint, AI provided the basic structure, but I implemented:
- Stock validation logic
- Quantity decrease calculation
- Error messages for insufficient stock
- Database transaction safety

---

#### 5. **Frontend Development** (35% AI, 65% Manual)

**What AI Did:**
- Generated React component boilerplate
- Provided Tailwind CSS utility class patterns
- Created initial Zustand store structures
- Suggested responsive design patterns

**My Role:**
- **UI/UX Design**: Made all aesthetic decisions including:
  - Color schemes (purple-pink gradient theme)
  - Animation choices and timing
  - Layout and spacing decisions
  - User flow and navigation
- **State Management**: Designed the state architecture and data flow
- **Form Validation**: Implemented client-side validation logic
- **User Experience**: Added loading states, toast notifications, and error handling

**Creative Control**: The modern, gradient-heavy design was entirely my vision. AI provided technical implementation of Tailwind classes, but I directed the aesthetic direction.

---

#### 6. **Code Quality & Documentation** (60% AI, 40% Manual)

**What AI Did:**
- Generated JSDoc comments for all service methods
- Created comprehensive README structure
- Formatted API documentation
- Suggested code organization improvements

**My Role:**
- Reviewed and customized all documentation
- Added context-specific examples
- Wrote the "My AI Usage" section
- Created deployment guides based on actual deployment experience

---

### Reflection on AI Impact

#### Positive Impacts ✅

1. **Accelerated Development Speed**
   - Tasks that would take hours (like setting up authentication) took minutes
   - Reduced time spent on boilerplate code by approximately 40%
   - Faster iteration cycles on features

2. **Improved Code Quality**
   - AI suggested edge cases I hadn't considered
   - Generated comprehensive test coverage
   - Provided consistent code formatting and naming conventions

3. **Enhanced Learning**
   - When implementing unfamiliar patterns (JWT strategies, Prisma transactions), AI explanations helped me understand the "why" behind the code
   - Learned NestJS best practices through AI-generated examples
   - Discovered new Tailwind CSS patterns and modern React practices

4. **Reduced Context Switching**
   - Instead of searching documentation for syntax, AI provided immediate answers
   - Stayed in flow state longer
   - Faster debugging with AI-suggested solutions

5. **Better Documentation**
   - AI helped structure comprehensive documentation
   - Generated clear API examples
   - Created readable commit messages

#### Areas Where Manual Work Was Critical ⚠️

1. **Business Logic & Requirements**
   - AI cannot make business decisions
   - I had to define what "low stock" means (< 20 units)
   - Determined pricing strategies and inventory rules

2. **Architecture Decisions**
   - Chose monorepo over separate repos
   - Decided on deployment platforms (Railway + Vercel vs alternatives)
   - Selected state management library (Zustand vs Redux)

3. **Security Considerations**
   - Evaluated JWT expiration times
   - Made decisions on password requirements
   - Configured CORS policies appropriately

4. **User Experience**
   - Designed the entire user flow
   - Made all UI/UX decisions
   - Chose color schemes and animations

5. **Debugging Complex Issues**
   - Railway deployment path issues (`dist/src/main.js` vs `dist/main.js`)
   - CORS configuration for production
   - Prisma client generation in build process
   - These required understanding the root cause, not just applying AI suggestions

#### Challenges & Limitations 🔴

1. **Outdated Information**
   - AI suggested Tailwind v4 patterns that weren't compatible
   - Had to downgrade to Tailwind v3 for stability
   - Required manual verification of library versions

2. **Over-Engineering Risk**
   - AI sometimes suggested complex patterns when simple solutions sufficed
   - Had to consciously choose simplicity over cleverness

3. **Context Limitations**
   - AI doesn't know your full codebase or project constraints
   - Required providing context in every interaction
   - Sometimes generated code that didn't integrate well

4. **Testing Realism**
   - AI-generated tests sometimes tested implementation details rather than behavior
   - Had to refactor tests to focus on user-facing functionality

#### Best Practices I Developed 💡

1. **Always Understand Before Implementing**
   - Never copy-paste AI code without understanding it
   - Traced through complex functions to ensure correctness

2. **Iterative Refinement**
   - Used AI for first draft, then manually refined
   - Treated AI suggestions as starting points, not final solutions

3. **Transparent Documentation**
   - Added AI co-authorship to commits
   - Documented AI usage honestly in this README

4. **Critical Evaluation**
   - Questioned AI suggestions that seemed off
   - Cross-referenced with official documentation
   - Tested thoroughly before committing

#### Time Saved vs Time Invested ⏱️

**Estimated Time Breakdown** (Total: ~20 hours):

| Task | Without AI | With AI | Time Saved |
|------|-----------|---------|------------|
| Project Setup | 2 hours | 30 min | 1.5 hours |
| Authentication | 4 hours | 2 hours | 2 hours |
| CRUD Operations | 3 hours | 1.5 hours | 1.5 hours |
| Testing | 4 hours | 2 hours | 2 hours |
| Frontend UI | 6 hours | 4 hours | 2 hours |
| Documentation | 3 hours | 1.5 hours | 1.5 hours |
| **Total** | **22 hours** | **11.5 hours** | **10.5 hours (48%)** |

---

### Overall Assessment

**Would I use AI again?** Absolutely, yes.

**Key Insight**: AI is an exceptional **productivity multiplier** but not a **replacement for developer judgment**. The most successful approach was treating Claude as a highly knowledgeable junior developer:
- Fast at generating boilerplate
- Good at suggesting patterns
- Helpful for documentation
- But requires supervision, code review, and architectural guidance

**Impact on Code Quality**: Positive overall. AI-generated code was well-structured and followed best practices, but the **quality ceiling was defined by my ability to review, refine, and improve** upon AI suggestions.

**Future Improvements**: 
- Use AI earlier in the design phase for brainstorming
- Create better prompts with more context
- Develop a personal library of proven AI prompts
- Balance AI efficiency with maintaining deep technical understanding

---

## 🏗️ Development Approach

### Test-Driven Development (TDD)

This project strictly followed TDD principles:

1. **Red**: Write failing tests first
2. **Green**: Implement minimal code to pass tests
3. **Refactor**: Improve code quality while maintaining passing tests

Evidence in commit history:
```
✅ test: add failing tests for authentication flow
✅ feat: implement user registration and login endpoints

✅ test: add failing tests for sweets CRUD and search APIs
✅ feat: implement sweets CRUD and search endpoints

✅ test: add failing tests for inventory purchase and restock logic
✅ feat: implement inventory purchase and restock endpoints
```

### SOLID Principles

- **Single Responsibility**: Each service handles one concern
- **Open/Closed**: Guards and decorators extend functionality without modification
- **Liskov Substitution**: Services implement clear interfaces
- **Interface Segregation**: DTOs define specific contracts
- **Dependency Injection**: NestJS DI container manages dependencies

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation with class-validator
- ✅ CORS configuration for production
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React escapes by default)
- ✅ Environment variable management

---

## 🤝 Contributing

This is a portfolio/assessment project. Contributions are not currently accepted.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Rishi Bhattasali**

- GitHub: [@RishiBhattasali](https://github.com/your-username)
- Email: rishibhattasali@gmail.com

---

## 🙏 Acknowledgments

- **NestJS** - Progressive Node.js framework
- **React** - Frontend library
- **Prisma** - Next-generation ORM
- **Tailwind CSS** - Utility-first CSS framework
- **Railway** - Backend hosting platform
- **Vercel** - Frontend hosting platform
- **Claude (Anthropic)** - AI development assistant

---

## 📝 Project Timeline

- **Started**: December 12, 2025
- **Backend Completed**: December 13, 2025
- **Frontend Completed**: December 14, 2025
- **Deployed**: December 14, 2025
- **Total Development Time**: ~12 hours (with AI assistance)

---

## 🎯 Key Achievements

- ✅ 100% test coverage on critical services
- ✅ Fully functional authentication and authorization
- ✅ Real-time inventory management
- ✅ Production deployment on Railway + Vercel
- ✅ Responsive, modern UI with smooth animations
- ✅ Complete API documentation
- ✅ Transparent AI usage documentation

---

**Built with ❤️ using NestJS, React, and AI assistance**

---

*Note: This project was developed as part of a technical assessment to demonstrate full-stack development skills, test-driven development practices, and effective AI collaboration.*