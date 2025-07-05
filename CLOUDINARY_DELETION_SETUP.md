# Cloudinary File Deletion Setup Guide

## Masalah yang Terjadi

Saat ini, penghapusan file dari Cloudinary tidak berfungsi karena operasi penghapusan memerlukan **API Key** dan **API Secret** yang hanya bisa digunakan secara aman dari sisi server (backend), bukan dari frontend/client.

## Mengapa Penghapusan Gagal?

1. **Keamanan**: API credentials Cloudinary tidak boleh diekspos di frontend
2. **Authentication**: Cloudinary memerlukan signed request untuk operasi penghapusan
3. **Client-side Limitation**: Browser tidak bisa melakukan operasi penghapusan langsung

## Solusi yang Telah Diimplementasikan

### 1. Fallback Queueing System
- File yang gagal dihapus akan disimpan dalam **queue** (localStorage)
- Admin dapat melihat daftar file yang perlu dihapus manual
- Tersedia interface untuk copy public_id dan URL file

### 2. Enhanced Error Handling
- Sistem akan mencoba penghapusan otomatis terlebih dahulu
- Jika gagal, file akan masuk ke pending deletion queue
- User tetap mendapat feedback yang informatif

### 3. Admin Dashboard
- Komponen `CloudinaryCleanup` untuk management file cleanup
- Dapat diakses melalui Admin Dashboard
- Menampilkan pending deletions dengan instruksi lengkap

## Setup Server-Side Deletion (Rekomendasi)

### 1. Backend Setup (Node.js + Express)

```javascript
// Install Cloudinary SDK
npm install cloudinary

// server.js
const express = require('express');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: 'duk8twato',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

const app = express();
app.use(express.json());

// Endpoint untuk menghapus single file
app.delete('/api/cloudinary/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'File not found or already deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint untuk menghapus multiple files
app.delete('/api/cloudinary/delete-batch', async (req, res) => {
  try {
    const { publicIds } = req.body;
    const result = await cloudinary.api.delete_resources(publicIds);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### 2. Frontend Integration

```javascript
// utils/api.js
const API_BASE = 'http://localhost:3001/api';

export const deleteFileFromServer = async (publicId) => {
  try {
    const response = await fetch(`${API_BASE}/cloudinary/delete/${publicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export const deleteBatchFromServer = async (publicIds) => {
  try {
    const response = await fetch(`${API_BASE}/cloudinary/delete-batch`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicIds }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting files:', error);
    return false;
  }
};
```

### 3. Update ProductSlice

```javascript
// Ganti import
import { deleteFileFromServer, deleteBatchFromServer } from '../../../utils/api';

// Update deleteItem thunk
export const deleteItem = createAsyncThunk('items/deleteItem', async (id, { getState }) => {
  try {
    // Delete from Firestore first
    await deleteDoc(doc(db, 'items', id));
    
    // Get item data for cleanup
    const state = getState();
    const item = state.items.items.find(item => item.id === id);
    
    if (item) {
      const publicIds = [];
      
      // Collect public IDs
      if (item.image) publicIds.push(extractPublicIdFromUrl(item.image));
      if (item.additionalImages) {
        item.additionalImages.forEach(url => {
          const publicId = extractPublicIdFromUrl(url);
          if (publicId) publicIds.push(publicId);
        });
      }
      if (item.model3D) publicIds.push(extractPublicIdFromUrl(item.model3D));
      
      // Delete from server
      if (publicIds.length > 0) {
        const success = await deleteBatchFromServer(publicIds);
        if (success) {
          console.log('Files deleted successfully from Cloudinary');
        } else {
          console.warn('Some files could not be deleted');
        }
      }
    }
    
    return id;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
});
```

## Environment Variables

Buat file `.env` di root backend:

```env
CLOUDINARY_CLOUD_NAME=duk8twato
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Mendapatkan API Credentials

1. Login ke [Cloudinary Console](https://console.cloudinary.com/)
2. Go to **Settings** → **API Keys**
3. Copy **API Key** dan **API Secret**
4. Paste ke file `.env` backend

## Manual Cleanup (Sementara)

Jika belum setup backend, bisa hapus manual:

1. Buka Admin Dashboard
2. Lihat section "Cloudinary Cleanup Manager"
3. Copy public_id dari file yang ingin dihapus
4. Login ke Cloudinary Console
5. Go to **Media Library**
6. Search dengan public_id
7. Delete file secara manual

## Testing

### Test Backend Endpoint:

```bash
# Test single deletion
curl -X DELETE http://localhost:3001/api/cloudinary/delete/sample_public_id

# Test batch deletion
curl -X DELETE http://localhost:3001/api/cloudinary/delete-batch \
  -H "Content-Type: application/json" \
  -d '{"publicIds": ["public_id_1", "public_id_2"]}'
```

## Monitoring

- Cek console browser untuk log deletion attempts
- Monitor Admin Dashboard untuk pending deletions
- Setup log monitoring di backend untuk track deletion success/failure

## Best Practices

1. **Backup**: Selalu backup file penting sebelum mass deletion
2. **Validation**: Validate public_id sebelum deletion
3. **Retry Logic**: Implement retry untuk failed deletions
4. **Monitoring**: Setup monitoring untuk track file cleanup
5. **Security**: Jangan pernah expose API credentials di frontend

## Troubleshooting

### File Tidak Terhapus
- Cek apakah public_id benar
- Verify API credentials
- Cek network connectivity
- Periksa Cloudinary quota limits

### Queue Penuh
- Process pending deletions secara berkala
- Implement cleanup scheduler
- Monitor storage usage

### Error 401 (Unauthorized)
- Periksa API key & secret
- Verify request signature
- Check timestamp validity

## Next Steps

1. Setup backend server dengan endpoints di atas
2. Configure environment variables
3. Test deletion endpoints
4. Update frontend untuk gunakan server endpoints
5. Monitor dan maintenance berkala

Dengan setup ini, penghapusan file dari Cloudinary akan berjalan dengan aman dan reliable.
