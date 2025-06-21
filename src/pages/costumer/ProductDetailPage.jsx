import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Rating } from '@mui/material';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import { FiRefreshCcw, FiZoomIn, FiZoomOut, FiHome } from 'react-icons/fi';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { fetchItems } from '../../store/features/items/ProductSlice';
import ThreeDViewer from '../../components/ThreeDViewer';
import bg from '../../assets/authbg.jpg';
import OutfitRecommendationForm from '../../components/costumer/OutfitRecommendationForm';
import AdvancedStylistChatbot from '../../components/costumer/AdvancedStylistChatbot';
import { useTheme } from '../../contexts/ThemeContext';
import DemoPage from './../DemoPage';

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading: loadingItems, error } = useSelector((s) => s.items);
  const [aiResult, setAiResult] = useState('');
  const [userSkinTone, setUserSkinTone] = useState(null);
  const { colors, glass, button } = useTheme();

  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomInTrigger, setZoomInTrigger] = useState(0);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  useEffect(() => {
    if (!items.length) dispatch(fetchItems());
  }, [dispatch, items]);

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
  return (
    <Box
      className={`min-h-screen flex flex-col justify-center p-8 transition-all duration-500 ${colors.background}`}
      style={{ 
        backgroundImage: `url(${bg})`, 
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Theme Toggle */}

      <button
        onClick={() => navigate(-1)}
        className={`${colors.text} font-bold -mt-5 mb-2 flex text-start justify-start rounded hover:${colors.textSecondary} transition-colors`}
      >
        <IoChevronBackCircleOutline className="h-6 w-6 mr-2" /> Back to shop
      </button>

      <div className={`${glass.background} ${glass.border} rounded-2xl ${glass.shadow} p-10 flex flex-col md:flex-row relative backdrop-blur-xl`}>
        <Box className="md:w-1/2 flex flex-col items-center mb-8 md:mb-0">
          <div className="relative">
            <ThreeDViewer
              isRotating={isRotating}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              zoomInTrigger={zoomInTrigger}
              zoomOutTrigger={zoomOutTrigger}
              resetTrigger={resetTrigger}
            />

            <div className={`absolute ${isFullscreen ? 'top-4 right-4' : 'bottom-4 right-4'} flex flex-col space-y-2`}>
              <button 
                title={isRotating ? 'Stop rotation' : 'Start rotation'} 
                className={`ctrl-btn ${glass.background} ${glass.border}`} 
                onClick={() => setIsRotating((prev) => !prev)}
              >
                <FiRefreshCcw className={`${isRotating ? 'animate-spin text-purple-500' : colors.textSecondary}`} />
              </button>
              <button 
                title="Zoom in" 
                className={`ctrl-btn ${glass.background} ${glass.border}`} 
                onClick={() => setZoomInTrigger((v) => v + 1)}
              >
                <FiZoomIn className={colors.textSecondary} />
              </button>
              <button 
                title="Zoom out" 
                className={`ctrl-btn ${glass.background} ${glass.border}`} 
                onClick={() => setZoomOutTrigger((v) => v + 1)}
              >
                <FiZoomOut className={colors.textSecondary} />
              </button>
              <button 
                title="Reset view" 
                className={`ctrl-btn ${glass.background} ${glass.border}`} 
                onClick={() => setResetTrigger((v) => v + 1)}
              >
                <FiHome className={colors.textSecondary} />
              </button>
              <button 
                title="Toggle fullscreen" 
                className={`ctrl-btn ${glass.background} ${glass.border}`} 
                onClick={() => setIsFullscreen((prev) => !prev)}
              >
                {isFullscreen ? <MdFullscreenExit className={colors.textSecondary} /> : <MdFullscreen className={colors.textSecondary} />}
              </button>
            </div>

            <div className={`absolute bottom-2 left-2 ${glass.background} ${colors.text} text-xs p-2 rounded backdrop-blur-sm`}>
              <div>🖱️ Drag to orbit</div>
              <div>🔍 Scroll to zoom</div>
            </div>
          </div>

          <div className="flex mt-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src={product.image}
                alt={`Thumbnail ${i + 1}`}
                className={`w-16 h-16 object-cover rounded-md border ${colors.border} hover:border-purple-400 cursor-pointer transition-colors`}
              />
            ))}
          </div>
        </Box>

        <Box className="md:w-1/2 md:pl-8 -mx-5 flex flex-col justify-between">
          <div>
            <Typography variant="h4" className={`font-bold mb-2 ${colors.text}`}>
              {product.name}
            </Typography>
            <Rating value={product.rating || 5} readOnly size="small" />
            <Typography className={`mt-2 ${colors.textSecondary}`}>
              {product.description}
            </Typography>
          </div>

          <div className="flex flex-col md:flex-row mt-4 gap-8 md:gap-12">
            <div>
              <Typography className={`font-semibold mb-1 ${colors.text}`}>Size:</Typography>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                  <button key={s} className={`size-btn ${button.secondary}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <Typography className={`font-semibold mb-1 ${colors.text}`}>Color:</Typography>
              <div className="flex gap-2">
                {productColors.map((c) => (
                  <span 
                    key={c} 
                    className={`w-6 h-6 rounded-full ${colorClasses[c]} border cursor-pointer hover:scale-110 transition-transform`} 
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div>
              <Typography variant="h5" className={`font-bold ${colors.text}`}>
                Rp {product.price.toLocaleString()}
              </Typography>
              <Typography className={`${colors.textMuted} line-through text-sm`}>
                Rp {(product.price + 150).toLocaleString()}
              </Typography>
            </div>
            <button className={`${button.primary} rounded-md px-6 py-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl`}>
              Buy Now
            </button>
          </div>
        </Box>        <div className="absolute top-7 xl:top-10 right-10 flex gap-10">
          <FaHeart className={`${colors.textMuted} hover:text-red-500 text-2xl cursor-pointer transition-colors`} />
          <FaShareAlt className={`${colors.textMuted} hover:text-blue-500 text-2xl cursor-pointer transition-colors`} />
        </div>
      </div>
 <DemoPage />
      <OutfitRecommendationForm 
        product={product} 
        setAiResult={setAiResult} 
        fetchRecommendation={fetchRecommendation} 
        onSkinToneDetected={handleSkinToneDetected}
      />
     

      
      <AdvancedStylistChatbot product={product} userSkinTone={userSkinTone} />


      {aiResult && (
        <div className={`mt-4 p-4 ${colors.surfaceSecondary} ${colors.border} rounded-lg`}>
          <h4 className={`font-semibold ${colors.text} mb-1`}>🤖 Rekomendasi AI:</h4>
          <p className={`${colors.textSecondary} whitespace-pre-line`}>{aiResult}</p>
        </div>
      )}

     

      <style>{`
        .ctrl-btn {
          @apply w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center hover:scale-105 transition-all shadow-sm;
        }
        .size-btn {
          @apply px-3 py-1 border rounded text-sm hover:scale-105 transition-all;
        }
      `}</style>
    </Box>
  );
}

export default ProductDetailPage;