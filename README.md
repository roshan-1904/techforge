# TechForge Workshop Certificate Generator

A complete full-stack web application to manage workshop registrations and automatically generate PDF certificates with QR code verification.

## Features

- **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js, MongoDB
- **Certificate Generation:** Uses `pdf-lib` to overlay dynamic text and QR codes on an uploaded certificate template.
- **Authentication:** JWT for Admin Dashboard
- **Email:** Nodemailer for automatically sending the PDF certificate upon approval.

## Requirements

- Node.js (v18+)
- MongoDB (running locally on port 27017, or update `MONGO_URI` in `.env`)
- Certificate Template Image (`server/templates/certificate_template.jpg`)

## Setup Instructions

### 1. Database and Environment

1. Ensure MongoDB is running locally.
2. The backend uses the `.env` file located in `server/.env`.
3. Update the `EMAIL_USERNAME` and `EMAIL_PASSWORD` (use App Passwords for Gmail) in `server/.env` to enable email sending.

### 2. Certificate Template

1. Navigate to the `server` directory.
2. Create a folder named `templates` if it doesn't exist: `mkdir server/templates`.
3. Place your background certificate image as `server/templates/certificate_template.jpg`.
   - *Note: If you don't provide this image, the system will fall back to generating a blank white PDF with the student's name.*

### 3. Backend Setup

1. Open a terminal in the `server` folder.
2. Run `npm install` to install dependencies.
3. Seed the admin user by running:
   ```bash
   node scripts/seedAdmin.js
   ```
   *(Admin login: `admin@techforge.com` / `password123`)*
4. Start the server:
   ```bash
   node index.js
   ```
   The backend will run on `http://localhost:5000`.

### 4. Frontend Setup

1. Open a new terminal in the `thasni` folder.
2. Run `npm install` to install dependencies.
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Deployment Instructions

### Deploying Backend to Render
1. Push your code to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Connect your repository and select the `server` folder as the Root Directory.
4. Set Build Command: `npm install`
5. Set Start Command: `node index.js`
6. Add the Environment Variables from your `.env` file (`MONGO_URI` should be a MongoDB Atlas URL, `CLIENT_URL` should be your Netlify frontend URL).

### Deploying Frontend to Netlify
1. Go to [Netlify](https://netlify.com) and click **Add new site** -> **Import an existing project**.
2. Connect your GitHub repository.
3. Set the Base directory to `thasni`.
4. Set Build command to `npm run build`.
5. Set Publish directory to `thasni/dist`.
6. Click **Deploy site**.
7. *Note: Remember to update the backend API URLs in your React components from `http://localhost:5000` to your Render backend URL before deploying.*