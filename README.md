# VDOX Backend

Welcome to the VDOX backend! This project powers the core API and authentication for your video platform. Built with Node.js, Express, MongoDB, and JWT, it provides secure user management and file uploads.

## 🚀 Features
- User registration, login, and logout
- JWT-based authentication & refresh tokens
- Avatar and cover image upload (Cloudinary)
- Password hashing (bcryptjs)
- MongoDB models with Mongoose
- Error handling and validation

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- Multer (file uploads)
- Cloudinary (image hosting)
- JWT (authentication)
- bcryptjs (password security)

## 📦 Project Structure
```
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── index.js
│   └── constants.js
├── public/
│   └── temp/
├── .env.sample
├── package.json
```

## ⚡ Getting Started
1. **Clone the repo:**
   ```bash
   git clone https://github.com/fardin04/vdox.git
   cd vdox
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.sample` to `.env` and fill in your secrets.
4. **Run the server:**
   ```bash
   npm run start
   ```

## 🔑 Environment Variables
See `.env.sample` for all required variables:
- `MONGODB_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRATION`
- `REFRESH_TOKEN_EXPIRATION`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 🧑‍💻 API Endpoints
- `POST /api/v1/register` — Register a new user
- `POST /api/v1/login` — Login and get tokens
- `POST /api/v1/logout` — Logout and clear tokens

## 📸 File Uploads
- Avatar and cover images are uploaded via multipart/form-data.
- Images are stored in Cloudinary.

## 🛡️ Security
- Passwords are hashed before saving
- JWT tokens for authentication
- Refresh tokens stored securely

## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

## 📄 License
MIT

---

> Made with ❤️ by fardin04
