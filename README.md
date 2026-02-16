<!-- 🔥 Animated Header Banner -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F2027,50:203A43,100:2C5364&height=200&section=header&text=sheryians2&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=35" />
</p>

<p align="center">
  <b>🚀 Modern Full-Stack Web Application</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css" />
</p>

<p align="center">
  A modern <b>full-stack web application</b> built with <b>Next.js 16</b>, <b>React 19</b>, and <b>TypeScript</b>.
</p>

---

## ✨ Overview

**sheryians2** is a production-style full-stack application showcasing:

✅ Scalable architecture  
✅ Server Components  
✅ Server Actions  
✅ Prisma ORM  
✅ Authentication  
✅ Payments  
✅ Media Uploads  
✅ Charts & Animations  

Designed with performance, clean UI, and maintainability in mind.

---

## 🎥 Demo / Preview

▶ **Project Walkthrough Video**  
https://youtu.be/8TEq_Ga9Epw

🔗 **GitHub Repository**  
https://github.com/its-nandlal/sheryians2

---

## 🧰 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript |
| **Database ORM** | Prisma |
| **Database** | PostgreSQL |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI |
| **Auth** | Better Auth |
| **Server State** | TanStack React Query |
| **State Management** | Zustand |
| **Media Upload** | ImageKit |
| **Payments** | Razorpay |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Theme** | next-themes |

---

## 📦 Key Dependencies

### 🎨 UI & Styling
- tailwindcss  
- tailwind-merge  
- clsx  
- class-variance-authority  

### 🧩 Radix UI Components
- react-accordion  
- react-dialog  
- react-dropdown-menu  
- react-alert-dialog  
- react-select  
- react-label  
- react-slot  

### 🧠 Forms & Validation
- react-hook-form  
- @hookform/resolvers  
- zod  

### 🔐 Authentication
- better-auth  

### 🗄 Database
- prisma  
- @prisma/client  
- @prisma/adapter-pg  
- pg  

### 🌐 Networking
- axios  

### 🖼 Media Upload
- imagekit  
- @imagekit/next  

### 💳 Payments
- razorpay  

### 📊 Charts
- recharts  

### 🎞 Animations
- framer-motion  

### 🌗 Theme
- next-themes  

### ⚡ State
- zustand  

### 🔁 Server State / Caching
- @tanstack/react-query  

---

## 🧭 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Prisma generate + Next.js build
npm start        # Run production build
npm run lint     # ESLint
````

### ⚙ Special Logic

`postinstall → prisma generate`

✔ Automatically generates Prisma Client after install.

---

## 🏗 Architecture Highlights

### ✅ Next.js App Router

✔ Server Components
✔ Nested Layouts
✔ Parallel Routes
✔ Streaming
✔ Optimized Rendering

---

### ✅ Server Actions

✔ Reduced API boilerplate
✔ Secure server execution
✔ Direct DB mutations

```ts
"use server"

export async function createItem(data) {
  await prisma.item.create({ data })
}
```

---

### ✅ Prisma + PostgreSQL

✔ Type-safe queries
✔ Schema-driven design
✔ Easy migrations

---

### ✅ Data Fetching Strategy

| Scenario       | Approach          |
| -------------- | ----------------- |
| Initial Load   | Server Components |
| Client Updates | React Query       |
| Mutations      | Server Actions    |

---

### ✅ Zustand

✔ Lightweight global UI state
✔ Ideal for modals, UI controls

---

### ✅ Radix UI

✔ Accessibility built-in
✔ Keyboard navigation
✔ Headless flexibility

---

## 🔁 CRUD Features

* Create
* Read
* Update
* Delete

Handled via:

✔ Prisma ORM
✔ Server Actions

---

## 📄 Pagination

```ts
skip: (page - 1) * limit
take: limit
```

✔ Efficient queries
✔ Better performance

---

## 🛠 Local Setup

```bash
git clone https://github.com/its-nandlal/sheryians2
cd sheryians2
npm install
npx prisma generate
npm run dev
```

🌐 App runs at:

[http://localhost:3000](http://localhost:3000)

---

## 🌍 Environment Variables

Create a `.env` file:

```
DATABASE_URL=
BETTER_AUTH_SECRET=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

✔ Validated using Zod + @t3-oss/env-nextjs

---

## ✨ Key Features

✅ Next.js 16 App Router
✅ Server Actions
✅ Prisma ORM
✅ PostgreSQL
✅ Authentication
✅ Razorpay Payments
✅ Image Upload (ImageKit CDN)
✅ Zustand State Management
✅ TanStack React Query
✅ Tailwind CSS v4
✅ Radix UI
✅ Recharts
✅ Framer Motion

---

## 🚀 Deployment

Recommended Platform: **Vercel**

```bash
vercel deploy
```

---

## 👨‍💻 Author

**Nick D Jangir**

---

## ⭐ Support

If you like this project:

🌟 Star the repo
🍴 Fork it
🧠 Share feedback

---


