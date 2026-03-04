# 🚀 Deploy Event Management Frontend to Vercel

## **Prerequisites**
- GitHub account (you already have this)
- Vercel account (free - we'll create this)
- Your frontend code pushed to GitHub

---

## **Step 1: Push Frontend to GitHub**

First, ensure your latest frontend changes are committed and pushed:

```bash
cd "D:\Local Disk G\7 Sem\DEA ll\test\Microservice-Based-Hotel-Management-System"
git add .
git commit -m "Add vercel.json and AWS backend configuration"
git push origin main
```

---

## **Step 2: Create Vercel Account**

1. Go to **https://vercel.com/**
2. Click **"Sign Up"** (top right)
3. Choose **"Continue with GitHub"**
4. Log in with your GitHub account
5. Click **"Authorize Vercel"** to connect your repositories

---

## **Step 3: Import Your Project**

1. After logging in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find: **"Microservice-Based-Hotel-Management-System"**
4. Click **"Import"** next to it

---

## **Step 4: Configure Project Settings**

On the "Configure Project" page:

### **Framework Preset:**
- Vercel should auto-detect **"Vite"** ✅

### **Root Directory:**
1. Click **"Edit"** next to "Root Directory"
2. Enter: `frontend/event-management`
3. Click **"Continue"**

### **Build and Output Settings:**
Leave these as default (Vercel auto-detects from vercel.json):
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### **Environment Variables:**
- ⚠️ **Skip this section** - Your API URL is already hardcoded in the code

---

## **Step 5: Deploy**

1. Click **"Deploy"** button (bottom of the page)
2. Wait 2-3 minutes while Vercel:
   - Installs dependencies
   - Builds your React app
   - Deploys to CDN

You'll see a progress screen with real-time logs.

---

## **Step 6: Get Your Live URL**

Once deployment completes:

1. You'll see: **"Congratulations! Your project has been deployed."** 🎉
2. Your app will be live at: `https://your-project-name.vercel.app`
3. Click **"Visit"** to open your live site

Example URL: `https://microservice-based-hotel-management-system.vercel.app`

---

## **Step 7: Test Your Deployment**

1. Open your Vercel URL in a browser
2. Test the login page
3. Log in with your credentials
4. Check if venues load from AWS backend
5. Try booking a venue

**Expected Result:** Everything should work because your frontend is already configured to use the AWS backend URL.

---

## **🔄 Automatic Deployments**

Going forward, whenever you push to GitHub:
- Vercel **automatically rebuilds and redeploys** your frontend
- No manual steps needed!

---

## **📋 Troubleshooting**

### **Build Failed?**
- Check the build logs in Vercel dashboard
- Common issue: Missing dependencies → Fixed by `npm install`

### **Blank Page?**
- Check browser console for errors (F12)
- Verify Root Directory is set to `frontend/event-management`

### **CORS Errors?**
- ✅ Already fixed! Your backend has `@CrossOrigin(origins = "*")`

### **Can't See Venues?**
- Remember: H2 database resets on AWS redeployment
- Re-run the PowerShell script to add venues again

---

## **🎯 Summary**

**What you'll have:**
- ✅ Frontend: Hosted on Vercel (auto-deploys from GitHub)
- ✅ Backend: Hosted on AWS Elastic Beanstalk
- ✅ Full-stack app accessible from anywhere!

**Your URLs:**
- **Frontend:** `https://[your-app].vercel.app` (you'll get this after Step 6)
- **Backend:** `http://Event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com`

---

## **💡 Pro Tips**

1. **Custom Domain:** You can add a custom domain in Vercel settings (free)
2. **Preview Deployments:** Every GitHub branch gets its own preview URL
3. **Analytics:** Enable Vercel Analytics to track visitors (free tier available)
4. **Environment Variables:** If you need different API URLs for staging/production, add them in Vercel dashboard under "Settings" → "Environment Variables"

---

**Ready? Start with Step 1!** After you complete Step 1 (pushing to GitHub), let me know and I'll guide you through any issues!
