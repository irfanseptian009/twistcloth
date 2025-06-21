import { useState, useRef } from 'react';
import { FaCamera, FaUpload, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const SkinToneDetector = ({ onSkinToneDetected }) => {
  const { colors, glass, button } = useTheme();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSkinTone, setDetectedSkinTone] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Skin tone categories based on common classification
  const skinToneCategories = {
    'very-light': { name: 'Sangat Terang', hex: '#F7E7CE', description: 'Kulit sangat terang dengan undertone pink atau neutral' },
    'light': { name: 'Terang', hex: '#F0D5A8', description: 'Kulit terang dengan undertone warm atau cool' },
    'light-medium': { name: 'Terang Sedang', hex: '#E8C5A0', description: 'Kulit terang sedang dengan undertone beragam' },
    'medium': { name: 'Sedang', hex: '#D4A574', description: 'Kulit sedang dengan undertone warm atau olive' },
    'medium-dark': { name: 'Sedang Gelap', hex: '#C8956D', description: 'Kulit sedang gelap dengan undertone warm' },
    'dark': { name: 'Gelap', hex: '#A67C5A', description: 'Kulit gelap dengan undertone rich warm' },
    'very-dark': { name: 'Sangat Gelap', hex: '#8B4513', description: 'Kulit sangat gelap dengan undertone deep warm' }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const analyzeSkinTone = async () => {
    if (!image) return;

    setIsLoading(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Analyze pixels to find dominant skin tone
        const skinTone = detectSkinTone(pixels);
        setDetectedSkinTone(skinTone);
        onSkinToneDetected(skinTone);
        setIsLoading(false);
      };
      
      img.src = previewUrl;
    } catch (error) {
      console.error('Error analyzing skin tone:', error);
      setIsLoading(false);
    }
  };

  const detectSkinTone = (pixels) => {
    let totalR = 0, totalG = 0, totalB = 0;
    let skinPixelCount = 0;
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Basic skin detection algorithm
      if (isSkinPixel(r, g, b)) {
        totalR += r;
        totalG += g;
        totalB += b;
        skinPixelCount++;
      }
    }
    
    if (skinPixelCount === 0) {
      return skinToneCategories['medium']; // Default fallback
    }
    
    // Calculate average skin color
    const avgR = Math.round(totalR / skinPixelCount);
    const avgG = Math.round(totalG / skinPixelCount);
    const avgB = Math.round(totalB / skinPixelCount);
    
    // Classify skin tone based on brightness and color values
    return classifySkinTone(avgR, avgG, avgB);
  };

  const isSkinPixel = (r, g, b) => {
    // Simple skin detection based on RGB values
    // This is a basic algorithm and can be improved
    return (
      r > 95 && g > 40 && b > 20 &&
      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
      Math.abs(r - g) > 15 && r > g && r > b
    );
  };

  const classifySkinTone = (r, g, b) => {
    // Calculate brightness
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
    
    // Classify based on brightness levels
    if (brightness > 200) return skinToneCategories['very-light'];
    if (brightness > 180) return skinToneCategories['light'];
    if (brightness > 160) return skinToneCategories['light-medium'];
    if (brightness > 140) return skinToneCategories['medium'];
    if (brightness > 120) return skinToneCategories['medium-dark'];
    if (brightness > 100) return skinToneCategories['dark'];
    return skinToneCategories['very-dark'];
  };

  const clearImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setDetectedSkinTone(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className={`${glass.background} ${glass.border} ${colors.text} backdrop-blur-sm rounded-lg p-6 shadow-lg`}>
      <h3 className={`text-lg font-bold mb-4 ${colors.text} flex items-center`}>
        <FaCamera className="mr-2 text-purple-600" />
        Deteksi Warna Kulit
      </h3>
      
      <div className="space-y-4">
        {!previewUrl ? (
          <div 
            className={`border-2 border-dashed ${colors.border} rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaUpload className="mx-auto text-4xl text-purple-400 mb-4" />
            <p className={`${colors.text} font-medium`}>Klik untuk upload foto wajah Anda</p>
            <p className={`text-sm ${colors.textMuted} mt-2`}>Format: JPG, PNG (Max 5MB)</p>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full max-w-sm mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
          {previewUrl && !detectedSkinTone && (
          <button
            onClick={analyzeSkinTone}
            disabled={isLoading}
            className={`w-full ${button.primary} py-2 px-4 rounded-lg transition-colors disabled:opacity-50`}
          >
            {isLoading ? 'Menganalisis...' : 'Analisis Warna Kulit'}
          </button>
        )}
          {detectedSkinTone && (
          <div className={`${colors.surfaceSecondary} rounded-lg p-4 ${colors.border}`}>
            <h4 className={`font-semibold ${colors.text} mb-2`}>Hasil Deteksi:</h4>
            <div className="flex items-center space-x-3">
              <div 
                className={`w-12 h-12 rounded-full border-2 ${colors.border}`}
                style={{ backgroundColor: detectedSkinTone.hex }}
              ></div>
              <div>
                <p className={`font-medium ${colors.text}`}>{detectedSkinTone.name}</p>
                <p className={`text-sm ${colors.textMuted}`}>{detectedSkinTone.description}</p>
              </div>
            </div>
            <button
              onClick={clearImage}
              className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors duration-200"
            >
              Upload foto baru
            </button>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

SkinToneDetector.propTypes = {
  onSkinToneDetected: PropTypes.func.isRequired
};

export default SkinToneDetector;
