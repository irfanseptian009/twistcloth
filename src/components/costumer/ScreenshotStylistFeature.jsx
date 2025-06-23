import React, { useState, useCallback } from 'react';
import { FaCamera, FaRobot, FaShare, FaDownload, FaTimes, FaMagic, FaEye, FaStar,  FaPalette, FaLightbulb, FaClock, FaGem } from 'react-icons/fa';
import { BiScreenshot, BiBot, BiTrendingUp,  } from 'react-icons/bi';
import { HiSparkles, HiColorSwatch, HiLightBulb } from 'react-icons/hi';
import { MdStyle, MdTune, MdAutoAwesome, MdPhotoCamera } from 'react-icons/md';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { CanvasScreenshotUtil } from '../../utils/CanvasScreenshotUtil';
import AIAnalysisProgress from './AIAnalysisProgress';

const ScreenshotStylistFeature = ({ 
  canvasRef, 
  product, 
  userSkinTone,
  onStylistResponse 
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [ setAnalysisDetails] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [captureQuality, setCaptureQuality] = useState('high');
  const [showPreview, setShowPreview] = useState(false);
  const { colors, glass, } = useTheme();

  const analysisTypes = [
    { id: 'comprehensive', label: 'Analisis Lengkap', icon: FaGem, description: 'Analisis detail warna, fit, styling, dan rekomendasi' },
    { id: 'color', label: 'Fokus Warna', icon: FaPalette, description: 'Analisis kesesuaian warna dengan skin tone' },
    { id: 'style', label: 'Fashion Style', icon: MdStyle, description: 'Evaluasi gaya dan trend fashion' },
    { id: 'occasion', label: 'Matching Acara', icon: FaClock, description: 'Rekomendasi untuk berbagai acara' }
  ];

  const qualityOptions = [
    { id: 'high', label: 'High Quality', size: '1920x1080' },
    { id: 'medium', label: 'Medium Quality', size: '1280x720' },
    { id: 'low', label: 'Low Quality', size: '640x480' }
  ];
  // Capture canvas screenshot
  const captureCanvas = useCallback(async () => {
    if (!canvasRef?.current) {
      toast.error('Canvas tidak ditemukan!');
      return null;
    }

    setIsCapturing(true);
    
    try {
      const result = await CanvasScreenshotUtil.captureCanvas(canvasRef, {
        format: 'image/png',
        quality: 1.0,
        backgroundColor: '#ffffff'
      });
      
      setCapturedImage(result.dataURL);
      setShowModal(true);
      
      toast.success(`Screenshot berhasil! (${CanvasScreenshotUtil.formatFileSize(result.size)}) 📸`);
      return result.dataURL;
    } catch (error) {
      console.error('Error capturing canvas:', error);
      toast.error('Gagal mengambil screenshot');
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [canvasRef]);

  // Convert dataURL to base64 for API
  const dataURLToBase64 = (dataURL) => {
    return dataURL.split(',')[1];
  };

  // Send to AI Stylist with image and product data
  const sendToAIStylist = async () => {
    if (!capturedImage || !product) {
      toast.error('Data tidak lengkap untuk analisis AI');
      return;
    }

    setIsAnalyzing(true);

    try {
      const base64Image = dataURLToBase64(capturedImage);
      
      const visualAnalysisPrompt = `
Sebagai AI Stylist expert, analisis gambar outfit virtual ini dan berikan feedback professional:

PRODUCT DATA:
- Nama: "${product.name}"
- Deskripsi: "${product.description}"
- Harga: Rp ${product.price?.toLocaleString()}
- Kategori: ${product.category || 'Fashion'}

USER DATA:
- Warna kulit: ${userSkinTone ? `${userSkinTone.name} (${userSkinTone.description})` : 'Belum terdeteksi'}
- Rekomendasi warna: ${userSkinTone ? userSkinTone.recommendations?.join(', ') : 'Analisis diperlukan'}

ANALISIS VISUAL YANG DIBUTUHKAN:
1. Kesesuaian warna outfit dengan skin tone
2. Proporsi dan fit clothing pada model
3. Overall styling dan aesthetic appeal
4. Saran improvement atau alternative styling
5. Aksesories yang bisa ditambahkan
6. Occasion yang cocok untuk outfit ini

INSTRUKSI:
- Berikan analisis berdasarkan gambar yang dikirim
- Gunakan bahasa yang friendly tapi professional
- Maksimal 300 kata
- Sertakan emoji yang relevan
- Berikan rating 1-10 untuk overall look
- Akhiri dengan pertanyaan untuk engagement

Format response:
📸 ANALISIS VISUAL OUTFIT

[Analisis detail berdasarkan gambar]

⭐ RATING: [X]/10
💡 SARAN: [Specific suggestions]
🎯 COCOK UNTUK: [Occasions]

[Pertanyaan engagement]
      `.trim();

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key tidak ditemukan');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: visualAnalysisPrompt },
                  {
                    inline_data: {
                      mime_type: "image/png",
                      data: base64Image
                    }
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiAnalysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Maaf, analisis visual sedang bermasalah. Coba lagi nanti! 🔄";

      setAiResponse(aiAnalysis);
      
      // Callback to parent component if needed
      if (onStylistResponse) {
        onStylistResponse({
          image: capturedImage,
          analysis: aiAnalysis,
          product: product,
          timestamp: new Date()
        });
      }

      toast.success('Analisis AI stylist selesai! ✨');

    } catch (error) {
      console.error('Error sending to AI:', error);
      setAiResponse('Oops! AI Stylist sedang istirahat. Mari coba lagi nanti! 😴✨');
      toast.error('Gagal menghubungi AI Stylist');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Download screenshot
  const downloadScreenshot = () => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.download = `outfit-${product?.name || 'screenshot'}-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
    
    toast.success('Screenshot berhasil didownload! 📁');
  };

  // Reset modal
  const resetModal = () => {
    setShowModal(false);
    setCapturedImage(null);
    setAiResponse('');
  };
  return (
    <>
      {/* Main Feature Section */}
      <div className={`${glass.background} ${glass.border} rounded-3xl p-6 backdrop-blur-xl shadow-2xl`}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MdPhotoCamera className="text-4xl text-purple-500" />
            <FaRobot className="text-4xl text-pink-500" />
            <HiSparkles className="text-4xl text-yellow-400 animate-pulse" />
          </div>
          <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>
            AI Visual Fashion Analysis
          </h3>
          <p className={`${colors.textMuted} text-lg`}>
            Capture your outfit dan dapatkan analisis fashion AI yang mendalam
          </p>
        </div>

        {/* Quick Settings */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {analysisTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setAnalysisType(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                analysisType === type.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : `${glass.background} ${colors.text} ${glass.border} hover:shadow-md`
              }`}
            >
              <type.icon className="text-sm" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Advanced Options Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className={`flex items-center space-x-2 mx-auto px-4 py-2 rounded-xl text-sm font-medium transition-all ${glass.background} ${colors.text} ${glass.border} hover:scale-105`}
          >
            <MdTune className="text-sm" />
            <span>Advanced Options</span>
            <span className={`transform transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>

        {/* Advanced Options Panel */}
        {showAdvancedOptions && (
          <div className={`${glass.background} ${glass.border} rounded-2xl p-4 mb-6 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300`}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quality Settings */}
              <div>
                <h4 className={`font-semibold ${colors.text} mb-3 flex items-center`}>
                  <HiColorSwatch className="mr-2 text-purple-500" />
                  Capture Quality
                </h4>
                <div className="space-y-2">
                  {qualityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setCaptureQuality(option.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        captureQuality === option.id 
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700' 
                          : `${colors.surface} ${colors.text} hover:${colors.surfaceSecondary}`
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className={`text-xs ${colors.textMuted}`}>{option.size}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analysis Focus */}
              <div>
                <h4 className={`font-semibold ${colors.text} mb-3 flex items-center`}>
                  <HiLightBulb className="mr-2 text-yellow-500" />
                  Analysis Focus
                </h4>
                <div className={`${colors.surface} rounded-lg p-3`}>
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      {analysisTypes.find(t => t.id === analysisType)?.icon && (
                        React.createElement(analysisTypes.find(t => t.id === analysisType).icon, {
                          className: "text-purple-500"
                        })
                      )}
                      <span className={`font-medium ${colors.text}`}>
                        {analysisTypes.find(t => t.id === analysisType)?.label}
                      </span>
                    </div>
                    <p className={`${colors.textMuted} text-xs`}>
                      {analysisTypes.find(t => t.id === analysisType)?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Action Button */}
        <div className="text-center">
          <button
            onClick={captureCanvas}
            disabled={isCapturing}
            className={`relative group px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
              isCapturing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white shadow-2xl hover:shadow-purple-500/50'
            } disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
            title="Screenshot & Ask AI Stylist"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse"></div>
            
            <div className="relative flex items-center space-x-3">
              {isCapturing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Capturing Magic...</span>
                  <MdAutoAwesome className="text-xl animate-pulse" />
                </>
              ) : (
                <>
                  <BiScreenshot className="text-2xl group-hover:scale-110 transition-transform" />
                  <FaRobot className="text-xl group-hover:scale-110 transition-transform" />
                  <span>Capture & Analyze</span>
                  <HiSparkles className="text-xl animate-pulse group-hover:scale-110 transition-transform" />
                </>
              )}
            </div>
          </button>
          
          <p className={`text-xs ${colors.textMuted} mt-3 max-w-md mx-auto`}>
            ✨ AI akan menganalisis warna, styling, fit, dan memberikan rekomendasi profesional
          </p>
        </div>

        {/* Feature Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: FaEye, label: 'Visual Analysis', desc: 'Analisis mendalam' },
            { icon: FaPalette, label: 'Color Matching', desc: 'Kesesuaian warna' },
            { icon: BiTrendingUp, label: 'Style Trends', desc: 'Tren terkini' },
            { icon: FaStar, label: 'Pro Rating', desc: 'Rating profesional' }
          ].map((feature, index) => (
            <div key={index} className={`${glass.background} ${glass.border} rounded-xl p-3 text-center backdrop-blur-xl hover:scale-105 transition-transform`}>
              <feature.icon className={`text-2xl ${colors.primary} mx-auto mb-2`} />
              <div className={`text-xs font-medium ${colors.text}`}>{feature.label}</div>
              <div className={`text-xs ${colors.textMuted}`}>{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Modal */}
      {showModal && (
        <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`${colors.card} rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden`}>
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                    <BiBot className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-1">AI Fashion Studio</h3>
                    <p className="text-sm opacity-90 flex items-center">
                      <HiSparkles className="mr-1" />
                      Advanced Visual Analysis by AI Stylist
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-xl`}>
                    {analysisTypes.find(t => t.id === analysisType)?.label}
                  </div>
                  <button
                    onClick={resetModal}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all backdrop-blur-xl"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Enhanced Screenshot Preview */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-xl ${colors.text} flex items-center`}>
                      <FaCamera className="mr-3 text-purple-500" />
                      Captured Outfit
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-3 py-1 text-xs rounded-lg ${glass.background} ${glass.border} hover:scale-105 transition-all ${colors.text}`}
                      >
                        {showPreview ? 'Hide' : 'Preview'}
                      </button>
                    </div>
                  </div>
                  
                  {capturedImage && (
                    <div className={`relative rounded-2xl overflow-hidden ${glass.border} border-2 shadow-2xl group`}>
                      <img 
                        src={capturedImage} 
                        alt="Captured outfit"
                        className={`w-full transition-all duration-500 ${showPreview ? 'h-auto max-h-96' : 'h-64'} object-cover bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900`}
                      />
                      
                      {/* Image Overlay Info */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <div className={`px-2 py-1 ${glass.background} ${glass.border} rounded-lg text-xs font-medium ${colors.text} backdrop-blur-xl`}>
                          {captureQuality.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 ${glass.background} ${glass.border} rounded-lg text-xs font-medium ${colors.text} backdrop-blur-xl`}>
                          PNG
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4">
                        <button
                          onClick={downloadScreenshot}
                          className="px-4 py-2 bg-white/20 text-white rounded-xl backdrop-blur-xl hover:bg-white/30 transition-all flex items-center space-x-2"
                        >
                          <FaDownload />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => navigator.share && navigator.share({
                            title: 'My AI Fashion Analysis',
                            text: `Check out my AI fashion analysis for: ${product?.name}`,
                            url: window.location.href
                          })}
                          className="px-4 py-2 bg-white/20 text-white rounded-xl backdrop-blur-xl hover:bg-white/30 transition-all flex items-center space-x-2"
                        >
                          <FaShare />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Product Info */}
                  {product && (
                    <div className={`${glass.background} ${glass.border} rounded-2xl p-6 backdrop-blur-xl`}>
                      <h5 className={`font-bold ${colors.text} mb-4 flex items-center`}>
                        <MdStyle className="mr-2 text-pink-500" />
                        Product Analysis Context
                      </h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${colors.text}`}>Product:</span>
                          <span className={`${colors.textMuted} text-right max-w-xs truncate`}>{product.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${colors.text}`}>Price:</span>
                          <span className={`font-bold text-green-600 dark:text-green-400`}>Rp {product.price?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${colors.text}`}>Category:</span>
                          <span className={`px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium`}>
                            {product.category || 'Fashion'}
                          </span>
                        </div>
                        {userSkinTone && (
                          <div className="border-t pt-3 mt-3">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                style={{ backgroundColor: userSkinTone.hex }}
                              />
                              <div>
                                <div className={`font-medium ${colors.text} text-sm`}>{userSkinTone.name}</div>
                                <div className={`${colors.textMuted} text-xs`}>Skin tone detected</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced AI Analysis Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-xl ${colors.text} flex items-center`}>
                      <FaRobot className="mr-3 text-purple-500" />
                      AI Fashion Analysis
                    </h4>
                    {aiResponse && (
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className={colors.textMuted}>Analysis Complete</span>
                      </div>
                    )}
                  </div>

                  {!aiResponse && !isAnalyzing && (
                    <div className={`${glass.background} ${glass.border} rounded-2xl p-8 text-center backdrop-blur-xl`}>
                      <div className="mb-6">
                        <FaMagic className={`text-6xl ${colors.textMuted} mx-auto mb-4 opacity-50`} />
                        <h5 className={`font-bold ${colors.text} text-lg mb-2`}>Ready for AI Analysis</h5>                        <p className={`${colors.textMuted} text-sm max-w-md mx-auto`}>
                          Our advanced AI will analyze your outfit&apos;s color harmony, style compatibility, 
                          and provide professional fashion recommendations.
                        </p>
                      </div>
                      
                      <button
                        onClick={sendToAIStylist}
                        className="relative group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse"></div>
                        <div className="relative flex items-center space-x-3">
                          <BiBot className="text-xl group-hover:scale-110 transition-transform" />
                          <span>Start AI Analysis</span>
                          <HiSparkles className="text-xl animate-pulse group-hover:scale-110 transition-transform" />
                        </div>
                      </button>
                      
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {[
                          { icon: FaEye, label: 'Visual Recognition' },
                          { icon: FaPalette, label: 'Color Analysis' },
                          { icon: FaStar, label: 'Style Rating' },
                          { icon: FaLightbulb, label: 'Smart Suggestions' }
                        ].map((feature, index) => (
                          <div key={index} className={`${colors.surface} rounded-xl p-3 text-center`}>
                            <feature.icon className={`text-lg ${colors.primary} mx-auto mb-1`} />
                            <div className={`text-xs ${colors.textMuted}`}>{feature.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced AI Analysis Progress */}
                  {isAnalyzing && (
                    <div className={`${glass.background} ${glass.border} rounded-2xl p-6 backdrop-blur-xl`}>
                      <AIAnalysisProgress isAnalyzing={isAnalyzing} />
                      
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className={colors.textMuted}>Processing image...</span>
                          <span className="text-purple-500">●</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={colors.textMuted}>Analyzing colors & style...</span>
                          <span className="text-yellow-500">●</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={colors.textMuted}>Generating recommendations...</span>
                          <span className="text-green-500">●</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced AI Response Display */}
                  {aiResponse && (
                    <div className={`${glass.background} ${glass.border} rounded-2xl backdrop-blur-xl overflow-hidden`}>
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 border-b border-purple-200 dark:border-purple-800">
                        <h5 className={`font-bold ${colors.text} flex items-center`}>
                          <HiSparkles className="mr-2 text-yellow-500 animate-pulse" />
                          Professional Analysis Results
                        </h5>
                      </div>
                      
                      <div className="p-6">
                        <div className={`${colors.text} text-sm whitespace-pre-wrap leading-relaxed`}>
                          {aiResponse}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-purple-600 dark:text-purple-400">
                              <HiSparkles className="animate-pulse" />
                              <span>Powered by AI Vision Technology</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(aiResponse);
                                  toast.success('Analysis copied to clipboard!');
                                }}
                                className={`px-3 py-1 text-xs ${glass.background} ${glass.border} rounded-lg hover:scale-105 transition-all ${colors.text}`}
                              >
                                Copy Analysis
                              </button>
                              <span className={`text-xs ${colors.textMuted}`}>
                                {new Date().toLocaleTimeString('id-ID')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-center">
                            <button
                              onClick={() => {
                                setAiResponse('');
                                setAnalysisDetails(null);
                              }}
                              className="flex items-center space-x-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-all"
                            >
                              <FaRobot />
                              <span>New Analysis</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ScreenshotStylistFeature.propTypes = {
  canvasRef: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  userSkinTone: PropTypes.object,
  onStylistResponse: PropTypes.func
};

export default ScreenshotStylistFeature;