import { useState, useRef, useCallback } from 'react';
import { FaCamera, FaUpload, FaTimes, FaVideo, FaStop } from 'react-icons/fa';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const EnhancedSkinToneDetector = ({ onSkinToneDetected }) => {
  const { colors, glass, button } = useTheme();
  const [mode, setMode] = useState('upload'); // 'upload' or 'camera'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSkinTone, setDetectedSkinTone] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  // Enhanced skin tone categories with realistic color accuracy
  const skinToneCategories = {
    'very-light': { 
      name: 'Sangat Terang', 
      hex: '#FDBCB4', 
      description: 'Kulit sangat terang dengan undertone pink atau neutral',
      recommendations: ['Warna pastel', 'Biru muda', 'Pink soft', 'Lavender']
    },
    'light': { 
      name: 'Terang', 
      hex: '#EDC2A3', 
      description: 'Kulit terang dengan undertone warm atau cool',
      recommendations: ['Coral', 'Peach', 'Mint green', 'Soft yellow']
    },
    'light-medium': { 
      name: 'Terang Sedang', 
      hex: '#D1A3A4', 
      description: 'Kulit terang sedang dengan undertone beragam',
      recommendations: ['Dusty rose', 'Sage green', 'Warm grey', 'Soft brown']
    },
    'medium': { 
      name: 'Sedang', 
      hex: '#A77E58', 
      description: 'Kulit sedang dengan undertone warm atau olive',
      recommendations: ['Terracotta', 'Olive green', 'Burnt orange', 'Deep coral']
    },
    'medium-dark': { 
      name: 'Sedang Gelap', 
      hex: '#8D5524', 
      description: 'Kulit sedang gelap dengan undertone warm',
      recommendations: ['Rich jewel tones', 'Emerald', 'Ruby red', 'Deep purple']
    },
    'dark': { 
      name: 'Gelap', 
      hex: '#714426', 
      description: 'Kulit gelap dengan undertone rich warm',
      recommendations: ['Bright colors', 'Fuchsia', 'Electric blue', 'Sunshine yellow']
    },
    'very-dark': { 
      name: 'Sangat Gelap', 
      hex: '#3C2414', 
      description: 'Kulit sangat gelap dengan undertone deep warm',
      recommendations: ['Vibrant colors', 'Hot pink', 'Turquoise', 'Orange red']
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreviewUrl(imageSrc);
    setShowWebcam(false);    // Convert dataURL to blob
    fetch(imageSrc)
      .then(res => res.blob())
      .then(() => {
        // Image captured successfully
        console.log('Image captured and ready for processing');
      });
  }, [webcamRef]);

  const analyzeSkinTone = async () => {
    if (!previewUrl) return;

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
        const skinTone = detectSkinToneAdvanced(pixels, canvas.width, canvas.height);
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

  const detectSkinToneAdvanced = (pixels, width, height) => {
    const skinPixels = [];
    
    // Multiple sampling areas for better accuracy
    const samplingAreas = [
      { centerX: width * 0.5, centerY: height * 0.4, radius: Math.min(width, height) / 8 }, // Face center
      { centerX: width * 0.4, centerY: height * 0.45, radius: Math.min(width, height) / 12 }, // Left cheek
      { centerX: width * 0.6, centerY: height * 0.45, radius: Math.min(width, height) / 12 }, // Right cheek
      { centerX: width * 0.5, centerY: height * 0.35, radius: Math.min(width, height) / 15 }, // Forehead
    ];

    for (const area of samplingAreas) {
      const { centerX, centerY, radius } = area;
      
      for (let y = Math.max(0, centerY - radius); y < Math.min(height, centerY + radius); y++) {
        for (let x = Math.max(0, centerX - radius); x < Math.min(width, centerX + radius); x++) {
          // Check if pixel is within circular area
          const dx = x - centerX;
          const dy = y - centerY;
          if (dx * dx + dy * dy <= radius * radius) {
            const index = (Math.floor(y) * width + Math.floor(x)) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            
            if (isSkinPixelAdvanced(r, g, b)) {
              skinPixels.push({ r, g, b });
            }
          }
        }
      }
    }
    
    if (skinPixels.length < 10) {
      // Fallback: sample more broadly if not enough skin pixels found
      const centerX = Math.floor(width / 2);
      const centerY = Math.floor(height / 2);
      const radius = Math.min(width, height) / 4;

      for (let y = centerY - radius; y < centerY + radius; y++) {
        for (let x = centerX - radius; x < centerX + radius; x++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            const index = (y * width + x) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            
            if (isSkinPixelAdvanced(r, g, b)) {
              skinPixels.push({ r, g, b });
            }
          }
        }
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
    const classification = classifySkinToneAdvanced(finalR, finalG, finalB);
    
    // Update the hex color to reflect actual detected skin tone
    return {
      ...classification,
      hex: `rgb(${finalR}, ${finalG}, ${finalB})`,
      actualRGB: { r: finalR, g: finalG, b: finalB },
      confidence: skinPixels.length > 50 ? 'high' : skinPixels.length > 20 ? 'medium' : 'low'
    };
  };
  const isSkinPixelAdvanced = (r, g, b) => {
    // Enhanced skin detection algorithm using multiple criteria
    
    // Convert RGB to YCbCr for better skin detection
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
    const cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;
    
    // YCbCr-based skin detection (more accurate than RGB)
    const skinCondition1 = cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
    
    // RGB-based skin detection (enhanced)
    const skinCondition2 = (
      r > 95 && g > 40 && b > 20 &&
      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
      Math.abs(r - g) > 15 && r > g && r > b
    );
    
    // Additional skin tone specific checks
    const rg = r - g;
    const rb = r - b;
    
    const skinCondition3 = (
      r > g && r > b && // Red dominance
      rg > 15 && rb > 15 && // Sufficient red dominance
      !(r > 220 && g > 210 && b > 170) && // Exclude very bright/white areas
      !(r < 60 && g < 60 && b < 60) && // Exclude very dark areas
      y > 50 && y < 230 // Reasonable brightness range
    );
    
    // HSV-based additional check
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let hue = 0;
    if (delta !== 0) {
      if (max === r) {
        hue = ((g - b) / delta) % 6;
      } else if (max === g) {
        hue = (b - r) / delta + 2;
      } else {
        hue = (r - g) / delta + 4;
      }
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
    }
    
    const saturation = max === 0 ? 0 : delta / max;
    const value = max / 255;
    
    // Skin tone typically has hue between 0-50 degrees (red-orange-yellow range)
    const hueCondition = (hue >= 0 && hue <= 50) || (hue >= 300 && hue <= 360);
    const satCondition = saturation >= 0.15 && saturation <= 0.8;
    const valCondition = value >= 0.2 && value <= 0.95;
    
    // Combine multiple conditions for robust detection
    return (skinCondition1 || skinCondition2 || skinCondition3) && 
           hueCondition && satCondition && valCondition;
  };
  const classifySkinToneAdvanced = (r, g, b) => {
    // Enhanced classification using multiple color space analysis
    
    // Calculate perceptual brightness (more accurate than simple luminance)
    const brightness = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
    
    // Calculate ITA (Individual Typology Angle) for skin tone classification
    // ITA is widely used in dermatology and cosmetics
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
    setPreviewUrl(null);
    setDetectedSkinTone(null);
    setShowWebcam(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className={`${glass.background} ${glass.border} ${colors.text} backdrop-blur-sm rounded-lg p-6 shadow-lg`}>
      <h3 className={`text-lg font-bold mb-4 ${colors.text} flex items-center`}>
        <FaCamera className="mr-2 text-purple-600" />
        Deteksi Warna Kulit AI
      </h3>
      
      {/* Mode Selection */}
      <div className={`flex mb-4 ${colors.surfaceSecondary} rounded-lg p-1`}>
        <button
          onClick={() => {setMode('upload'); setShowWebcam(false);}}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'upload' 
              ? `${colors.surface} text-purple-600 shadow-sm` 
              : `${colors.textMuted} hover:text-purple-600`
          }`}
        >
          <FaUpload className="inline mr-2" />
          Upload Foto
        </button>
        <button
          onClick={() => setMode('camera')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'camera' 
              ? `${colors.surface} text-purple-600 shadow-sm` 
              : `${colors.textMuted} hover:text-purple-600`
          }`}
        >
          <FaVideo className="inline mr-2" />
          Ambil Foto
        </button>
      </div>
      
      <div className="space-y-4">        {/* Upload Mode */}
        {mode === 'upload' && !previewUrl && (
          <div 
            className={`border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors ${colors.surfaceSecondary}/50`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaUpload className="mx-auto text-4xl text-purple-400 mb-4" />
            <p className={`${colors.text} font-medium`}>Klik untuk upload foto wajah Anda</p>
            <p className={`text-sm ${colors.textMuted} mt-2`}>Format: JPG, PNG (Max 5MB)</p>
            <p className="text-xs text-purple-600 mt-1">🤖 AI akan menganalisis warna kulit secara otomatis</p>
          </div>
        )}

        {/* Camera Mode */}
        {mode === 'camera' && !previewUrl && (
          <div className="text-center">            {!showWebcam ? (
              <button
                onClick={() => setShowWebcam(true)}
                className={`${button.primary} py-3 px-6 rounded-lg transition-colors inline-flex items-center`}
              >
                <FaVideo className="mr-2" />
                Buka Kamera
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block rounded-lg overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 400,
                      height: 300,
                      facingMode: "user"
                    }}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={capture}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📸 Ambil Foto
                  </button>
                  <button
                    onClick={() => setShowWebcam(false)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaStop className="inline mr-1" />
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {/* Preview */}
        {previewUrl && (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full max-w-sm mx-auto rounded-lg shadow-md border-2 border-purple-200"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
            >
              <FaTimes />
            </button>
          </div>
        )}
          {previewUrl && !detectedSkinTone && (
          <button
            onClick={analyzeSkinTone}
            disabled={isLoading}
            className={`w-full ${button.primary} py-3 px-4 rounded-lg transition-all disabled:opacity-50 font-medium`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                🤖 AI Menganalisis...
              </span>
            ) : (
              '🎨 Analisis Warna Kulit'
            )}
          </button>
        )}
          {detectedSkinTone && (
          <div className={`bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 ${colors.border}`}>
            <h4 className={`font-semibold ${colors.text} mb-3 flex items-center`}>
              🎯 Hasil Deteksi AI:
            </h4>
            <div className="flex items-center space-x-4 mb-3">
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: detectedSkinTone.hex }}
                ></div>
                {detectedSkinTone.confidence && (
                  <div className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-bold ${
                    detectedSkinTone.confidence === 'high' ? 'bg-green-100 text-green-800' :
                    detectedSkinTone.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {detectedSkinTone.confidence === 'high' ? '✓' : 
                     detectedSkinTone.confidence === 'medium' ? '~' : '!'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-lg ${colors.text}`}>{detectedSkinTone.name}</p>
                <p className={`text-sm ${colors.textMuted}`}>{detectedSkinTone.description}</p>
                {detectedSkinTone.actualRGB && (
                  <p className={`text-xs ${colors.textMuted} mt-1`}>
                    Warna terdeteksi: RGB({detectedSkinTone.actualRGB.r}, {detectedSkinTone.actualRGB.g}, {detectedSkinTone.actualRGB.b})
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-3">
              <p className={`font-medium text-sm ${colors.text} mb-2`}>🎨 Rekomendasi Warna:</p>
              <div className="flex flex-wrap gap-2">
                {detectedSkinTone.recommendations.map((color, index) => (
                  <span
                    key={index}
                    className={`${colors.surface} px-3 py-1 rounded-full text-xs font-medium text-purple-700 ${colors.border}`}
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={clearImage}
              className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center transition-colors duration-200"
            >
              🔄 Coba Lagi
            </button>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

EnhancedSkinToneDetector.propTypes = {
  onSkinToneDetected: PropTypes.func.isRequired
};

export default EnhancedSkinToneDetector;
