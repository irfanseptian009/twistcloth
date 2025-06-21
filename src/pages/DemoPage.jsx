import { useState } from 'react';
import { Box, Typography, } from '@mui/material';
import { FaCamera, FaRobot, FaPalette, FaMagic } from 'react-icons/fa';
import EnhancedSkinToneDetector from '../components/costumer/EnhancedSkinToneDetector';
import AdvancedStylistChatbot from '../components/costumer/AdvancedStylistChatbot';
import { useTheme } from '../contexts/ThemeContext';

function DemoPage() {
  const [detectedSkinTone, setDetectedSkinTone] = useState(null);
  const { colors, glass, } = useTheme();

  const handleSkinToneDetected = (skinTone) => {
    setDetectedSkinTone(skinTone);
  };

  // Sample product for demo
  const sampleProduct = {
    id: 1,
    name: "Elegant Summer Dress",
    description: "A beautiful flowy summer dress perfect for casual outings",
    price: 299000,
    rating: 4.5
  };

  const features = [
    {
      icon: FaCamera,
      title: "AI Skin Tone Detection",
      description: "Upload foto atau ambil foto langsung untuk mendeteksi warna kulit secara otomatis",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: FaRobot,
      title: "AI Stylist Chatbot",
      description: "Chat dengan AI stylist personal untuk mendapatkan saran fashion yang tepat",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: FaPalette,
      title: "Color Recommendation",
      description: "Dapatkan rekomendasi warna yang cocok berdasarkan analisis warna kulit",
      color: "from-orange-500 to-pink-500"
    },
    {
      icon: FaMagic,
      title: "Personalized Styling",
      description: "Saran styling yang dipersonalisasi berdasarkan preferensi dan data Anda",
      color: "from-green-500 to-blue-500"
    }
  ];
  return (
    <Box className={`min-h-screen bg-blue-900/5 shadow-lg  p-6 transition-all rounded-xl duration-500 mt-16`}>
      {/* Theme Controls */}
      <div className="fixed top-6 right-6 z-40 flex space-x-3">
     
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography variant="h3" className={`font-bold ${colors.text} mb-4 animate-in slide-in-from-top duration-700`}>
            🎨 AI Darknessmerch Fashion Assistant
          </Typography>
          <Typography variant="h6" className={`${colors.textSecondary}  mx-auto  animate-in slide-in-from-top duration-700 delay-200`}>
            Coba fitur-fitur terbaru kami: deteksi warna kulit dengan AI dan konsultasi dengan stylist virtual!
          </Typography>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index} 
              className={`${colors.surface} ${colors.border} rounded-2xl shadow-lg hover:shadow-xl transition-all bg-gray-100 dark:bg-gray-800  transform hover:scale-105  overflow-hidden animate-in slide-in-from-bottom duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center p-4 rounded-2xl ">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center float animate-delay-${index * 100}`}>
                  <feature.icon className="text-2xl text-white" />
                </div>
                <Typography variant="h6" className={`font-bold mb-2 ${colors.text}`}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" className={colors.textSecondary}>
                  {feature.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        {/* Main Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skin Tone Detection Demo */}
          <div className="space-y-6">
            <div className={`${glass.background} ${glass.border} rounded-2xl ${glass.shadow} p-6 animate-in slide-in-from-left duration-700`}>
              <Typography variant="h5" className={`font-bold mb-6 text-center ${colors.text}`}>
                🔍 Demo: AI Skin Tone Detection
              </Typography>
              <EnhancedSkinToneDetector onSkinToneDetected={handleSkinToneDetected} />
            </div>

            {/* Results Display */}
            {detectedSkinTone && (
              <div className={`${glass.background} ${glass.border} rounded-2xl ${glass.shadow} p-6 animate-in slide-in-from-left duration-500`}>
                <Typography variant="h6" className={`font-bold mb-4 ${colors.text}`}>
                  📊 Hasil Analisis
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg glow-purple"
                      style={{ backgroundColor: detectedSkinTone.hex }}
                    ></div>
                    <div>
                      <Typography variant="h6" className={`font-bold ${colors.text}`}>
                        {detectedSkinTone.name}
                      </Typography>
                      <Typography variant="body2" className={colors.textSecondary}>
                        {detectedSkinTone.description}
                      </Typography>
                    </div>
                  </div>
                  
                  <div>
                    <Typography variant="subtitle1" className={`font-semibold mb-2 ${colors.text}`}>
                      🎨 Rekomendasi Warna:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {detectedSkinTone.recommendations?.map((color, index) => (
                        <span
                          key={index}
                          className={`${colors.surfaceSecondary} px-3 py-1 rounded-full text-sm font-medium ${colors.text} ${colors.border} hover:scale-105 transition-transform cursor-pointer`}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className={`bg-gradient-to-b dark:to-gray-800 dark:from-blue-900 to-gray-50 from-slate-200  rounded-2xl shadow-xl p-8 dark:text-white text-black animate-in slide-in-from-right duration-700`}>
              <Typography variant="h5" className="font-bold mb-4">
                ✨ Fitur Terbaru!
              </Typography>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaCamera className="text-sm" />
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-semibold">
                      Upload atau Ambil Foto
                    </Typography>
                    <Typography variant="body2" className="opacity-90">
                      Deteksi warna kulit dengan teknologi AI terdepan
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaRobot className="text-sm" />
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-semibold">
                      AI Stylist Personal
                    </Typography>
                    <Typography variant="body2" className="opacity-90">
                      Konsultasi fashion 24/7 dengan AI yang cerdas
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaMagic className="text-sm" />
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-semibold">
                      Rekomendasi Personal
                    </Typography>
                    <Typography variant="body2" className="opacity-90">
                      Saran styling yang disesuaikan dengan karakteristik Anda
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Use */}
            <div className={`${glass.background} ${glass.border} rounded-2xl ${glass.shadow} p-6 animate-in slide-in-from-right duration-700 delay-300`}>
              <Typography variant="h6" className={`font-bold mb-4 ${colors.text}`}>
                📱 Cara Menggunakan
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    1
                  </div>
                  <Typography variant="body2" className={colors.textSecondary}>
                    Upload foto wajah atau ambil foto langsung
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    2
                  </div>
                  <Typography variant="body2" className={colors.textSecondary}>
                    AI akan menganalisis warna kulit secara otomatis
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    3
                  </div>
                  <Typography variant="body2" className={colors.textSecondary}>
                    Dapatkan rekomendasi warna dan style yang cocok
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${colors.primary} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    4
                  </div>
                  <Typography variant="body2" className={colors.textSecondary}>
                    Chat dengan AI Stylist untuk konsultasi lebih lanjut
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Demo Notification */}
        <div className="mt-12 text-center">
          <div className={`${colors.surfaceSecondary} rounded-2xl p-8 ${colors.border} animate-in slide-in-from-bottom duration-700 delay-500`}>
            <Typography variant="h6" className={`font-bold text-center mb-2 ${colors.text}`}>
              💬 Coba Fitur Chat AI Stylist!
            </Typography>
            <Typography variant="body1" className={`${colors.textSecondary} mb-4`}>
              Klik tombol chat di pojok kanan bawah untuk memulai konsultasi dengan AI Stylist
            </Typography>
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
              <Typography variant="body2" className="text-purple-600 font-medium">
                AI Stylist siap membantu Anda!
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Stylist Chatbot */}
      <AdvancedStylistChatbot product={sampleProduct} userSkinTone={detectedSkinTone} />
    </Box>
  );
}

export default DemoPage;
