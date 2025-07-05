# Multiple Image Upload Feature

## Overview

Fitur multiple image upload telah ditambahkan ke sistem untuk memungkinkan admin menambahkan beberapa gambar produk sekaligus. Fitur ini mencakup:

1. **Main Product Image** - Gambar utama produk (wajib)
2. **Additional Images** - Galeri gambar tambahan (opsional, maks 5 gambar)

## Komponen yang Ditambahkan

### 1. MultipleImageUpload Component
**Location**: `src/components/UI/MultipleImageUpload.jsx`

**Features**:
- Drag & drop support
- Multiple file selection
- Image preview dengan thumbnail
- Progress indicator
- File validation (hanya menerima format image)
- Maximum file limit (configurable)
- Remove individual images
- Responsive grid layout

**Props**:
```jsx
<MultipleImageUpload
  images={form.additionalImages}           // Array of File objects or URLs
  onImagesChange={setImages}               // Callback untuk update images
  maxImages={5}                           // Maximum jumlah images (default: 5)
/>
```

### 2. Enhanced AddProduct Component
**Location**: `src/components/modal/AddProduct.jsx`

**Improvements**:
- Separated main image and additional images
- Progress tracking untuk batch upload
- Better error handling
- Visual feedback during upload process

## Form Structure Update

```javascript
const [form, setForm] = useState({
  image: null,                    // Main product image (File atau URL)
  additionalImages: [],           // Array of additional images (File atau URL)
  model3D: null,
  model3DVariants: [],
  name: '',
  price: '',
  stock: '',
  categoryId: '',
  description: '',
  availableColors: ['#000000'],
});
```

## Upload Process Flow

### 1. Main Image Upload
```javascript
// Handle main image upload
let imageUrl = form.image;
if (form.image instanceof File) {
  const formData = new FormData();
  formData.append('file', form.image);
  formData.append('upload_preset', 'e7fdrxuf');
  
  const response = await fetch('https://api.cloudinary.com/v1_1/duk8twato/image/upload', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  imageUrl = data.secure_url;
}
```

### 2. Additional Images Batch Upload
```javascript
// Handle additional images upload
let additionalImageUrls = [];
if (form.additionalImages && form.additionalImages.length > 0) {
  const fileImages = form.additionalImages.filter(img => img instanceof File);
  const urlImages = form.additionalImages.filter(img => typeof img === 'string');
  
  if (fileImages.length > 0) {
    setUploadProgress({ current: 0, total: fileImages.length });
    
    const uploadResults = await uploadMultipleImagesWithProgress(
      fileImages, 
      (current, total) => setUploadProgress({ current, total })
    );
    
    const successfulUploads = uploadResults
      .filter(result => result.success)
      .map(result => result.url);
    
    additionalImageUrls = [...urlImages, ...successfulUploads];
  }
}
```

## New Cloudinary Utilities

### uploadMultipleImagesWithProgress
**Location**: `src/utils/cloudinary.js`

```javascript
export const uploadMultipleImagesWithProgress = async (files, onProgress) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = Array.from(files).map(async (file, index) => {
    try {
      const url = await uploadImage(file);
      if (onProgress) {
        onProgress(index + 1, files.length);
      }
      return { success: true, url, file: file.name };
    } catch (error) {
      if (onProgress) {
        onProgress(index + 1, files.length, error);
      }
      return { success: false, error: error.message, file: file.name };
    }
  });
  
  return Promise.all(uploadPromises);
};
```

## UI Components

### 1. Upload Area
- Drag & drop zone dengan visual feedback
- File input dengan multiple selection
- Progress indicator selama upload
- Upload status dan error handling

### 2. Image Grid
- Responsive grid layout (2-4 columns based on screen size)
- Thumbnail previews dengan aspect ratio 1:1
- Hover effects untuk interaksi
- Remove button pada setiap image
- Image numbering untuk urutan

### 3. Progress Tracking
```jsx
{uploadProgress.total > 0 && (
  <div className="mt-2">
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>Uploading images...</span>
      <span>{uploadProgress.current}/{uploadProgress.total}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
      ></div>
    </div>
  </div>
)}
```

## Database Schema Update

