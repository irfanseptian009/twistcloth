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

  // Enhanced skin tone categories with better color accuracy
  const skinToneCategories = {
    'very-light': { 
      name: 'Sangat Terang', 
      hex: '#F7E7CE', 
      description: 'Kulit sangat terang dengan undertone pink atau neutral',
      recommendations: ['Warna pastel', 'Biru muda', 'Pink soft', 'Lavender']
    },
    'light': { 
      name: 'Terang', 
      hex: '#F0D5A8', 
      description: 'Kulit terang dengan undertone warm atau cool',
      recommendations: ['Coral', 'Peach', 'Mint green', 'Soft yellow']
    },
    'light-medium': { 
      name: 'Terang Sedang', 
      hex: '#E8C5A0', 
      description: 'Kulit terang sedang dengan undertone beragam',
      recommendations: ['Dusty rose', 'Sage green', 'Warm grey', 'Soft brown']
    },
    'medium': { 
      name: 'Sedang', 
      hex: '#D4A574', 
      description: 'Kulit sedang dengan undertone warm atau olive',
      recommendations: ['Terracotta', 'Olive green', 'Burnt orange', 'Deep coral']
    },
    'medium-dark': { 
      name: 'Sedang Gelap', 
      hex: '#C8956D', 
      description: 'Kulit sedang gelap dengan undertone warm',
      recommendations: ['Rich jewel tones', 'Emerald', 'Ruby red', 'Deep purple']
    },
    'dark': { 
      name: 'Gelap', 
      hex: '#A67C5A', 
      description: 'Kulit gelap dengan undertone rich warm',
      recommendations: ['Bright colors', 'Fuchsia', 'Electric blue', 'Sunshine yellow']
    },
    'very-dark': { 
      name: 'Sangat Gelap', 
      hex: '#8B4513', 
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
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const radius = Math.min(width, height) / 6;

    // Focus on center area where face is likely to be
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
    
    if (skinPixels.length === 0) {
      return skinToneCategories['medium']; // Default fallback
    }
    
    // Calculate average skin color
    const avgR = Math.round(skinPixels.reduce((sum, p) => sum + p.r, 0) / skinPixels.length);
    const avgG = Math.round(skinPixels.reduce((sum, p) => sum + p.g, 0) / skinPixels.length);
    const avgB = Math.round(skinPixels.reduce((sum, p) => sum + p.b, 0) / skinPixels.length);
    
    // Classify skin tone based on brightness and color values
    return classifySkinToneAdvanced(avgR, avgG, avgB);
  };
  const isSkinPixelAdvanced = (r, g, b) => {
    // Enhanced skin detection algorithm
    const rg = r - g;
    
    return (
      r > 95 && g > 40 && b > 20 &&
      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
      Math.abs(rg) > 15 && r > g && r > b &&
      !(r > 220 && g > 210 && b > 170) // Exclude very bright/white areas
    );
  };
  const classifySkinToneAdvanced = (r, g, b) => {
    // Calculate brightness
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
    
    // Enhanced classification based on brightness
    if (brightness > 200) return skinToneCategories['very-light'];
    if (brightness > 180) return skinToneCategories['light'];
    if (brightness > 160) return skinToneCategories['light-medium'];
    if (brightness > 140) return skinToneCategories['medium'];
    if (brightness > 120) return skinToneCategories['medium-dark'];
    if (brightness > 100) return skinToneCategories['dark'];
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
              <div 
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: detectedSkinTone.hex }}
              ></div>
              <div className="flex-1">
                <p className={`font-medium text-lg ${colors.text}`}>{detectedSkinTone.name}</p>
                <p className={`text-sm ${colors.textMuted}`}>{detectedSkinTone.description}</p>
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
