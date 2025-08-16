/**
 * Canvas Screenshot Utility
 * Handles robust canvas screenshot capture with error handling and optimization
 */

export class CanvasScreenshotUtil {
  static async captureCanvas(canvasRef, options = {}) {
    const {
      format = 'image/png',
      quality = 1.0,
      width = null,
      height = null,
      backgroundColor = null
    } = options;

    if (!canvasRef?.current) {
      throw new Error('Canvas reference not found');
    }

    try {
      const canvas = canvasRef.current;
      
      // Wait for any pending renders
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      // Create a new canvas for processing if needed
      let targetCanvas = canvas;
      
      if (width || height || backgroundColor) {
        targetCanvas = document.createElement('canvas');
        const ctx = targetCanvas.getContext('2d');
        
        // Set dimensions
        targetCanvas.width = width || canvas.width;
        targetCanvas.height = height || canvas.height;
        
        // Add background color if specified
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
        }
        
        // Draw original canvas
        ctx.drawImage(canvas, 0, 0, targetCanvas.width, targetCanvas.height);
      }

      // Convert to data URL
      const dataURL = targetCanvas.toDataURL(format, quality);
      
      return {
        dataURL,
        blob: await this.dataURLToBlob(dataURL),
        width: targetCanvas.width,
        height: targetCanvas.height,
        format,
        size: this.getDataURLSize(dataURL)
      };

    } catch (error) {
      console.error('Canvas capture error:', error);
      throw new Error(`Failed to capture canvas: ${error.message}`);
    }
  }

  static async dataURLToBlob(dataURL) {
    return new Promise((resolve) => {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      resolve(new Blob([u8arr], { type: mime }));
    });
  }

  static getDataURLSize(dataURL) {
    // Calculate approximate size in bytes
    const base64Length = dataURL.split(',')[1].length;
    return Math.round((base64Length * 3) / 4);
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static async compressImage(dataURL, maxSizeKB = 500) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Calculate optimal dimensions to reduce file size
        let { width, height } = img;
        const maxDimension = 1200; // Max width or height
        
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw with compression
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to meet size requirement
        let quality = 0.9;
        let result = canvas.toDataURL('image/jpeg', quality);
        
        while (this.getDataURLSize(result) > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(result);
      };
      
      img.src = dataURL;
    });
  }
}

export default CanvasScreenshotUtil;