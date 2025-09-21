# Thryve - Mental Health Platform

A comprehensive mental health platform developed for SIH 2025, featuring a multi-component architecture with admin dashboard, backend API, and user-facing mental health assistance tools.

## 🚀 Project Overview

Thryve is a mental health platform designed to provide comprehensive support through:
- **Admin Dashboard**: Administrative interface for managing users, appointments, and resources
- **Backend API**: Robust REST API with authentication and comprehensive data management
- **Mental Mitra**: User-facing mental health assistance platform with chatbot and assessment tools

## 🏗️ Architecture

The project consists of three main components:

### 1. Admin Site (`admin-site/`)
React-based administrative dashboard built with modern web technologies.

**Tech Stack:**
- React 18 + Vite
- Tailwind CSS 4.1
- React Query (TanStack Query)
- React Router DOM
- React Hook Form + Zod validation
- Zustand for state management
- Axios with interceptors
- Recharts for data visualization

**Key Features:**
- JWT-based authentication
- User management
- Appointment scheduling
- Institute management
- Resource management
- Screening assessments
- Notifications system
- Dashboard analytics

### 2. Backend (`Backend/`)
Node.js/Express API server with MongoDB database integration.

**Tech Stack:**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Nodemailer for email services
- CORS support
- Cookie-parser

**Key Features:**
- RESTful API endpoints
- User authentication & authorization
- Email OTP verification
- Password reset functionality
- File upload support
- Database seeding utilities
- Comprehensive user roles management

### 3. Mental Mitra (`Mental-Mitra-/`)
User-facing mental health platform with assessment tools and AI chatbot.

**Tech Stack:**
- Vanilla HTML/CSS/JavaScript
- Tailwind CSS
- Interactive UI components
- PDF resources integration

**Key Features:**
- Mental health assessments (PHQ, GHQ)
- AI-powered chatbot
- Community features
- User dashboard
- Profile management
- Educational resources

## 📋 API Endpoints

The backend provides comprehensive REST API endpoints:

- **Users**: Registration, authentication, profile management
- **Institutes**: Institution management and integration
- **Appointments**: Scheduling and management system
- **Screenings**: Mental health assessment tools
- **Resources**: Educational content management
- **Notifications**: System-wide notification handling
- **Admin Dashboard**: Administrative data and analytics

For detailed API documentation, see `Backend/API_ENDPOINTS.md`.

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Git

### 🔗 Clone the Repository

1. Clone the repository:
```bash
git clone https://github.com/lovesinghal31/Thryve.git
```

2. Navigate to the project directory:
```bash
cd Thryve
```

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
touch .env.example .env
```

4. Configure environment variables:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/thryve
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
PORT=5000
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

### Admin Site Setup

1. Navigate to the admin-site directory:
```bash
cd admin-site
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
touch .env.sample .env
```

4. Configure API base URL:
```env
VITE_API_BASE=http://localhost:5000/api/v1
```

5. Start the development server:
```bash
npm run dev
```

### Mental Mitra Setup

The Mental Mitra component uses vanilla HTML/CSS/JS and can be served directly:

1. Navigate to the Mental-Mitra- directory:
```bash
cd Mental-Mitra-
```

2. Open `frontPage.html` in a web browser or serve through a local server.

## 🗄️ Database Seeding

The backend includes comprehensive seeding utilities to populate the database with test data:

```bash
# Populate database with dummy data
npm run seed

# Fresh seed (clears existing data first)
npm run seed -- --fresh

# Clear all data
npm run seed:clear
```

The seeder creates realistic test data for:
- Users across different roles
- Institutes and organizations
- Resources and educational content
- Screening assessments
- Appointments
- Tasks and intervention logs
- Chat sessions and AI interactions
- Admin dashboard snapshots
- Notifications

## 🎯 Key Features

### Admin Dashboard
- **User Management**: Complete CRUD operations for user accounts
- **Appointment System**: Schedule and manage mental health appointments
- **Resource Library**: Manage educational content and materials
- **Assessment Tools**: Handle screening questionnaires and results
- **Analytics**: Dashboard with charts and statistics
- **Institution Management**: Manage partner institutions and facilities

### Mental Health Platform
- **AI Chatbot**: Intelligent conversational assistant for mental health support
- **Assessment Tools**: PHQ-9, GHQ questionnaires for mental health screening
- **Community Features**: User interaction and support groups
- **Personal Dashboard**: Individual user progress tracking
- **Educational Resources**: Mental health awareness materials

### Backend API
- **Authentication**: JWT-based secure authentication system
- **Authorization**: Role-based access control
- **File Management**: Upload and storage capabilities
- **Email Services**: OTP verification and notifications
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Structured error responses

## 🚦 Development Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Populate database with dummy data
npm run seed:clear # Clear all database collections
```

### Admin Site
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
Thryve/
├── admin-site/          # React admin dashboard
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── features/    # Feature-specific code
│   │   ├── pages/       # Route components
│   │   ├── lib/         # Utilities and configurations
│   │   └── styles/      # Global styles
│   └── public/          # Static assets
├── Backend/             # Node.js API server
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Database schemas
│   │   ├── routes/      # API routes
│   │   ├── middlewares/ # Custom middleware
│   │   ├── utils/       # Helper utilities
│   │   └── seed/        # Database seeding
│   └── public/          # File uploads
└── Mental-Mitra-/       # User-facing platform
    ├── *.html           # Page templates
    ├── *.css            # Styling
    ├── *.js             # Client-side logic
    └── *.pdf            # Educational resources
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Team

### Development Team
- **[Krish Mishra](https://github.com/Krish-Mishra)** - Research Analyst / Frontend Developer **(Team Lead)**
- **[Jayendra Vishwakarma](https://github.com/Jay-877)** - Frontend Developer
- **[Ansh Zamde](https://github.com/ansh1024)** - Frontend Developer
- **[Ashish Gupta](https://github.com/ashish13gupta2006-cmd)** - UI / UX Designer
- **[Nimisha Agarwal](https://github.com/nimisha1505)** - Research Analyst / Backend Developer
- **[Love Singhal](https://github.com/lovesinghal31)** - Backend Developer

## 📞 Support

For support and questions, please refer to the individual component README files or contact the development team.

---

**Note:** This project is part of the Smart India Hackathon 2025 initiative focused on mental health solutions in educational institutions.