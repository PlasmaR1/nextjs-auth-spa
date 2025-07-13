###  Developers Manual
<div align="justify">
This project is a role-based content publishing platform built with Next.js, MySQL, and JWT authentication. 
It allows users to register, log in, and submit posts, which remain hidden until reviewed and approved by an administrator. 
The system ensures secure access control, separates admin and user interfaces, and supports deployment on modern cloud platforms like Railway and Vercel. 
It demonstrates the practical implementation of token-based authentication, Prisma ORM, and conditional rendering based on user roles.

###  System Overview


This is an application (SPA) built with Next.js App Router, using MySQL (via Prisma ORM) for data storage and JWT for authentication. 
Users can register, log in, and publish posts. Each post is marked as pending by default. 
An admin user, identified by a specific email, can access a protected admin panel to review and approve posts. 
Only approved posts are shown on the public homepage. The app includes token-based route protection, role-based access, 
and serverless API endpoints deployed via Railway.




### 📁 Project Structure

```text
nextjs-auth-spa/
├── app/
│   ├── api/
│   │   ├── approve/
│   │   │   └── [id]/
│   │   │       └── route.ts       # PATCH: Admin approves posts
│   │   ├── posts/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts       # DELETE: User deletes post by ID
│   │   │   └── route.ts           # GET approved posts, POST new post
│   │   ├── register/
│   │   │   └── route.ts           # POST: User registration with password hashing
│   │   ├── login/
│   │   │   └── route.ts           # POST: JWT login
│   │   └── unapproved-posts/
│   │       └── route.ts           # GET: Admin fetches unapproved posts
│   ├── home/
│   │   └── page.tsx               # Admin dashboard or welcome message
│   ├── register/
│   │   └── page.tsx               # Registration form
│   ├── login/
│   │   └── page.tsx               # Login form
│   ├── page.tsx                   # Public page showing approved posts
├── lib/
│   └── jwt.ts                     # (Optional) JWT utility functions
├── prisma/
│   ├── schema.prisma              # Prisma schema: User, Post, etc.
│   └── migrations/                # Auto-generated migration files
├── public/                        # Optional: static files like favicon or images
├── styles/
│   └── globals.css                # Global styles
├── .env                           # Environment variables (DATABASE_URL, JWT_SECRET)
├── .eslintrc.json                 # Linting rules
├── next.config.js or .ts         # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json
```



### Data model design


Data tables include:

User: contains id, email, password (encrypted)

Post: contains id, content, imageUrl, timestamp, userId , approved

The schema.prisma handles database creation/update. To update or insert new database attributes on locahost you need to update content at schema.prisma then simply type on command: npx prisma migrate dev -name- (Locahost only)


Database structure (Same as deployed)


Authentication

We use JSON Web Token (JWT) for authentication and bcryptjs for password encryption.

Global: JWT token authentication

Admin Function:

```text
app/api/login/route.ts

GET : finding approval status as false


app/api/approve/[id]/route.ts

PATCH : update approval states to True

User function:

app/api/posts/[id]/route.ts

DELETE: Delete the post with the specific ID 


app/api/posts/route.ts

GET : fetch all posts from MySQL
POST : post content to MySQL

app/api/register/route.ts

POST : Add user to MySQL

app/api/login/route.ts

POST : Compare username and password from MySQL

```

### Deployment Summary: nextjs-auth-spa on Railway 



1. Upload GitHub Repository
Push the project code to GitHub repository: 
https://github.com/PlasmaR1/nextjs-auth-spa

2. Create MySQL Database on Railway
- Railway workbench → New Project → Create → MySQL 
- Copy the full MySQL connection URL

3. Deploy the App
 -Project → Create → Deploy on Github Repo
- Create a new Railway project and link it to your GitHub repo
- Railway will auto-detect the Next.js framework and begin the build

4. Set Environment Variables in Railway
- DATABASE_URL: Paste the MySQL connection URL from step 2 
- JWT_SECRET: Use a secure secret string

5. Access Deployed App
- The website will be live 
- Assigned Railway URL: https://nextjs-auth-spa-production.up.railway.app/




### Summary



This project is a single-page application (SPA) built with Next.js, Tailwind CSS, Prisma, and MySQL, featuring JWT-based user authentication, secure post creation, and admin moderation.
Core Features:
Users can register and log in using a secure system with hashed passwords. After logging in, they can create posts with optional images. Posts are not immediately visible to the public; they must be approved by an admin via a dedicated admin panel. Only approved posts are displayed on the homepage. All API routes are protected using JWT, ensuring secure access to create or delete actions. The application is deployed on Railway, with environment-specific database configuration through Prisma.
Potential Future Enhancements:
This project just meets the basic requirement of the guideline description. For further development, these functions will be added in the future project

```text
Video upload to cloud storage like AWS S3 or Cloudinary


User profile pages with avatar, bio, and post history


Post editing functionality


Comment system


Rate limiting to prevent spam


Role-based access control (e.g., moderators)


Admin email notifications for pending posts

```
</div>





