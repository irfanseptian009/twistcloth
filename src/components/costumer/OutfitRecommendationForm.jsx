import { useState } from "react";
import PropTypes from 'prop-types';
import SkinToneDetector from './SkinToneDetector';
import { useTheme } from '../../contexts/ThemeContext';
import { FaRobot, FaPalette, FaUser, FaCloudSun, FaTshirt, FaRuler, FaMagic, FaChevronDown, FaChevronUp, FaSave, FaHistory } from 'react-icons/fa';
import { HiSparkles, HiColorSwatch } from 'react-icons/hi';
import { BiBot } from 'react-icons/bi';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedPresets, setSavedPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const { colors, glass,} = useTheme();

  // Preset options untuk quick selection
  const occasionOptions = ['Formal', 'Kasual', 'Kerja', 'Pesta', 'Olahraga', 'Santai', 'Kencan', 'Acara Khusus'];
  const weatherOptions = ['Panas', 'Dingin', 'Hujan', 'Sejuk', 'Lembab', 'Kering', 'Berangin'];
  const styleOptions = ['Minimalis', 'Street Style', 'Vintage', 'Bohemian', 'Classic', 'Modern', 'Preppy', 'Grunge'];
  const colorOptions = ['Hitam', 'Putih', 'Navy', 'Merah', 'Biru', 'Hijau', 'Kuning', 'Ungu', 'Pink', 'Abu-abu'];
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

  // Handle quick selection for dropdowns
  const handleQuickSelect = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save current form as preset
  const savePreset = () => {
    if (!presetName.trim()) {
      setError("Masukkan nama preset");
      return;
    }
    
    const newPreset = {
      id: Date.now(),
      name: presetName,
      data: { ...form }
    };
    
    setSavedPresets(prev => [...prev, newPreset]);
    setPresetName("");
    setError("");
  };

  // Load preset
  const loadPreset = (preset) => {
    setForm(preset.data);
  };

  // Clear form
  const clearForm = () => {
    setForm({
      skinTone: "",
      occasion: "",
      weather: "",
      favoriteColor: "",
      height: "",
      stylePreference: "",
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
      <div className={`${glass.background} ${glass.border} rounded-3xl backdrop-blur-2xl shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <FaRobot className="text-2xl" />
            <div>
              <h3 className="font-bold text-xl">AI Fashion Stylist</h3>
              <p className="text-sm opacity-90">Personalized outfit recommendations</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Preset Management */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-semibold ${colors.text} flex items-center`}>
                <FaHistory className="mr-2 text-purple-500" />
                Quick Presets
              </h4>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`text-xs ${glass.background} ${glass.border} px-3 py-1 rounded-lg hover:scale-105 transition-all ${colors.text}`}
              >
                {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
                <span className="ml-1">Advanced</span>
              </button>
            </div>

            {/* Saved Presets */}
            {savedPresets.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {savedPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className={`text-xs ${glass.background} ${glass.border} px-3 py-2 rounded-lg hover:scale-105 transition-all ${colors.text} text-center`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            )}

            {/* Save Preset */}
            {showAdvanced && (
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Nama preset..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className={`flex-1 px-3 py-2 text-sm ${glass.background} ${glass.border} rounded-lg ${colors.text} placeholder-gray-400`}
                />
                <button
                  onClick={savePreset}
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:scale-105 transition-all flex items-center space-x-1"
                >
                  <FaSave />
                  <span>Save</span>
                </button>
                <button
                  onClick={clearForm}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:scale-105 transition-all"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Skin Tone */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2 flex items-center`}>
                  <FaPalette className="mr-2 text-pink-500" />
                  Skin Tone
                </label>
                <div className="relative">
                  <input
                    name="skinTone"
                    placeholder="e.g., Light, Medium, Dark"
                    className={`w-full px-4 py-3 ${glass.background} ${glass.border} rounded-xl ${colors.text} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all`}
                    value={form.skinTone}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSkinDetector(true)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                  >
                    Detect
                  </button>
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2 flex items-center`}>
                  <FaUser className="mr-2 text-blue-500" />
                  Occasion
                </label>
                <input
                  name="occasion"
                  placeholder="Select or type occasion..."
                  className={`w-full px-4 py-3 ${glass.background} ${glass.border} rounded-xl ${colors.text} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all`}
                  value={form.occasion}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {occasionOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleQuickSelect('occasion', option)}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full hover:scale-105 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2 flex items-center`}>
                  <FaCloudSun className="mr-2 text-yellow-500" />
                  Weather
                </label>
                <input
                  name="weather"
                  placeholder="Select or type weather..."
                  className={`w-full px-4 py-3 ${glass.background} ${glass.border} rounded-xl ${colors.text} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all`}
                  value={form.weather}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {weatherOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleQuickSelect('weather', option)}
                      className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full hover:scale-105 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Color */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2 flex items-center`}>
                  <HiColorSwatch className="mr-2 text-purple-500" />
                  Favorite Color
                </label>
                <input
                  name="favoriteColor"
                  placeholder="Select or type color..."
                  className={`w-full px-4 py-3 ${glass.background} ${glass.border} rounded-xl ${colors.text} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all`}
                  value={form.favoriteColor}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleQuickSelect('favoriteColor', option)}
                      className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full hover:scale-105 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2 flex items-center`}>
                  <FaRuler className="mr-2 text-green-500" />
                  Height (cm)
                </label>
                <input
                  name="height"
                  placeholder="e.g., 170"
                  className={`w-full px-4 py-3 ${glass.background} ${glass.border} rounded-xl ${colors.text} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all`}
                  value={form.height}
                  onChange={handleChange}
                  type="number"
                  min="140"
                  max="220"
                  required
                />
              </div>

              {/* Style Preference */}
              <div>
                <label className={`block text-sm font-medium ${colors.text} mb-2 flex items-center`}>
                  <FaTshirt className="mr-2 text-indigo-500" />
                  Style Preference
                </label>
                <input
                  name="stylePreference"
                  placeholder="Select or type style..."
                  className={`w-full px-4 py-3 ${glass.background} ${glass.border} rounded-xl ${colors.text} placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all`}
                  value={form.stylePreference}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {styleOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleQuickSelect('stylePreference', option)}
                      className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full hover:scale-105 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="relative group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                disabled={loading}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse"></div>
                
                <div className="relative flex items-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>AI Analyzing...</span>
                      <BiBot className="text-xl animate-pulse" />
                    </>
                  ) : (
                    <>
                      <FaMagic className="text-xl group-hover:scale-110 transition-transform" />
                      <span>Get AI Recommendation</span>
                      <HiSparkles className="text-xl animate-pulse group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </div>
              </button>
              
              <p className={`text-xs ${colors.textMuted} mt-3 max-w-md mx-auto`}>
                ✨ Our AI will analyze your preferences and provide personalized outfit recommendations
              </p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-xl">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Skin Tone Detector Modal */}
      {showSkinDetector && (
        <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`${colors.card} rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative border border-white/10 dark:border-white/20`}>
            <button
              onClick={() => setShowSkinDetector(false)}
              className={`absolute top-4 right-4 ${colors.textMuted} hover:${colors.text} z-10 transition-colors p-2 rounded-full hover:bg-white/10`}
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
