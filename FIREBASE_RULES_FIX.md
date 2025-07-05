# 🛡️ Firebase Security Rules Fix

## ❌ Masalah
Error: `FirebaseError: Missing or insufficient permissions` saat mencoba set/update role user di Firestore.

## ✅ Solusi

### 1. Update Firestore Security Rules

Buka **Firebase Console → Firestore Database → Rules** dan ganti dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rules untuk collection users
    match /users/{userId} {
      // User bisa read/write dokumen mereka sendiri
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Alternatif: Izinkan semua authenticated user (untuk development)
      // allow read, write: if request.auth != null;
    }
    
    // Rules untuk collection lain (sesuaikan kebutuhan)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Klik **Publish** untuk menyimpan rules

---

## 🧪 Testing Steps

Setelah update rules:

1. **Reload aplikasi** (refresh browser)
2. **Buka Console Browser** (F12) untuk melihat debug logs
3. **Coba login/signup** dengan email admin: `admin!@gmail.com`
4. **Lihat logs di console**, should see:
   ```
   🔍 setUserRole called with: { userId: "...", userEmail: "admin!@gmail.com", role: null }
   🔍 Role check: { shouldBeAdmin: true, finalRole: "admin", ... }
   ✅ Role updated in Firestore
   🎯 Final role returned: admin
   ```

5. **Verifikasi redirect** ke `/admin` dashboard

---

## 🔧 Alternative Rules (Lebih Permisif untuk Development)

Jika masih bermasalah, gunakan rules ini untuk testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // HANYA UNTUK DEVELOPMENT - jangan gunakan di production
    allow read, write: if true;
  }
}
```

⚠️ **PERINGATAN:** Rules di atas mengizinkan semua akses. Hanya untuk development!

---

## 📋 Checklist Debugging

- [ ] Firebase rules sudah diupdate dan dipublish
- [ ] Browser sudah di-refresh
- [ ] Console browser menampilkan debug logs
- [ ] Email yang digunakan ada di `DEFAULT_ADMIN_EMAILS`
- [ ] Tidak ada error Firebase permissions di console

---

**Jika masih bermasalah setelah langkah di atas, check:**
1. Internet connection
2. Firebase project configuration
3. Firestore database sudah aktif (bukan Realtime Database)
