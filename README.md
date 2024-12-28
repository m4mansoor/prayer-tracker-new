# Prayer Tracking Platform

A comprehensive web-based platform for tracking prayers, managing fines, and monitoring prayer history.

## Features

- Daily Prayer Time Display with API integration
- Fine Management System
- Prayer History with filtering options
- Fine Payment History
- Responsive Design
- User Authentication
- Data Visualization
- Push Notifications

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- UI Framework: Material-UI
- Charts: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   Create `.env` files in both frontend and backend directories using the provided `.env.example` templates.

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## Deployment

This application is configured for deployment on Vercel. Follow these steps to deploy:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the application:
```bash
cd frontend
vercel
```

4. For production deployment:
```bash
vercel --prod
```

The application will be deployed and you'll receive a URL where it's live.

### Deployment Configuration

- The application uses client-side storage (localStorage) for data persistence
- All routes are configured to work with client-side routing
- Static assets are properly served
- Automatic HTTPS enabled
- Automatic CI/CD with Git integration

### Post-Deployment

After deployment:
1. Visit the provided URL
2. Test all functionality:
   - Prayer tracking
   - Fine calculations
   - History viewing
   - Settings configuration
3. Verify that data persists across page refreshes

## Project Structure

```
prayer-tracker/
├── backend/           # Node.js Express backend
├── frontend/         # React frontend
├── .gitignore
├── README.md
└── package.json
```

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
