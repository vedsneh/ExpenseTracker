# MERN Stack Expense Tracker

A comprehensive expense tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication** - Secure JWT-based authentication
- **Dashboard Overview** - Visual summary of financial data
- **Income Management** - Track and categorize income sources
- **Expense Management** - Monitor and categorize expenses
- **Interactive Charts** - Pie charts showing expense distribution
- **Recent Transactions** - Quick view of latest activities
- **Export Functionality** - Download data as CSV files
- **Mobile Responsive** - Works on all device sizes
- **Real-time Updates** - Instant data synchronization

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Chart library
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
\`\`\`

4. Start the server:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Navigate to frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

### Run Both Servers Concurrently

From the root directory:
\`\`\`bash
npm run install-deps
npm run dev
\`\`\`

## Project Structure

\`\`\`
mern-expense-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── transactions.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics

## Usage

1. **Register/Login** - Create an account or login with existing credentials
2. **Dashboard** - View your financial overview with summary cards and charts
3. **Add Income** - Navigate to Income page and add your income sources
4. **Add Expenses** - Navigate to Expenses page and categorize your spending
5. **View Analytics** - Check the pie chart for expense distribution
6. **Export Data** - Download your financial data as CSV files
7. **Manage Transactions** - Edit or delete transactions as needed

## Demo Credentials

For testing purposes, you can use:
- **Email:** demo@example.com
- **Password:** password123

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository.
