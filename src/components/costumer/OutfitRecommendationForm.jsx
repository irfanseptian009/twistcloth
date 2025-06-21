import { useState } from "react";
import PropTypes from 'prop-types';
import SkinToneDetector from './SkinToneDetector';
import { useTheme } from '../../contexts/ThemeContext';

function OutfitRecommendationForm({ product, setAiResult, fetchRecommendation, onSkinToneDetected }) {
  const [form, setForm] = useState({
    skinTone: "",
    occasion: "",
    weather: "",
    favoriteColor: "",
    height: "",
    stylePreference: "",
  });
  const [showSkinDetector, setShowSkinDetector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const { colors, glass, button } = useTheme();

  const handleSkinToneDetected = (skinTone) => {
    setForm(prev => ({
      ...prev,
      skinTone: skinTone.name
    }));
    if (onSkinToneDetected) {
      onSkinToneDetected(skinTone);
    }
    setShowSkinDetector(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const now = Date.now();
  if (lastRequestTime && now - lastRequestTime < 10000) {
    setError("Tunggu beberapa detik sebelum mengirim ulang.");
    return;
  }

  setLastRequestTime(now);
  setLoading(true);
  setError("");

  try {
    const result = await fetchRecommendation(form, product);
    setAiResult(result);
  } catch (err) {
    setError(err.message || "Terjadi kesalahan.");
  } finally {
    setLoading(false);
  }
};  return (
    <>
      <form onSubmit={handleSubmit} className={`mt-10 p-6 ${glass.background} ${glass.border} rounded-lg shadow-xl ${glass.shadow}`}>
        <h3 className={`text-lg font-bold mb-4 ${colors.text}`}>🤖 AI Outfit Recommendation</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              name="skinTone"
              placeholder="Warna kulit"
              className="input w-full"
              value={form.skinTone}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowSkinDetector(true)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
            >
              Deteksi
            </button>
          </div>
          <input
            name="occasion"
            placeholder="Acara (formal/kasual)"
            className="input"
            value={form.occasion}
            onChange={handleChange}
            required
          />
          <input
            name="weather"
            placeholder="Cuaca (panas/dingin)"
            className="input"
            value={form.weather}
            onChange={handleChange}
            required
          />
          <input
            name="favoriteColor"
            placeholder="Warna favorit"
            className="input"
            value={form.favoriteColor}
            onChange={handleChange}
            required
          />
          <input
            name="height"
            placeholder="Tinggi badan (cm)"
            className="input"
            value={form.height}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            name="stylePreference"
            placeholder="Gaya favorit (street, minimalis, dll)"
            className="input"
            value={form.stylePreference}
            onChange={handleChange}
            required
          />
        </div>        <button
          type="submit"
          className={`mt-6 ${button.primary} px-6 py-2 rounded transition-all disabled:opacity-60 transform hover:scale-105`}
          disabled={loading}
        >
          {loading ? "🤖 Menganalisis..." : "✨ Dapatkan Rekomendasi"}
        </button>

        {error && <p className={`mt-3 text-red-600 text-sm ${colors.text}`}>{error}</p>}
      </form>

      {/* Skin Tone Detector Modal */}
      {showSkinDetector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${colors.surface} rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative ${glass.shadow}`}>            <button
              onClick={() => setShowSkinDetector(false)}
              className={`absolute top-4 right-4 ${colors.textMuted} hover:${colors.text} z-10 transition-colors`}
            >
              ✕
            </button>
            <div className="p-6">
              <SkinToneDetector onSkinToneDetected={handleSkinToneDetected} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
OutfitRecommendationForm.propTypes = {
  product: PropTypes.object.isRequired,
  setAiResult: PropTypes.func.isRequired,
  fetchRecommendation: PropTypes.func.isRequired,
  onSkinToneDetected: PropTypes.func
};

export default OutfitRecommendationForm;