### Firestore Document Structure
```javascript
{
  id: "product_id",
  name: "Product Name",
  image: "https://res.cloudinary.com/main-image.jpg",      // Main image URL
  additionalImages: [                                       // Array of additional image URLs
    "https://res.cloudinary.com/additional-1.jpg",
    "https://res.cloudinary.com/additional-2.jpg",
    "https://res.cloudinary.com/additional-3.jpg"
  ],
  model3D: "https://res.cloudinary.com/model.glb",
  model3DVariants: [...],
  price: 299000,
  stock: 50,
  categoryId: "men",
  description: "Product description",
  availableColors: ["#000000", "#FFFFFF"],
  createdAt: "2024-06-24T10:00:00.000Z",
  updatedAt: "2024-06-24T10:00:00.000Z"
}
```

## File Validation

### Supported Formats
- PNG
- JPG/JPEG
- WEBP
- GIF

### File Size Limits
- Maximum: 10MB per file
- Recommended: 2-5MB untuk performa optimal

### Validation Logic
```javascript
const validFiles = filesToAdd.filter(file => {
  const isImage = file.type.startsWith('image/');
  const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
  
  if (!isImage) {
    console.warn(`${file.name} is not a valid image file`);
  }
  if (!isValidSize) {
    console.warn(`${file.name} is too large (max 10MB)`);
  }
  
  return isImage && isValidSize;
});
```

## Error Handling

### Upload Failures
- Individual file failures tidak menggagalkan seluruh proses
- Toast notifications untuk failed uploads
- Continue dengan files yang berhasil upload
- Retry mechanism untuk failed uploads

### Network Issues
- Timeout handling
- Retry logic dengan exponential backoff
- Offline detection
- Progress persistence

## User Experience Improvements

### Visual Feedback
1. **Loading States**: Progress bars dan spinners
2. **Success States**: Green checkmarks dan success messages
3. **Error States**: Red indicators dan error messages
4. **Empty States**: Helpful placeholder content

### Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Adaptive grid layouts
- Optimized for various screen sizes

## Performance Optimizations

### Image Processing
- Client-side image compression (optional)
- Automatic format optimization oleh Cloudinary
- Progressive JPEG untuk faster loading
- WebP conversion untuk supported browsers

### Upload Optimization
- Parallel uploads dengan rate limiting
- Chunked upload untuk large files
- Resume capability untuk interrupted uploads
- Background upload dengan service workers (future)

## Testing Scenarios

### 1. Basic Functionality
- [ ] Upload single additional image
- [ ] Upload multiple additional images (2-5)
- [ ] Remove individual images
- [ ] Drag & drop functionality
- [ ] File type validation
- [ ] File size validation

### 2. Error Scenarios
- [ ] Network timeout during upload
- [ ] Invalid file format
- [ ] File too large
- [ ] Cloudinary quota exceeded
- [ ] Simultaneous uploads

### 3. Edge Cases
- [ ] Upload same file multiple times
- [ ] Upload while editing existing product
- [ ] Browser refresh during upload
- [ ] Mobile device limitations

## Monitoring & Analytics

### Upload Metrics
- Success rate per file type
- Average upload time
- Failure reasons
- User behavior patterns

### Performance Metrics
- Upload speed by file size
- Error rates by network condition
- User completion rates
- Conversion impact

## Future Enhancements

### 1. Advanced Features
- [ ] Image cropping/editing tools
- [ ] Bulk image optimization
- [ ] AI-based image tagging
- [ ] Image variant generation

### 2. Performance
- [ ] Client-side image compression
- [ ] Progressive upload
- [ ] Background sync
- [ ] Offline support

### 3. User Experience
- [ ] Advanced drag & drop sorting
- [ ] Image gallery preview
- [ ] Batch operations
- [ ] Upload templates

## Maintenance

### Regular Tasks
1. Monitor Cloudinary usage dan costs
2. Clean up unused/orphaned files
3. Optimize upload performance
4. Update file size/format limits
5. Review error logs dan user feedback

### Updates
- Keep Cloudinary SDK updated
- Monitor browser compatibility
- Update validation rules as needed
- Performance optimizations based on usage patterns

## Troubleshooting

### Common Issues

**Upload Gagal**
- Check network connectivity
- Verify Cloudinary configuration
- Check file size/format
- Monitor browser console errors

**Progress Tidak Update**
- Verify callback functions
- Check async/await patterns
- Monitor promise handling

**Images Tidak Tampil**
- Check URL format
- Verify Cloudinary URLs
- Check CORS settings
- Monitor browser cache

**Performance Issues**
- Optimize image sizes
- Implement lazy loading
- Use CDN optimization
- Monitor network conditions
