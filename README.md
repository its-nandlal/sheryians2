
# 🚀 sheryians2

A modern **full-stack web application** built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**.

This project demonstrates scalable architecture using **Server Components**, **Server Actions**, **Prisma ORM**, authentication, payments, media uploads, charts, animations, and modern UI patterns.

---

## ✨ Tech Stack

- **Next.js 16.1.1** (App Router)
- **React 19**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL (pg)**
- **Tailwind CSS v4**
- **Radix UI**
- **Better Auth**
- **TanStack React Query**
- **Zustand**
- **ImageKit**
- **Razorpay**
- **Framer Motion**
- **Recharts**

---

## 📦 Dependencies

### 🎨 UI & Styling
- tailwindcss  
- tailwind-merge  
- clsx  
- class-variance-authority  

### 🧩 UI Components (Radix)
- @radix-ui/react-accordion  
- @radix-ui/react-dialog  
- @radix-ui/react-dropdown-menu  
- @radix-ui/react-alert-dialog  
- @radix-ui/react-select  
- @radix-ui/react-label  
- @radix-ui/react-slot  

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

### ⚡ State Management
- zustand  

### 🔁 Server State / Caching
- @tanstack/react-query  

---

## 🧭 Scripts

```bash
npm run dev      # Start development server
npm run build    # prisma generate + next build
npm start        # Run production build
npm run lint     # ESLint
````

### ⚙ Special Build Logic

* `postinstall → prisma generate`

Ensures Prisma client is auto-generated after install.

---

## 🏗 Architecture Decisions

### ✅ Next.js App Router

✔ Server Components
✔ Nested Layouts
✔ Parallel Routes
✔ Streaming
✔ Optimized Rendering

---

### ✅ Server Actions

Used instead of traditional API routes.

✔ Less boilerplate
✔ Secure server execution
✔ Direct DB mutations

Example:

```ts
"use server"

export async function createItem(data) {
  await prisma.item.create({ data })
}
```

---

### ✅ Prisma + PostgreSQL

✔ Type-safe queries
✔ Schema-based modeling
✔ Easy migrations

---

### ✅ React Query Strategy

| Scenario       | Approach          |
| -------------- | ----------------- |
| Initial Data   | Server Components |
| Client Updates | React Query       |
| Mutations      | Server Actions    |

---

### ✅ Zustand

Used for lightweight global UI state.

✔ Modals
✔ Cart / UI state
✔ Filters

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

Efficient pagination using Prisma:

```ts
skip: (page - 1) * limit
take: limit
```

✔ Optimized queries
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

App runs on:

```
http://localhost:3000
```

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

Validated using:

✔ Zod
✔ @t3-oss/env-nextjs

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
✅ Radix UI Components
✅ Charts (Recharts)
✅ Animations (Framer Motion)

---

## 🚀 Deployment

Recommended Platform:

**Vercel**

```bash
vercel deploy
```

---

## 👨‍💻 Author

**Nandlal Jangir**

---

## ⭐ Support

If you like this project:

🌟 Star the repo
🍴 Fork it
🧠 Share feedback

---

