import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Rating, } from '@mui/material';
import { FaHeart, FaShareAlt, FaCamera, FaPalette, FaRobot, FaHistory, FaShoppingBag } from 'react-icons/fa';
import { FiRefreshCcw, FiZoomIn, FiZoomOut, FiHome } from 'react-icons/fi';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { HiSparkles, HiColorSwatch } from 'react-icons/hi';
import { fetchItems } from '../../store/features/items/ProductSlice';
import Simple3DViewer from '../../components/Simple3DViewer';
import bg from '../../assets/authbg.jpg';
import { 
  OutfitRecommendationForm, 
  AdvancedStylistChatbot,
  ScreenshotStylistFeature,
  StylistResponseHistory,
  EnhancedSkinToneDetector
} from "../../components";
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading: loadingItems, error } = useSelector((s) => s.items);
  const [aiResult, setAiResult] = useState('');
  const [userSkinTone, setUserSkinTone] = useState(null);
  const [stylistResponses, setStylistResponses] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const canvasRef = useRef(null);
  const { colors, glass, button } = useTheme();

  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomInTrigger, setZoomInTrigger] = useState(0);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  // Handle stylist response from screenshot feature
  const handleStylistResponse = (responseData) => {
    setStylistResponses(prev => [responseData, ...prev]);
    toast.success('Analisis AI stylist tersimpan! 🎨');
  };
  
  useEffect(() => {
    if (!items.length) dispatch(fetchItems());
  }, [dispatch, items.length]);

  const handleSkinToneDetected = (skinTone) => {
    setUserSkinTone(skinTone);
  };

  async function fetchRecommendation(form, product) {
  const prompt = `
Kamu adalah asisten stylist AI. Berdasarkan data berikut:

- Warna kulit: ${form.skinTone}
- Acara: ${form.occasion}
- Cuaca: ${form.weather}
- Warna favorit: ${form.favoriteColor}
- Tinggi badan: ${form.height} cm
- Gaya favorit: ${form.stylePreference}

Apakah baju ini cocok? Deskripsi baju: "${product.description}"

Tolong jawab dengan ringkas dan jelas.
`.trim();

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada hasil.";
  } catch (err) {
    console.error("Error fetching Gemini recommendation:", err);
    throw err;
  }
}


  const product = items.find((it) => String(it.id) === String(id));

  if (loadingItems) {
    return (
      <Box className={`h-screen flex items-center justify-center ${colors.background}`}>
        <div className="text-center">
          <CircularProgress className="text-purple-600" />
          <Typography className={`mt-4 ${colors.text}`}>Loading product...</Typography>
        </div>
      </Box>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;

  if (!product) {
    return (
      <Box className={`h-screen flex flex-col items-center justify-center ${colors.background}`}>
        <Typography className={colors.text}>Produk tidak ditemukan</Typography>
        <button onClick={() => navigate(-1)} className={`mt-4 ${button.primary} px-6 py-2 rounded-lg`}>
          Kembali
        </button>
      </Box>
    );
  }
  const productColors = ['blue', 'yellow', 'red', 'orange'];
  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
  };

  const featureTabs = [
    {
      id: 'product',
      label: 'Product Details',
      icon: FaShoppingBag,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'ai-stylist',
      label: 'AI Recommendation',
      icon: FaRobot,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'skin-tone',
      label: 'Skin Analysis',
      icon: FaPalette,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'screenshot',
      label: 'Visual AI',
      icon: FaCamera,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'history',
      label: 'History',
      icon: FaHistory,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <Box
      className={`min-h-screen transition-all  duration-500 relative overflow-hidden`}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
    
      {/* Floating Particles Animation */}
      <div className="absolute  inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>



      {/* Main Content Container */}
      <div className="relative z-10 mt-16 max-w-7xl mx-auto px-6 pb-12"
      
      >
        {/* Product Hero Section */}
        <div className="mb-8 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.18)',
            borderRadius: '1.5rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255,255,255,0.22)',
          }}
        >
          <div className="flex flex-col lg:flex-row">
            
            {/* 3D Viewer Section */}
            <div className="lg:w-1/2   flex flex-col items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden">
                <Simple3DViewer
                  ref={canvasRef}
                  isRotating={isRotating}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                  zoomInTrigger={zoomInTrigger}
                  zoomOutTrigger={zoomOutTrigger}
                  resetTrigger={resetTrigger}
                />

                {/* 3D Controls - Liquid Glass Style */}
                <div className={`absolute ${isFullscreen ? 'top-4 right-4' : 'bottom-4 right-4'} flex flex-col space-y-2`}>
                  {[
                    { icon: FiRefreshCcw, action: () => setIsRotating(!isRotating), active: isRotating, title: 'Toggle Rotation' },
                    { icon: FiZoomIn, action: () => setZoomInTrigger(v => v + 1), title: 'Zoom In' },
                    { icon: FiZoomOut, action: () => setZoomOutTrigger(v => v + 1), title: 'Zoom Out' },
                    { icon: FiHome, action: () => setResetTrigger(v => v + 1), title: 'Reset View' },
                    { icon: isFullscreen ? MdFullscreenExit : MdFullscreen, action: () => setIsFullscreen(!isFullscreen), title: 'Fullscreen' }
                  ].map((ctrl, idx) => (
                    <button
                      key={idx}
                      title={ctrl.title}
                      onClick={ctrl.action}
                      className={`w-12 h-12 ${glass.background} ${glass.border} rounded-xl backdrop-blur-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl ${ctrl.active ? 'ring-2 ring-purple-500' : ''}`}
                    >
                      <ctrl.icon className={`${ctrl.active ? 'text-purple-500 animate-spin' : colors.textSecondary} group-hover:scale-110 transition-transform`} />
                    </button>
                  ))}
                </div>

                {/* Helper Text */}
                {/* <div className={`absolute bottom-4 left-4 ${colors.text} bg-transparent text-xs px-4 py-2 rounded-xl backdrop-blur-xl shadow-lg`}>
                  <div className="flex items-center space-x-2">
                    <HiSparkles className="text-purple-400" />
                    <span>Drag to orbit • Scroll to zoom</span>
                  </div>
                </div> */}
              </div>

              {/* Product Thumbnails */}
              <div className="flex mt-6 gap-3 justify-center">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 ${glass.background} ${glass.border} rounded-xl overflow-hidden backdrop-blur-xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl`}
                  >
                    <img
                      src={product.image}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-between">
              <div>
                {/* Product Title & Rating */}
                <div className="mb-6">
                  <Typography variant="h3" className={`font-bold mb-3 ${colors.text} leading-tight`}>
                    {product.name}
                  </Typography>
                  <div className="flex items-center space-x-4 mb-4">
                    <Rating value={product.rating || 5} readOnly size="small" />
                    <span className={`${colors.textMuted} text-sm`}>4.8 (124 reviews)</span>
                  </div>
                  <Typography className={`${colors.textSecondary} text-lg leading-relaxed`}>
                    {product.description}
                  </Typography>
                </div>

                {/* Product Options */}
                <div className="space-y-6 mb-8">
                  {/* Size Selection */}
                  <div>
                    <Typography className={`font-semibold mb-3 ${colors.text} flex items-center`}>
                      <HiColorSwatch className="mr-2 text-purple-500" />
                      Size Selection
                    </Typography>
                    <div className="flex gap-3">
                      {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                        <button 
                          key={size} 
                          className={`px-4 py-2 ${glass.background} ${glass.border} rounded-xl backdrop-blur-xl hover:scale-105 transition-all duration-300 ${colors.text} font-medium shadow-md hover:shadow-lg`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <Typography className={`font-semibold mb-3 ${colors.text} flex items-center`}>
                      <HiSparkles className="mr-2 text-pink-500" />
                      Color Options
                    </Typography>
                    <div className="flex gap-3">
                      {productColors.map((color) => (
                        <button
                          key={color}
                          className={`w-12 h-12 rounded-xl ${colorClasses[color]} border-2 border-white/50 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="space-y-6">
                <div className={`${glass.background} ${glass.border} rounded-2xl p-6 backdrop-blur-xl shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Typography variant="h4" className={`font-bold ${colors.text} mb-1`}>
                        Rp {product.price.toLocaleString()}
                      </Typography>
                      <Typography className={`${colors.textMuted} line-through text-sm`}>
                        Rp {(product.price + 150000).toLocaleString()}
                      </Typography>
                    </div>
                    <div className="flex space-x-3">
                      <button className={`p-3 ${glass.background} ${glass.border} rounded-xl backdrop-blur-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                        <FaHeart className={`${colors.textMuted} hover:text-red-500 transition-colors`} />
                      </button>
                      <button className={`p-3 ${glass.background} ${glass.border} rounded-xl backdrop-blur-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                        <FaShareAlt className={`${colors.textMuted} hover:text-blue-500 transition-colors`} />
                      </button>
                    </div>
                  </div>
                  
                  <button className={`w-full ${button.primary} rounded-xl py-4 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-xl`}>
                    <FaShoppingBag className="inline mr-3" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Tabs Navigation */}
        <div className={`${glass.background} ${glass.border} rounded-2xl backdrop-blur-2xl shadow-2xl mb-8 p-2`}>
          <div className="flex flex-wrap gap-2">
            {featureTabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group ${
                  activeTab === index 
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105` 
                    : `${colors.textMuted} hover:${colors.surfaceSecondary} hover:scale-105`
                }`}
              >
                <tab.icon className={`${activeTab === index ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Content Panels */}
        <div className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            border: '1.5px solid rgba(255,255,255,0.22)',
          }}
        >
          
          {/* Product Details Tab */}
          {activeTab === 0 && (
            <div className="p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <Typography variant="h4" className={`font-bold ${colors.text} mb-2`}>
                  Product Specifications
                </Typography>
                <Typography className={`${colors.textMuted}`}>
                  Detailed information about this amazing product
                </Typography>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${glass.background} ${glass.border} rounded-2xl p-6 backdrop-blur-xl space-y-4`}>
                  <h3 className={`font-semibold ${colors.text} flex items-center`}>
                    <HiSparkles className="mr-2 text-purple-500" />
                    Material & Care
                  </h3>
                  <ul className={`${colors.textSecondary} space-y-2`}>
                    <li>• 100% Premium Cotton</li>
                    <li>• Machine washable</li>
                    <li>• Breathable fabric</li>
                    <li>• Anti-wrinkle treatment</li>
                  </ul>
                </div>
                
                <div className={`${glass.background} ${glass.border} rounded-2xl p-6 backdrop-blur-xl space-y-4`}>
                  <h3 className={`font-semibold ${colors.text} flex items-center`}>
                    <HiColorSwatch className="mr-2 text-pink-500" />
                    Features
                  </h3>
                  <ul className={`${colors.textSecondary} space-y-2`}>
                    <li>• Modern slim fit design</li>
                    <li>• Reinforced stitching</li>
                    <li>• Fade-resistant colors</li>
                    <li>• Comfortable all-day wear</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* AI Stylist Tab */}
          {activeTab === 1 && (
            <div className="p-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <Typography variant="h4" className={`font-bold ${colors.text} mb-2 flex items-center justify-center`}>
                  <FaRobot className="mr-3 text-purple-500" />
                  AI Recomendation Fashion Stylist
                </Typography>
                <Typography className={`${colors.textMuted}`}>
                  Get personalized fashion advice from our advanced AI
                </Typography>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <OutfitRecommendationForm 
                  product={product} 
                  setAiResult={setAiResult} 
                  fetchRecommendation={fetchRecommendation} 
                  onSkinToneDetected={handleSkinToneDetected}
                />
                       {aiResult && (
                <div className={`mt-8 ${glass.background} ${glass.border} rounded-2xl p-6 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-700`}>
                  <h4 className={`font-semibold ${colors.text} mb-3 flex items-center`}>
                    <FaRobot className="mr-2 text-purple-500" />
                    AI Recommendation
                  </h4>
                  <p className={`${colors.textSecondary} whitespace-pre-line leading-relaxed`}>{aiResult}</p>
                </div>
              )}
              </div>
              
              
       
            </div>
          )}

          {/* Skin Analysis Tab */}
          {activeTab === 2 && (
            <div className="p-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <Typography variant="h4" className={`font-bold ${colors.text} mb-2 flex items-center justify-center`}>
                  <FaPalette className="mr-3 text-pink-500" />
                  Skin Tone Analysis
                </Typography>
                <Typography className={`${colors.textMuted}`}>
                  Discover your perfect colors with AI-powered skin analysis
                </Typography>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <EnhancedSkinToneDetector onSkinToneDetected={handleSkinToneDetected} />
                
                {userSkinTone && (
                  <div className={`mt-8 ${glass.background} ${glass.border} rounded-2xl p-6 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-700`}>
                    <h4 className={`font-semibold ${colors.text} mb-4 flex items-center`}>
                      <HiSparkles className="mr-2 text-purple-500" />
                      Your Color Profile
                    </h4>
                    <div className="flex items-center space-x-4 mb-4">
                      <div 
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                        style={{ backgroundColor: userSkinTone.hex }}
                      />
                      <div>
                        <h5 className={`font-medium ${colors.text}`}>{userSkinTone.name}</h5>
                        <p className={`text-sm ${colors.textMuted}`}>{userSkinTone.description}</p>
                      </div>
                    </div>
                    {userSkinTone.recommendations && (
                      <div>
                        <p className={`font-medium text-sm ${colors.text} mb-2`}>Recommended Colors:</p>
                        <div className="flex flex-wrap gap-2">
                          {userSkinTone.recommendations.map((color, index) => (
                            <span
                              key={index}
                              className={`${colors.surface} px-3 py-1 rounded-full text-xs font-medium text-purple-700 ${colors.border}`}
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
            </div>
          )}

          {/* Visual AI Tab */}
          {activeTab === 3 && (
            <div className="p-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
             
                <Typography className={`${colors.textMuted}`}>
                  Capture and analyze your style with advanced computer vision
                </Typography>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <ScreenshotStylistFeature
                  canvasRef={canvasRef}
                  product={product}
                  userSkinTone={userSkinTone}
                  onStylistResponse={handleStylistResponse}
                />
            
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 4 && (
            <div className="p-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <Typography variant="h4" className={`font-bold ${colors.text} mb-2 flex items-center justify-center`}>
                  <FaHistory className="mr-3 text-amber-500" />
                  Analysis History
                </Typography>
                <Typography className={`${colors.textMuted}`}>
                  Review your previous AI fashion consultations
                </Typography>
              </div>
              
               <div className=" my-72">
                <StylistResponseHistory responses={stylistResponses} />
                
                {stylistResponses.length === 0 && (
                  <div className={`${glass.background} ${glass.border} rounded-2xl p-12 text-center backdrop-blur-xl`}>
                    <FaHistory className={`text-6xl ${colors.textMuted} mx-auto mb-4 opacity-50`} />
                    <Typography className={`${colors.textMuted} text-lg`}>
                      No analysis history yet. Start by using our AI features!
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
          <AdvancedStylistChatbot 
                  product={product} 
                  userSkinTone={userSkinTone} 
                />
      </div>

      {/* Liquid Glass Styling */}
      <style>{`
        .liquid-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
        }
        
        .liquid-glass-strong {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </Box>
  );
}

export default ProductDetailPage;