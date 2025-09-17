# Personal Dashboard Application

A modern, customizable personal dashboard built with React, TypeScript, and Material-UI, featuring a comprehensive set of productivity tools and widgets.

![Dashboard Preview](reacttypescriptproject/src/assets/dashboard.png)

## 🌟 Features

### **Dashboard Components**
- **🕒 Clock Component** - Real-time clock with customizable 12h/24h format
- **📝 Quick Notes** - Full-width note-taking area with auto-save functionality
- **✅ Todo Management** - Complete task management with priority levels and categories
- **📚 Bookmarks Manager** - Organize and quickly access your favorite websites
- **🌐 Network Status** - Real-time network monitoring with speed tests
- **⏱️ Stopwatch/Timer** - Multi-functional timing tools
- **📅 Daily Reminders** - Personal reminder system

### **Customization & Settings**
- **👤 Personal Preferences** - Custom display name and clock format
- **🎨 Visual Customization** - Animation controls and compact mode
- **📐 Layout Configuration** - Adjustable todo section width (25-50%) and card spacing
- **🔄 Auto-Refresh** - Configurable dashboard refresh intervals (1-60 minutes)
- **🔔 Notifications** - Browser notification preferences for todos and reminders
- **💾 Persistent Settings** - All preferences saved to localStorage

### **Professional UI/UX**
- **✨ Glass Morphism Design** - Modern transparent card design with blur effects
- **🎬 Smooth Animations** - Staggered loading animations with customizable delays
- **📱 Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **🖱️ Interactive Elements** - Hover effects and smooth transitions
- **⌨️ Accessibility** - Keyboard navigation and high contrast support
- **🌙 Professional Styling** - Consistent dark theme with accent colors

## 🏗️ Architecture

### **Frontend (React + TypeScript)**

### **Backend (Node.js + Express)**
- **API Development** - RESTful API for dashboard data
- **Database Integration** - Connects with MongoDB for data storage
- **Authentication** - Secure user authentication with JWT
- **Environment Variables** - Configurable API keys and secrets

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** ≥ 14.x
- **npm** ≥ 5.x
- **MongoDB** (for backend development)

### Client Installation
1. Navigate to the client directory: `cd reacttypescriptproject`
2. Install dependencies: `npm install`

### Server Installation
1. Navigate to the server directory: `cd ReactProject.API`
2. Install dependencies: `npm install`

### Configuration
- **.env** - Copy `.env.example` to `.env` and update the values
- **MongoDB URI** - Set your MongoDB connection string
- **JWT Secret** - Set a secret key for JWT authentication

### Running the Application
#### Development Mode
- **Frontend**: `npm run dev` in the `reacttypescriptproject` directory
- **Backend**: `npm run app` in the `ReactProject.API` directory

#### Production Mode
1. Build the frontend: `npm run build` in the `reacttypescriptproject` directory
2. Serve the frontend: `npm run serve` in the `reacttypescriptproject` directory
3. Start the backend: `npm start` in the `ReactProject.API` directory

## 📦 Scripts

- **Client-Side**
  - `npm run dev` - Start the Vite development server
  - `npm run build` - Build the app for production
  - `npm run serve` - Serve the production build

- **Server-Side**
  - `npm run app` - Start the Express server in development mode
  - `npm start` - Start the Express server in production mode
  - `npm run db:migrate` - Run database migrations
  - `npm run db:seed` - Seed the database with initial data

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in an existing user
- `GET /api/auth/logout` - Log out the current user

### **User**
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

### **Todos**
- `GET /api/todos` - Get all todos for the current user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo by ID
- `DELETE /api/todos/:id` - Delete a todo by ID

### **Notes**
- `GET /api/notes` - Get all notes for the current user
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note by ID
- `DELETE /api/notes/:id` - Delete a note by ID

### **Bookmarks**
- `GET /api/bookmarks` - Get all bookmarks for the current user
- `POST /api/bookmarks` - Add a new bookmark
- `PUT /api/bookmarks/:id` - Update a bookmark by ID
- `DELETE /api/bookmarks/:id` - Delete a bookmark by ID

### **Reminders**
- `GET /api/reminders` - Get all reminders for the current user
- `POST /api/reminders` - Create a new reminder
- `PUT /api/reminders/:id` - Update a reminder by ID
- `DELETE /api/reminders/:id` - Delete a reminder by ID

## 🛠️ Development Tools
- **React Developer Tools** - Chrome/Firefox extension for React debugging
- **Redux DevTools** - Chrome/Firefox extension for Redux state management
- **Postman** - API development and testing tool
- **MongoDB Compass** - GUI for MongoDB management
- **VS Code** - Recommended code editor with ESLint and Prettier extensions

## 🌱 Future Improvements
- **Mobile App** - React Native version of the dashboard
- **Web Clipper** - Browser extension to save links and notes
- **Dark Mode** - System preference based color scheme
- **Improved Analytics** - Dashboard usage statistics and insights
- **User Profiles** - Multi-user support with individual profiles
- **Plugin System** - Extendable architecture for third-party plugins

### Reporting Issues
If you encounter any issues, please open an issue on GitHub with detailed information.

## 🎉 Acknowledgements
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Material-UI** - React components for faster and easier web development
- **Vite** - Next generation front-end tooling
- **CSS3** - Enables modern layout and design with Flexbox and Grid
- **GitHub** - Version control and collaboration platform

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer
This is a personal project dashboard application. It is not affiliated with or endorsed by any of the technologies or companies mentioned in this README.

---