import { useState, useRef } from 'react';
import Simple3DViewer from '../components/Simple3DViewer';
import { 
  ScreenshotStylistFeature, 
  StylistResponseHistory,
  EnhancedSkinToneDetector 
} from '../components';
import { useTheme } from '../contexts/ThemeContext';
import { FaCamera, FaRobot, FaHistory } from 'react-icons/fa';
import { BiBot } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';

const ScreenshotStylistDemo = () => {
  const [stylistResponses, setStylistResponses] = useState([]);
  const [userSkinTone, setUserSkinTone] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomInTrigger, setZoomInTrigger] = useState(0);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const canvasRef = useRef(null);
  const { colors, glass } = useTheme();

  // Demo product data
  const demoProduct = {
    id: 'demo-1',
    name: 'Premium Fashion T-Shirt',
    description: 'T-shirt berkualitas tinggi dengan desain modern dan nyaman dipakai',
    price: 299000,
    category: 'T-Shirt',
    image: '/demo-tshirt.jpg'
  };

  const handleStylistResponse = (responseData) => {
    setStylistResponses(prev => [responseData, ...prev]);
  };

  const handleSkinToneDetected = (skinToneData) => {
    setUserSkinTone(skinToneData);
  };

  return (
    <div className={`min-h-screen ${colors.background} py-8`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaCamera className="text-3xl text-purple-500" />
            <FaRobot className="text-3xl text-pink-500" />
            <HiSparkles className="text-3xl text-yellow-500" />
          </div>
          <h1 className={`text-4xl font-bold ${colors.text} mb-4`}>
            Screenshot & AI Stylist Demo
          </h1>
          <p className={`text-lg ${colors.textMuted} max-w-2xl mx-auto`}>
            Capture tampilan 3D outfit Anda dan dapatkan analisis fashion professional dari AI Stylist berdasarkan visual dan data produk
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Canvas Section */}
          <div className="lg:col-span-2">
            <div className={`${glass.background} ${glass.border} rounded-2xl p-6 shadow-xl`}>
              <h2 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center`}>
                <FaCamera className="mr-3 text-purple-500" />
                3D Fashion Preview
              </h2>              <div className="relative h-96 rounded-xl overflow-hidden">
                <Simple3DViewer
                  ref={canvasRef}
                  isRotating={isRotating}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                  zoomInTrigger={zoomInTrigger}
                  zoomOutTrigger={zoomOutTrigger}
                  resetTrigger={resetTrigger}
                />
                
                {/* 3D Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button 
                    onClick={() => setIsRotating(!isRotating)}
                    className={`p-2 ${glass.background} ${glass.border} rounded-lg hover:scale-105 transition-all ${
                      isRotating ? 'text-purple-500' : colors.textMuted
                    }`}
                    title={isRotating ? 'Stop rotation' : 'Start rotation'}
                  >
                    🔄
                  </button>
                  <button 
                    onClick={() => setZoomInTrigger(prev => prev + 1)}
                    className={`p-2 ${glass.background} ${glass.border} rounded-lg hover:scale-105 transition-all ${colors.textMuted}`}
                    title="Zoom in"
                  >
                    🔍+
                  </button>
                  <button 
                    onClick={() => setZoomOutTrigger(prev => prev + 1)}
                    className={`p-2 ${glass.background} ${glass.border} rounded-lg hover:scale-105 transition-all ${colors.textMuted}`}
                    title="Zoom out"
                  >
                    🔍-
                  </button>
                  <button 
                    onClick={() => setResetTrigger(prev => prev + 1)}
                    className={`p-2 ${glass.background} ${glass.border} rounded-lg hover:scale-105 transition-all ${colors.textMuted}`}
                    title="Reset view"
                  >
                    🏠
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <ScreenshotStylistFeature
                  canvasRef={canvasRef}
                  product={demoProduct}
                  userSkinTone={userSkinTone}
                  onStylistResponse={handleStylistResponse}
                />
                
                <StylistResponseHistory responses={stylistResponses} />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Skin Tone Detection */}
            <div className={`${glass.background} ${glass.border} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
                <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mr-3"></div>
                Deteksi Warna Kulit
              </h3>
              <EnhancedSkinToneDetector onSkinToneDetected={handleSkinToneDetected} />
              
              {userSkinTone && (
                <div className={`mt-4 p-4 ${colors.background} rounded-xl border ${colors.border}`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: userSkinTone.hex }}
                    ></div>
                    <div>
                      <p className={`font-medium ${colors.text}`}>{userSkinTone.name}</p>
                      <p className={`text-xs ${colors.textMuted}`}>{userSkinTone.description}</p>
                    </div>
                  </div>
                  {userSkinTone.recommendations && (
                    <div className="mt-3">
                      <p className={`text-sm font-medium ${colors.text} mb-2`}>Rekomendasi Warna:</p>
                      <div className="flex flex-wrap gap-1">
                        {userSkinTone.recommendations.map((color, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className={`${glass.background} ${glass.border} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
                <BiBot className="mr-3 text-pink-500" />
                Product Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`font-medium ${colors.text}`}>{demoProduct.name}</p>
                  <p className={`text-sm ${colors.textMuted}`}>{demoProduct.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${colors.textMuted}`}>Harga:</span>
                  <span className={`font-bold ${colors.text} text-lg`}>
                    Rp {demoProduct.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${colors.textMuted}`}>Kategori:</span>
                  <span className={`px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full`}>
                    {demoProduct.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className={`${glass.background} ${glass.border} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
                <HiSparkles className="mr-3 text-yellow-500" />
                Cara Penggunaan
              </h3>
              <ol className={`text-sm ${colors.textMuted} space-y-2`}>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                  <span>Deteksi warna kulit Anda terlebih dahulu</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                  <span>Atur pose dan angle 3D model yang diinginkan</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                  <span>Klik &quot;Ask AI Stylist&quot; untuk screenshot dan analisis</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                  <span>Lihat riwayat analisis dengan tombol &quot;Riwayat AI&quot;</span>
                </li>
              </ol>
            </div>

            {/* Stats */}
            {stylistResponses.length > 0 && (
              <div className={`${glass.background} ${glass.border} rounded-2xl p-6 shadow-xl`}>
                <h3 className={`text-xl font-bold ${colors.text} mb-4 flex items-center`}>
                  <FaHistory className="mr-3 text-blue-500" />
                  Statistik
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${colors.text}`}>{stylistResponses.length}</div>
                    <div className={`text-xs ${colors.textMuted}`}>Analisis AI</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {userSkinTone ? userSkinTone.recommendations?.length || 0 : 0}
                    </div>
                    <div className={`text-xs ${colors.textMuted}`}>Rekomendasi Warna</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-purple-200 dark:border-purple-800">
          <p className={`${colors.textMuted} flex items-center justify-center space-x-2`}>
            <HiSparkles className="text-yellow-500" />
            <span>Powered by AI Vision • Gemini API • Three.js</span>
            <HiSparkles className="text-yellow-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotStylistDemo;