# Project Overview & Execution Architecture (`my.md`)

Yeh document aapke **AI Plant (AgriGuard)** project ki mukammal structure, file execution flow (konsi file pehle chalti hai aur baad mein konsi), aur har file ke andar majood data/purpose ko samjhati hai.

---

## 📌 1. Project Ka Khulasa (Project Summary)

Aapka project ek **Full-Stack Web Application** hai jo Plants (Poudon) ki bimariyon ko detect karne, plant catalog (directory) dekhne, aur scan history save karne ke liye banaya gaya hai.

* **Frontend**: React.js + Vite (User Interface)
* **Backend**: Node.js + Express.js (REST API Server)
* **Database**: PostgreSQL (Prisma ORM ke zariye query hota hai)

---

## 🚀 2. File Execution Flow (Konsi File Sab Se Pehle Chalti Hai?)

Project do main hisson mein divide hai: **Frontend** aur **Backend**.

### 🅰️ Frontend Flow (Browser Mein Website Kaise Load Hoti Hai):

1. 📄 `frontend/index.html`  
   **Sab se pehle** browser is file ko open karta hai. Is mein `<div id="root"></div>` majood hota hai jahan poori React app load hoti hai. Is se `src/main.jsx` link hota hai.
2. 📄 `frontend/src/main.jsx`  
   **Dusre number par** yeh JavaScript file chalti hai. Yeh React root create karti hai, `index.css` ko load karti hai, aur `App.jsx` ko Render karti hai.
3. 📄 `frontend/src/index.css`  
   **Teesre number par** global CSS styles load hotay hain jo poori app par apply hotay hain.
4. 📄 `frontend/src/App.jsx`  
   **Chauthe number par** yeh main component chalta hai jo Routing (`react-router-dom`) ko handle karta hai aur decide karta hai ke kon sa Page kis URL par dikhana hai.
5. 📄 `frontend/src/pages/*`  
   Routes ke mutabiq relevant page load hota hai:
   * `/` ya `/home` ➔ `HomePublic.jsx` (Landing Page)
   * `/dashboard` ➔ `Dashboard.jsx` (Plant scanner & detection system)
   * `/login` ➔ `Login.jsx`
   * `/register` ➔ `Register.jsx`
   * `/welcome` ➔ Boilerplate Home Page
6. 📄 `frontend/src/services/api.js`  
   Jab pages ko Backend se data chahiye hota hai (e.g. catalog fetch karna ya scan history save karna), toh yeh file Axios ke zariye backend (`http://localhost:5000/api`) ko request bhejti hai.

---

### 🅱️ Backend Flow (Server Kaise Start Hota Hai):

1. 📄 `backend/src/server.js`  
   **Sab se pehle** backend server ko chalane ke liye `node src/server.js` run kiya jata hai. Yeh `.env` file se Port read karta hai (default 5000) aur Express app ko sunna (listen karna) shuru karta hai.
2. 📄 `backend/src/app.js`  
   **Dusre number par** Express application setup hoti hai. Yeh CORS, JSON parser, base health route (`/`), aur sub-routes define karti hai.
3. 📄 `backend/src/config/prisma.js` & `backend/prisma/schema.prisma`  
   **Teesre number par** database client initialize hota hai jo database (PostgreSQL) ke sath connect rehta hai.
4. 📄 `backend/src/routes/*`  
   API Endpoints define kiye gaye hain:
   * `/api/plant-catalog` ➔ `plantCatalogRoutes.js`
   * `/api/scan-history` ➔ `scanHistoryRoutes.js`
5. 📄 `backend/src/controllers/*`  
   Routes requests ko Controllers tak bhejte hain jo business logic chalate hain aur database se data fetch/insert karte hain:
   * `plantCatalogController.js` ➔ Plant catalog get karna.
   * `scanHistoryController.js` ➔ Scan history fetch aur save karna.

---

## 📁 3. Har Folder Aur File Mein Kya Data Hai (Detailed Folder Structure)

```text
AI Plant/
├── backend/                  # Server Code (Node.js/Express)
│   ├── prisma/
│   │   └── schema.prisma     # Database models (PlantCatalog, ScanHistory)
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js     # Prisma database client instance
│   │   ├── controllers/
│   │   │   ├── plantCatalogController.js  # Catalog DB logic
│   │   │   └── scanHistoryController.js   # History DB logic
│   │   ├── middleware/       # Custom Express middleware (if needed)
│   │   ├── routes/
│   │   │   ├── plantCatalogRoutes.js      # Catalog endpoints (/api/plant-catalog)
│   │   │   └── scanHistoryRoutes.js       # Scan history endpoints (/api/scan-history)
│   │   ├── app.js            # Express app configuration & middleware
│   │   └── server.js         # Backend server startup entry point
│   ├── .env                  # Environment variables (Database URL, Port)
│   ├── .env.example          # Sample env file template
│   ├── prisma.config.ts      # Prisma configuration settings
│   ├── seed.js               # Initial database population script
│   └── package.json          # Backend dependencies (express, @prisma/client, cors)
│
├── frontend/                 # Client Code (React + Vite)
│   ├── public/               # Public assets (icons, images)
│   ├── src/
│   │   ├── assets/           # Images (hero.png, react.svg, vite.svg)
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Main application views/pages
│   │   │   ├── Dashboard.jsx & Dashboard.css   # Main plant scanner & history UI
│   │   │   ├── HomePublic.jsx & HomePublic.css # Landing page UI
│   │   │   ├── Login.jsx & Login.css           # User login UI
│   │   │   ├── Register.jsx                    # User register UI
│   │   │   ├── PlantCatalog.jsx                # Plant catalog view UI
│   │   │   └── ScanHistory.jsx                 # History view UI
│   │   ├── services/
│   │   │   └── api.js        # API service to connect with Backend via Axios
│   │   ├── App.jsx           # Main React routes container
│   │   ├── App.css           # App layout styles
│   │   ├── index.css         # Global CSS styles
│   │   └── main.jsx          # React app DOM mounting point
│   ├── index.html            # Primary HTML page entry
│   ├── vite.config.js        # Vite build & server config
│   └── package.json          # Frontend dependencies (react, react-router-dom, axios)
│
├── README.md                 # Project introduction documentation
├── package-lock.json         # Root dependency lockfile
└── my.md                     # Aapki batayi hui yeh guide file
```

---

## 🗄️ 4. Database Schema (Prisma Models)

`backend/prisma/schema.prisma` mein 2 main models hain:

1. **`PlantCatalog`** (Plants directory info):
   * `id`: Unique ID
   * `commonName`: Aam naam (e.g. Aloe Vera, Neem)
   * `scientificName`: Scientific naam
   * `oxygenSupport`: Oxygen info
   * `advantages`: Faide
   * `disadvantages`: Nuqsanat
   * `humanBenefits`: Insani faide

2. **`ScanHistory`** (Users ke plant scans):
   * `id`: Unique ID
   * `plantName`: Detect hone wale poday ka naam
   * `sciName`: Scientific naam
   * `disease`: Detect hui bimari
   * `solution`: Bimari ka ilaj / recommendation
   * `date`: Scan ki date aur time
   * `imageUrl`: Plant ki photo (URL / Base64 string)

---

## 🔒 Note
**Aapke kisi bhi existing code file ko disturb ya change nahi kiya gaya hai.** Yeh file sirf aapki rehnumai aur project ko samajhne ke liye banayi gayi hai.
