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

  // Enhanced skin tone categories with realistic color accuracy
  const skinToneCategories = {
    'very-light': { name: 'Sangat Terang', hex: '#FDBCB4', description: 'Kulit sangat terang dengan undertone pink atau neutral' },
    'light': { name: 'Terang', hex: '#EDC2A3', description: 'Kulit terang dengan undertone warm atau cool' },
    'light-medium': { name: 'Terang Sedang', hex: '#D1A3A4', description: 'Kulit terang sedang dengan undertone beragam' },
    'medium': { name: 'Sedang', hex: '#A77E58', description: 'Kulit sedang dengan undertone warm atau olive' },
    'medium-dark': { name: 'Sedang Gelap', hex: '#8D5524', description: 'Kulit sedang gelap dengan undertone warm' },
    'dark': { name: 'Gelap', hex: '#714426', description: 'Kulit gelap dengan undertone rich warm' },
    'very-dark': { name: 'Sangat Gelap', hex: '#3C2414', description: 'Kulit sangat gelap dengan undertone deep warm' }
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
    const skinPixels = [];
    
    // Sample every 8th pixel for better performance while maintaining accuracy
    for (let i = 0; i < pixels.length; i += 32) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      if (isSkinPixel(r, g, b)) {
        skinPixels.push({ r, g, b });
      }
    }
    
    if (skinPixels.length === 0) {
      return skinToneCategories['medium']; // Default fallback
    }
    
    // Sort and use median values for more accurate color representation
    const sortedR = skinPixels.map(p => p.r).sort((a, b) => a - b);
    const sortedG = skinPixels.map(p => p.g).sort((a, b) => a - b);
    const sortedB = skinPixels.map(p => p.b).sort((a, b) => a - b);
    
    const medianIndex = Math.floor(skinPixels.length / 2);
    const medianR = sortedR[medianIndex];
    const medianG = sortedG[medianIndex];
    const medianB = sortedB[medianIndex];
    
    // Also calculate average for more stable results
    const avgR = Math.round(skinPixels.reduce((sum, p) => sum + p.r, 0) / skinPixels.length);
    const avgG = Math.round(skinPixels.reduce((sum, p) => sum + p.g, 0) / skinPixels.length);
    const avgB = Math.round(skinPixels.reduce((sum, p) => sum + p.b, 0) / skinPixels.length);
    
    // Use weighted combination of median and average
    const finalR = Math.round((medianR * 0.6) + (avgR * 0.4));
    const finalG = Math.round((medianG * 0.6) + (avgG * 0.4));
    const finalB = Math.round((medianB * 0.6) + (avgB * 0.4));
    
    // Return classification with actual detected color
    const classification = classifySkinTone(finalR, finalG, finalB);
    
    // Update the hex color to reflect actual detected skin tone
    return {
      ...classification,
      hex: `rgb(${finalR}, ${finalG}, ${finalB})`,
      actualRGB: { r: finalR, g: finalG, b: finalB }
    };
  };

  const isSkinPixel = (r, g, b) => {
    // Enhanced skin detection algorithm using multiple criteria
    
    // Convert RGB to YCbCr for better skin detection
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
    const cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;
    
    // YCbCr-based skin detection
    const skinCondition1 = cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
    
    // RGB-based skin detection (enhanced)
    const skinCondition2 = (
      r > 95 && g > 40 && b > 20 &&
      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
      Math.abs(r - g) > 15 && r > g && r > b &&
      !(r > 220 && g > 210 && b > 170) && // Exclude very bright areas
      y > 50 && y < 230 // Reasonable brightness range
    );
    
    return skinCondition1 || skinCondition2;
  };

  const classifySkinTone = (r, g, b) => {
    // Enhanced classification using perceptual brightness
    const brightness = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
    
    // Calculate ITA (Individual Typology Angle) for better classification
    const L = 116 * Math.pow((brightness / 255), 1/3) - 16;
    const b_lab = 200 * (Math.pow((b / 255), 1/3) - Math.pow((g / 255), 1/3));
    const ita = Math.atan(L / b_lab) * (180 / Math.PI);
    
    // Enhanced classification based on multiple factors
    if (brightness > 180 && ita > 55) return skinToneCategories['very-light'];
    if (brightness > 160 && ita > 41) return skinToneCategories['light'];
    if (brightness > 140 && ita > 28) return skinToneCategories['light-medium'];
    if (brightness > 120 && ita > 10) return skinToneCategories['medium'];
    if (brightness > 100 && ita > -30) return skinToneCategories['medium-dark'];
    if (brightness > 80) return skinToneCategories['dark'];
    
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
                {detectedSkinTone.actualRGB && (
                  <p className={`text-xs ${colors.textMuted} mt-1`}>
                    RGB({detectedSkinTone.actualRGB.r}, {detectedSkinTone.actualRGB.g}, {detectedSkinTone.actualRGB.b})
                  </p>
                )}
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
