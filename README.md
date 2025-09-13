# Travel Itinerary Planner 🧳

A comprehensive full-stack travel planning application built with **Spring Boot 3**, **PostgreSQL**, **React TypeScript**, and **Docker**.

## ✨ Features

- 🔐 **JWT Authentication** with Spring Security & BCrypt
- 🗄️ **PostgreSQL Database** with Flyway migrations
- 🎯 **Trip Management** - Create, update, and organize trips
- 📅 **Calendar View** - Visual timeline of your travels
- 📝 **Day Planning** - Detailed daily activities with CRUD operations
- 💰 **Cost Tracking** - Budget management and expense analysis
- 📊 **Analytics Dashboard** - Interactive charts for cost breakdown
- 🏷️ **Tag System** - Organize trips and activities
- 📱 **Responsive Design** - Works on all devices
- 🐳 **Docker Ready** - One-command deployment

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** installed and running
- That's it! Docker will handle everything else.

### Step-by-Step Instructions

1. **Open Terminal/Command Prompt**

2. **Navigate to the project directory:**
   ```bash
   cd /Users/chinnari/Travel-Itinerary-Planner
   ```

3. **Start the application:**
   ```bash
   docker-compose up --build
   ```

4. **Wait for startup** (2-3 minutes). You'll see logs from all services.

5. **Open your browser and go to:**
   - 🌐 **Main App:** http://localhost:3000
   - 📚 **API Docs:** http://localhost:8080/swagger-ui.html

6. **Create your first account:**
   - Click "create a new account"
   - Fill in your details and register
   - Login and start planning your trips!

### 🛑 To Stop the Application
```bash
# Press Ctrl+C in terminal, then:
docker-compose down
```

### 📖 Detailed Setup Guide
For troubleshooting and alternative setup methods, see **[SETUP.md](SETUP.md)**

### Local Development
See [docs/README.md](docs/README.md) for development setup instructions.

## 🏗️ Tech Stack

### Backend
- **Spring Boot 3** - REST API framework
- **Spring Security** - Authentication & authorization
- **PostgreSQL** - Primary database
- **Flyway** - Database migrations
- **JWT** - Stateless authentication
- **Swagger/OpenAPI** - API documentation
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy & static file serving
- **PostgreSQL** - Production database

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Trips
- `GET /api/trips` - Get user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get trip details
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip

### Activities
- `GET /api/dayplans/{id}/activities` - Get day activities
- `POST /api/dayplans/{id}/activities` - Create activity
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity

### Analytics
- `GET /api/analytics/trips/{id}/cost-breakdown` - Cost analysis

## 🗂️ Project Structure

```
Travel-Itinerary-Planner/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration & migrations
│   ├── Dockerfile          # Backend container
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # TypeScript source code
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container
│   └── package.json       # npm dependencies
├── docs/                  # Documentation
│   └── README.md          # Detailed documentation
├── docker-compose.yml     # Multi-container setup
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
# Database
DB_USERNAME=travel_user
DB_PASSWORD=travel_password

# JWT
JWT_SECRET=your_jwt_secret_key_here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:8080/api
```

## 📸 Screenshots

### Trip Dashboard
Clean and intuitive interface for managing all your trips.

### Calendar View
Visual timeline showing your trip activities across dates.

### Cost Analysis
Interactive charts showing spending breakdown by category and day.

### Activity Management
Detailed day-by-day planning with drag-and-drop functionality.

## 🎯 Key Features Explained

### JWT Authentication
- Secure user registration and login
- Token-based stateless authentication
- Password encryption with BCrypt
- Role-based access control

### Trip Management
- Create trips with dates, destinations, and budgets
- Tag system for organization
- Public/private trip visibility
- Member collaboration (planned)

### Activity Planning
- Day-by-day itinerary creation
- Activity categories (dining, transportation, etc.)
- Time scheduling and location tracking
- Cost tracking per activity
- Completion status tracking

### Cost Analytics
- Real-time budget tracking
- Category-wise expense breakdown
- Daily spending analysis
- Visual charts and graphs
- Budget vs. actual comparison

## 🚦 Getting Started

1. **Prerequisites:** Docker & Docker Compose installed
2. **Clone:** `git clone <repo-url>`
3. **Run:** `docker-compose up --build`
4. **Access:** http://localhost:3000
5. **Register:** Create your first account
6. **Plan:** Start creating your travel itineraries!

## 📖 Documentation

For detailed setup instructions, API documentation, and architecture details, see [docs/README.md](docs/README.md).

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Traveling! ✈️🌍**

*Built with ❤️ using modern web technologies*