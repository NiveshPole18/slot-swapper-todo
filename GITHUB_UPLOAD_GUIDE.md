# How to Upload to GitHub - Step by Step

## Method 1: Using GitHub Desktop (EASIEST - Recommended for Beginners)

### Step 1: Install GitHub Desktop
1. Download from: https://desktop.github.com/
2. Install and sign in with your GitHub account

### Step 2: Create Repository on GitHub
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `slotswapper` (or any name you like)
4. Description: "SlotSwapper - Peer-to-Peer Time-Slot Scheduling App"
5. Choose **Public** or **Private**
6. **DO NOT** check "Add a README file"
7. **DO NOT** check "Add .gitignore"
8. Click "Create repository"

### Step 3: Clone Repository in GitHub Desktop
1. Open GitHub Desktop
2. File → Clone repository
3. Select your new repository from the list
4. Choose local path: `C:\Users\asus\Desktop\`
5. Click "Clone"

### Step 4: Copy Your Code
1. Copy ALL files from `C:\Users\asus\Desktop\code (1)\` 
2. Paste into the cloned folder (e.g., `C:\Users\asus\Desktop\slotswapper\`)
3. Make sure these folders/files are copied:
   - ✅ `backend/` folder
   - ✅ `frontend/` folder
   - ✅ `app/` folder
   - ✅ `components/` folder
   - ✅ `hooks/` folder
   - ✅ `lib/` folder
   - ✅ `scripts/` folder
   - ✅ All `.md` files (README.md, etc.)
   - ✅ `package.json`, `tsconfig.json`, etc.
   - ✅ `.gitignore` (already excludes .env files)

### Step 5: Commit and Push
1. In GitHub Desktop, you'll see all your files listed
2. At the bottom, type commit message: "Initial commit - SlotSwapper app"
3. Click "Commit to main"
4. Click "Push origin" button (top right)
5. ✅ Done! Your code is now on GitHub

---

## Method 2: Using Git Commands (Command Line)

### Step 1: Install Git
1. Download: https://git-scm.com/download/win
2. Install with default options

### Step 2: Create Repository on GitHub
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `slotswapper`
4. **DO NOT** initialize with README
5. Click "Create repository"
6. Copy the repository URL (looks like: `https://github.com/yourusername/slotswapper.git`)

### Step 3: Open Terminal in Your Project
1. Open PowerShell or Command Prompt
2. Navigate to your project:
```bash
cd "C:\Users\asus\Desktop\code (1)"
```

### Step 4: Initialize Git and Push
Run these commands **one by one**:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - SlotSwapper app"

# Add your GitHub repository (replace with YOUR URL)
git remote add origin https://github.com/YOUR_USERNAME/slotswapper.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** You'll be asked for GitHub username and password (use Personal Access Token, not password)

---

## Method 3: Using GitHub Website (Drag & Drop - Quick Test)

### Step 1: Create Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `slotswapper`
4. Click "Create repository"

### Step 2: Upload Files
1. On the repository page, click "uploading an existing file"
2. Drag and drop your entire project folder
3. Type commit message: "Initial commit"
4. Click "Commit changes"

**Note:** This method is slower for large projects but works for quick uploads.

---

## Important: What NOT to Upload

Your `.gitignore` already excludes these, but double-check:

❌ **NEVER upload:**
- `.env` files (contains secrets!)
- `node_modules/` folders
- Personal API keys
- Passwords

✅ **Safe to upload:**
- All source code
- `package.json` files
- Configuration files (without secrets)
- Documentation files

---

## After Uploading: Connect to Render

1. Go to Render dashboard
2. Click "New +" → "Web Service"
3. Click "Connect account" (GitHub)
4. Select your repository: `slotswapper`
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables (see deployment guide)
7. Deploy!

---

## Troubleshooting

### "Repository not found"
- Make sure you're logged into GitHub
- Check repository name is correct
- Verify repository is Public (or you have access if Private)

### "Permission denied"
- Use Personal Access Token instead of password
- Generate token: GitHub → Settings → Developer settings → Personal access tokens

### "Large files error"
- Make sure `node_modules/` is in `.gitignore`
- If needed, remove from git: `git rm -r --cached node_modules`

### "Nothing to commit"
- Make sure you're in the right folder
- Check files are actually there: `dir` (Windows) or `ls` (Mac/Linux)

---

## Quick Checklist

- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Code uploaded to GitHub
- [ ] `.env` files NOT uploaded (check .gitignore)
- [ ] Repository is accessible
- [ ] Ready to connect to Render

