# Green Oasis Store - Deployment Guide 🌿

This guide covers deploying the Green Oasis store to production using **FREE** hosting options.

---

## 📋 Prerequisites

- Node.js 18+ installed locally
- Git repository (GitHub, GitLab, etc.)
- Neon PostgreSQL database (already configured)

---

## 🗄️ Database (Neon - Already Set Up)

Your database is already configured on Neon. For new deployments:

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string from the dashboard
3. Use it as `DATABASE_URL` in your backend environment

---

## 🔧 Backend Deployment (Railway - FREE)

### Option A: Railway (Recommended)

Railway offers a free tier with $5/month credit.

#### Steps:

1. **Push code to GitHub** (if not already)

2. **Go to [railway.app](https://railway.app)** and sign in with GitHub

3. **Create New Project** → **Deploy from GitHub repo**

4. **Select your repository** and the `backend` folder

5. **Add Environment Variables:**
   ```
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=your-super-secret-key-min-32-chars
   NODE_ENV=production
   PORT=3000
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

6. **Configure Build Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

7. **Deploy!** Railway will provide a URL like `your-app.railway.app`

### Option B: Render (Alternative)

1. Go to [render.com](https://render.com)
2. Create a **Web Service**
3. Connect your GitHub repo
4. Set root directory to `backend`
5. Build Command: `npm install && npx prisma generate && npm run build`
6. Start Command: `npm start`
7. Add environment variables (same as Railway)

---

## 🌐 Frontend Deployment (Vercel - FREE)

Vercel is perfect for React/Vite apps with a generous free tier.

### Steps:

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Import your repository**

3. **Configure Project:**
   - Framework Preset: Vite
   - Root Directory: `.` (root, not backend)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

5. **Deploy!** Vercel will provide a URL like `your-app.vercel.app`

---

## 🔗 Connect Frontend to Backend

After deploying both:

1. **Update Backend CORS:**
   - Add your Vercel URL to `ALLOWED_ORIGINS` in Railway/Render
   - Example: `ALLOWED_ORIGINS=https://green-oasis.vercel.app`

2. **Update Frontend API URL:**
   - Set `VITE_API_URL` in Vercel to your Railway backend URL
   - Example: `VITE_API_URL=https://green-oasis-api.railway.app/api`

3. **Redeploy both** to apply changes

---

## 📧 Email Configuration (Production)

For production emails, configure SMTP in your backend environment:

### Gmail (Free, Limited)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

> ⚠️ For Gmail, create an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### SendGrid (100/day Free)
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=your-verified-sender@domain.com
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at production URL
- [ ] Frontend loads without errors
- [ ] Admin login works
- [ ] Products display correctly
- [ ] Orders can be placed
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] Database migrations are applied

---

## 🔒 Security Reminders

1. **Change JWT_SECRET** - Use a strong, unique secret (32+ chars)
2. **Enable HTTPS** - Both Railway and Vercel provide this automatically
3. **Restrict CORS** - Only allow your frontend domain
4. **Secure Admin Passwords** - Use strong, hashed passwords

---

## 🐛 Troubleshooting

### Backend not starting
- Check logs in Railway/Render dashboard
- Verify `DATABASE_URL` is correct
- Run `npx prisma generate` in build command

### CORS errors
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Include protocol: `https://your-domain.com`

### Database connection fails
- Check Neon connection string
- Ensure `?sslmode=require` is in the URL

---

## 📊 Monitoring

- **Railway**: Built-in logs and metrics
- **Vercel**: Analytics in dashboard
- **Neon**: Database monitoring in console

---

**Need help?** Check the deployment platform docs or open an issue in your repository.
