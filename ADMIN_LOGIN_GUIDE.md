# 🔐 Admin Login & Setup Guide

## 📋 Overview
Sistem Role-Based Access Control (RBAC) telah diimplementasi dengan fitur:
- Auto-assignment role berdasarkan email
- Protected routes untuk admin dan customer
- Redirect otomatis berdasarkan role

## 👨‍💼 Cara Login Sebagai Admin

### Method 1: Gunakan Email Admin Default
Email berikut otomatis akan mendapat role `admin`:
- `admin@darknessmerch.com`
- `admin@gmail.com`

**Langkah-langkah:**
1. Buka aplikasi di browser
2. Pergi ke `/signup` untuk membuat akun baru atau `/signin` untuk login
3. Gunakan salah satu email admin di atas
4. Masukkan password yang diinginkan
5. Sistem akan otomatis set role sebagai `admin`
6. Setelah login, akan diarahkan ke `/admin` dashboard

### Method 2: Tambah Email Admin Baru
Jika ingin menambah email admin lain:

1. Edit file `src/utils/roleUtils.js`
2. Tambahkan email ke array `DEFAULT_ADMIN_EMAILS`:

```javascript
export const DEFAULT_ADMIN_EMAILS = [
  'admin@darknessmerch.com',
  'admin@gmail.com',
  'your-email@domain.com',  // <- Tambahkan di sini
];
```

## 🚀 Cara Menjalankan Aplikasi

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Buka Browser:**
   - Aplikasi akan berjalan di `http://localhost:5173`

3. **Test Login Admin:**
   - Pergi ke: `http://localhost:5173/signup`
   - Daftar dengan email: `admin@darknessmerch.com`
   - Password: `admin123` (atau password pilihan Anda)
   - Klik "Sign Up"

4. **Verifikasi Admin Access:**
   - Setelah login, akan otomatis redirect ke `/admin`
   - Coba akses `/admin/products` untuk melihat product management

## 🛡️ Protected Routes

### Admin Only Routes:
- `/admin` - Admin Dashboard
- `/admin/products` - Product Management
- Semua route di bawah `/admin/*`

### Customer Routes:
- `/` - Home Customer
- `/detail/:id` - Product Detail
- `/checkout` - Checkout (perlu login)

### Public Routes:
- `/signin` - Login
- `/signup` - Register
- `/demo` - Demo page

## 🔄 Role Assignment Logic

```javascript
// Auto role assignment berdasarkan email
const finalRole = isDefaultAdmin(userEmail) ? ROLES.ADMIN : ROLES.CUSTOMER;

// Redirect logic
- Admin → /admin
- Customer → /
```

## 🧪 Test Scenarios

### Test 1: Admin Login
1. Email: `admin@darknessmerch.com`
2. Password: `admin123`
3. Expected: Redirect ke `/admin`

### Test 2: Customer Login  
1. Email: `customer@test.com`
2. Password: `test123`
3. Expected: Redirect ke `/`

### Test 3: Route Protection
1. Login sebagai customer
2. Coba akses `/admin`
3. Expected: Redirect kembali ke `/`

## 📁 File Structure

```
src/
├── utils/
│   └── roleUtils.js          # Role management utilities
├── router/
│   ├── RoleBasedRoute.jsx    # Route protection components
│   └── routes.jsx            # Main routing configuration
├── store/auth/
│   └── authSlice.js          # Redux auth state + role
└── auth/
    ├── SignIn.jsx            # Login with role redirect
    └── SignUp.jsx            # Register with role assignment
```

## 🔧 Troubleshooting

### Issue: Role tidak ter-set
**Solution:** Check console untuk error Firestore, pastikan Firebase config benar

### Issue: Tidak redirect setelah login
**Solution:** Check Redux state, pastikan role tersimpan di user object

### Issue: Route protection tidak bekerja
**Solution:** Pastikan `RoleBasedRoute` components di-import dengan benar di routes.jsx

## 🎯 Quick Start Commands

```bash
# Clone dan setup
cd "d:\android studio\pgn-gas-oil"
npm install

# Start development
npm run dev

# Test admin login
# Browser: http://localhost:5173/signup
# Email: admin@darknessmerch.com
# Password: admin123
```

## ⚡ Features Implemented

✅ Auto role assignment berdasarkan email  
✅ Protected routes untuk admin/customer  
✅ Automatic redirect setelah login  
✅ Role persistence di Firestore  
✅ Redux state management untuk role  
✅ Route guards dan protection  
✅ Clean separation admin/customer areas  

**Status: 🟢 READY FOR USE**
