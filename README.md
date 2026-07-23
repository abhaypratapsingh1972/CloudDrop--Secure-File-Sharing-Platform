# CloudDrop

CloudDrop is a full-stack file sharing platform for uploading, previewing, and sharing files through short links. It supports registered users, guest uploads, optional password protection, expiry dates, QR codes, download pages, and a dashboard for tracking uploaded files.

Live deployment:

```txt
https://cloud-drop-secure-file-sharing-platform-aegyo1z54.vercel.app
```

## Features

- User signup and login
- Dashboard for uploaded files
- Authenticated file uploads
- Guest file uploads
- Image, video, audio, and PDF previews
- Password-protected share links
- Expiring file links
- Short public download routes
- QR code generation for shared links
- Download count tracking
- Email sharing support
- Cloudinary-backed file storage
- MongoDB-backed metadata storage

## Tech Stack

Frontend:

- React 18
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- React Toastify

Backend:

- Node.js
- Express
- MongoDB
- Mongoose
- Cloudinary
- Multer
- JWT
- bcryptjs
- Nodemailer

Deployment:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas or another MongoDB provider
- File storage: Cloudinary

## Project Structure

```txt
CloudDrop/
  client/
    src/
      components/
      config/
      redux/
      App.jsx
      main.jsx
    vercel.json
    package.json

  server/
    src/
      config/
      controllers/
      db/
      middlewares/
      models/
      routes/
      app.js
      index.js
    package.json
```

## Environment Variables

Create a `.env` file inside `server/`.

```env
PORT=5600
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

BASE_URL=http://localhost:5173

MAIL_USER=your_gmail_address
MAIL_PASS=your_gmail_app_password
NODE_ENV=development
```

Notes:

- The backend appends the database name `SharePod` to `MONGODB_URL`.
- `BASE_URL` should point to the frontend URL used for generated share links.
- In production, set `BASE_URL` to your Vercel frontend URL.
- `MAIL_USER` and `MAIL_PASS` are only required for email sharing.

Create a `.env` file inside `client/`.

```env
VITE_API_BASE_URL=http://localhost:5600/api
```

For production on Vercel:

```env
VITE_API_BASE_URL=https://clouddrop-api.onrender.com/api
```

## Local Setup

Clone the repository and install dependencies for both apps.

```bash
cd CloudDrop
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

Start the backend:

```bash
cd ../server
npm run dev
```

The backend runs on:

```txt
http://localhost:5600
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

## Build

Build the frontend:

```bash
cd client
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Start the backend in production mode:

```bash
cd server
npm start
```

## API Routes

Base API URL:

```txt
/api
```

User routes:


| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    | `/users/user`         | Get all users   |
| GET    | `/users/user/:userId` | Get user by ID  |
| POST   | `/users/register`     | Register a user |
| POST   | `/users/login`        | Login a user    |
| GET    | `/users/logout`       | Logout a user   |
| PUT    | `/users/user/:userId` | Update username |
| DELETE | `/users/user/:userId` | Delete user     |

File routes:


| Method | Endpoint                          | Description                            |
| ------ | --------------------------------- | -------------------------------------- |
| POST   | `/files/upload`                   | Upload files for a registered user     |
| POST   | `/files/upload-guest`             | Upload files as a guest                |
| GET    | `/files/getUserFiles/:userId`     | Get files uploaded by a user           |
| GET    | `/files/f/:shortCode`             | Get registered-user file download info |
| GET    | `/files/g/:shortCode`             | Get guest file download info           |
| GET    | `/files/download/:fileId`         | Download file by ID                    |
| DELETE | `/files/delete/:fileId`           | Delete file                            |
| PUT    | `/files/update/:fileId`           | Update file status                     |
| GET    | `/files/getFileDetails/:fileId`   | Get file metadata                      |
| POST   | `/files/generateShareShortenLink` | Generate a short share link            |
| POST   | `/files/sendLinkEmail`            | Send share link by email               |
| POST   | `/files/FileExpiry`               | Update file expiry                     |
| POST   | `/files/updateAllFileExpiry`      | Update expiry for all files            |
| POST   | `/files/updateFilePassword`       | Update file password                   |
| GET    | `/files/searchFiles`              | Search files                           |
| GET    | `/files/showUserFiles`            | Show user files                        |
| GET    | `/files/generateQR/:fileId`       | Generate QR code                       |
| GET    | `/files/getDownloadCount/:fileId` | Get download count                     |
| GET    | `/files/resolveShareLink/:code`   | Resolve a short share link             |
| POST   | `/files/verifyFilePassword`       | Verify registered file password        |
| POST   | `/files/verifyGuestFilePassword`  | Verify guest file password             |

## Deployment Notes

### Frontend on Vercel

Recommended Vercel settings:

```txt
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add this environment variable in Vercel:

```env
VITE_API_BASE_URL=https://clouddrop-api.onrender.com/api
```

The file `client/vercel.json` rewrites all routes to `index.html`, which allows direct browser access to routes such as `/dashboard`, `/login`, `/f/:shortCode`, and `/g/:shortCode`.

If the deployed site returns `401 Unauthorized` from Vercel before React loads, disable Deployment Protection or Vercel Authentication for the production deployment.

### Backend on Render

Recommended Render settings:

```txt
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Add the backend environment variables from the server `.env` section. In production, use your Vercel frontend URL for `BASE_URL`.

## Supported Upload Types

The backend accepts files up to 10 MB with these extensions:

```txt
.jpg, .jpeg, .webp, .png, .mp4, .avi, .mov, .mkv, .mk3d, .mks, .mka, .pdf
```

## Important Notes

- The current Vercel URL may change after each deployment if it is not the production domain.
- Use the stable domain listed in Vercel under `Project -> Settings -> Domains` for public sharing.
- File binaries are uploaded to Cloudinary.
- File metadata, user accounts, passwords, expiry settings, and download counts are stored in MongoDB.
- Passwords are hashed with bcrypt before being stored.
  this is overview view of my project
