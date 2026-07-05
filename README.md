# 🎉 Event Management System

A full-stack, production-ready Event Management System built with **React (Vite)**, **Node.js (Express)**, **PostgreSQL**, and **Prisma ORM**.

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite                   |
| Backend    | Node.js + Express                 |
| Database   | PostgreSQL                        |
| ORM        | Prisma ORM (type-safe migrations) |
| Styling    | Vanilla CSS (custom design system)|

---

## 📁 Project Structure

```
Event Management System/
├── frontend/          # React (Vite) app
│   └── src/
│       ├── pages/     # Dashboard, Events, Venues, Bookings, etc.
│       ├── services/  # Axios API service layer
│       └── components/
├── backend/           # Node.js + Express API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── routes/       # API route definitions
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/    # Error handling etc.
│   │   └── config/       # Prisma client config
│   ├── seed.js           # Database seeder
│   └── .env.example      # Environment variable template
```

---

## ✅ Features & CRUD

| Module        | Create | Read | Update | Delete |
|---------------|--------|------|--------|--------|
| Categories    | ✅     | ✅   | ✅     | ✅     |
| Venues        | ✅     | ✅   | ✅     | ✅     |
| Events        | ✅     | ✅   | ✅     | ✅     |
| Participants  | ✅     | ✅   | ✅     | ✅     |
| Bookings      | ✅     | ✅   | ✅     | ✅     |

---

## ⚙️ Environment Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "Event Management System"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file from the example:
```bash
cp .env.example .env
```

Edit `.env` and set your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/event_management"
```

Run Prisma migrations to set up the database:
```bash
npx prisma migrate dev --name init
```

Generate Prisma client:
```bash
npx prisma generate
```

(Optional) Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

> Backend runs on: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

> Frontend runs on: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/categories`           | Get all categories       |
| POST   | `/api/categories`           | Create a category        |
| PUT    | `/api/categories/:id`       | Update a category        |
| DELETE | `/api/categories/:id`       | Delete a category        |
| GET    | `/api/venues`               | Get all venues           |
| POST   | `/api/venues`               | Create a venue           |
| PUT    | `/api/venues/:id`           | Update a venue           |
| DELETE | `/api/venues/:id`           | Delete a venue           |
| GET    | `/api/events`               | Get all events           |
| POST   | `/api/events`               | Create an event          |
| PUT    | `/api/events/:id`           | Update an event          |
| DELETE | `/api/events/:id`           | Delete an event          |
| GET    | `/api/participants`         | Get all participants     |
| POST   | `/api/participants`         | Create a participant     |
| PUT    | `/api/participants/:id`     | Update a participant     |
| DELETE | `/api/participants/:id`     | Delete a participant     |
| GET    | `/api/bookings`             | Get all bookings         |
| POST   | `/api/bookings`             | Create a booking         |
| PUT    | `/api/bookings/:id`         | Update a booking         |
| DELETE | `/api/bookings/:id`         | Delete a booking         |

---

## 🗄️ Database Schema (Prisma)

```prisma
model Category {
  id     Int     @id @default(autoincrement())
  name   String  @unique
  events Event[]
}

model Venue {
  id      Int     @id @default(autoincrement())
  name    String
  address String
  guests  Int
  events  Event[]
}

model Event {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  date        DateTime
  time        String?
  venueId     Int?
  categoryId  Int?
  venue       Venue?    @relation(...)
  category    Category? @relation(...)
  bookings    Booking[]
}

model Participant {
  id       Int       @id @default(autoincrement())
  name     String
  email    String    @unique
  phone    String?
  bookings Booking[]
}

model Booking {
  id            Int         @id @default(autoincrement())
  eventId       Int
  participantId Int
  bookingDate   DateTime    @default(now())
  event         Event       @relation(...)
  participant   Participant @relation(...)
}
```

---

## 🚀 Recommended Workflow

```
1. Add Categories  →  2. Add Venues  →  3. Create Events
4. Add Participants  →  5. Create Bookings
```

---

## 👩‍💻 Author

Built with ❤️ using React, Express, PostgreSQL & Prisma ORM.
