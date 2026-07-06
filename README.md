# CareConnect - Doctor Appointment Booking System

CareConnect is a modern, full-stack doctor appointment scheduling platform. It features a complete booking interface for patients, a private dashboard for doctors to review and finalize appointments, and an administrative control panel to manage doctor listings, system stats, and bookings.

---

## 🏗 Project Architecture & Structure

The repository is organized as a monorepo containing distinct backend and frontend subsystems:

```text
CareConnect/
├── backend/                       # Express.js REST API Server
│   ├── config/                    # Mongoose database, Cloudinary, and Mailer API setups
│   ├── controllers/               # API endpoint route logic (User, Doctor, Admin)
│   ├── middleware/                # JWT Auth Guards (User, Doctor, Admin)
│   ├── models/                    # MongoDB schemas (Doctor, User, Appointment)
│   └── templates/                 # HTML templates for automated emails
│
└── careConnect-frontend/          # React.js SPA (Vite)
    ├── src/
    │   ├── context/               # Global state contexts (AppContext, AdminContext, DoctorContext)
    │   ├── components/            # Reusable UI widgets (navbars, modals, loaders)
    │   ├── pages/                 # Patient-facing views (Home, Doctors list, Profile, Booking)
    │   └── dashboard-pages/       # Admin and Doctor dashboard interfaces
```

---

## 🌟 Key Features

### 1. Patient Portal (Frontend & Backend)
* **Authentication**: Email/password registration and logins secured with JWT.
* **Profile Management**: Upload custom profile avatars (via Cloudinary) and edit contact details.
* **Doctor Search & Filtering**: Browse doctors filtered by specialization (e.g., General Physician, Dermatologist, Pediatrician).
* **Interactive Slot Booking**: Select dynamic slot dates and times. The booking button has a secure loading state and redirects patients automatically to their appointments view upon completion.
* **My Appointments Page**: Track status (Pending, Completed, Cancelled), cancel bookings, and pay online.
* **Razorpay Online Payments**: Built-in order creation and signature verification verification routines.

### 2. Doctor Dashboard (Frontend & Backend)
* **Authentication**: Dedicated login flow for doctors.
* **Appointment Tracking**: List assigned patient appointments with dates, fees, and slot timings.
* **State Updates**: Single-click buttons to mark appointments as **Completed** or **Cancelled**.
* **Dashboard Analytics**: Real-time stats counting total earnings, count of unique patients, and total appointments.
* **Profile Settings**: Control consultation fees, availability flags, and clinic addresses.

### 3. Admin Panel (Frontend & Backend)
* **Doctor Listings Management**: Add new doctors with degree parameters, consultation fees, profile images, and bios; delete doctors instantly.
* **System-wide Appointments Monitor**: Global list showing all patient appointments, including cancellations.
* **Admin Dashboard Analytics**: Counters summing total active doctors, registered patients, total appointments, and a feed of the latest bookings.

### 4. Background Email Service
* **Non-blocking Operations**: Email actions run asynchronously without blocking API responses. Patients and doctors get instant UI updates while SMTP operations run concurrently.
* **Resend HTTP Mailer**: Utilizes Resend's REST endpoint over port 443, bypassing outbound SMTP port blocks (ports 25, 465, 587) enforced by hosting providers like Render.
* **Rich Email Templates**: Includes automated HTML emails notifying users on:
  * Appointment confirmations.
  * Patient, doctor, or admin cancellations.
  * Post-visit completion notes.

---

## ⚙️ Environment Configurations

Before starting the applications, configure the following `.env` files in their respective folders:

### 1. Backend Config: `backend/.env`
Create a `.env` file inside the `backend` folder with these keys:

```env
# Server Port
PORT=4000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/careconnect

# Security
JWT_SECRET=your_jwt_secret_token_here

# Cloudinary (Image Storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR

# Email Config (Resend API)
RESEND_API_KEY=re_your_api_key_here
MAIL_FROM=onboarding@resend.dev
```

### 2. Frontend Config: `careConnect-frontend/.env`
Create a `.env` file inside the `careConnect-frontend` folder:

```env
# Backend API Base URL
VITE_BACKEND_URL=http://localhost:4000

# Razorpay Key
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Step 1: Install Dependencies
Run the install command inside **both** folder directories:

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../careConnect-frontend
npm install
```

### Step 2: Run Backend Server
Inside the `backend` directory, run:
```bash
npm start
```
*The server will start on [http://localhost:4000](http://localhost:4000).*

### Step 3: Run Frontend Development Server
Inside the `careConnect-frontend` directory, run:
```bash
npm run dev
```
*The development server will boot on [http://localhost:5173](http://localhost:5173).*
