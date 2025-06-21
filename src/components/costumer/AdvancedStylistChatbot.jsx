import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaUser, FaMagic, FaHeart } from 'react-icons/fa';
import { BiBot, BiStar } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const AdvancedStylistChatbot = ({ product, userSkinTone }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Halo! Saya AI Stylist personal Anda! ✨ Siap membantu Anda tampil memukau dengan saran fashion yang tepat! 💫',
      timestamp: new Date(),
      isWelcome: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState('friendly'); // friendly, professional, trendy
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { colors, glass, button } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAdvancedStylistResponse = async (userMessage) => {
    const personalityPrompts = {
      friendly: "Kamu adalah stylist AI yang sangat ramah dan antusias. Gunakan emoji yang banyak dan nada yang hangat.",
      professional: "Kamu adalah stylist AI profesional dengan pengalaman luas. Berikan saran yang detail dan berdasarkan pengetahuan fashion.",
      trendy: "Kamu adalah stylist AI yang mengikuti tren terkini. Gunakan bahasa yang kekinian dan referensi pop culture."
    };

    const contextPrompt = `
${personalityPrompts[personality]}

Sebagai AI Stylist expert, berikan saran fashion yang:
1. Personal dan sesuai dengan data user
2. Praktis dan dapat diterapkan
3. Mengikuti tren terkini
4. Mempertimbangkan warna kulit jika tersedia

Konteks:
- Produk: ${product ? `"${product.name}" - ${product.description} (Harga: Rp ${product.price?.toLocaleString()})` : 'Konsultasi umum'}
- Warna kulit: ${userSkinTone ? `${userSkinTone.name} - ${userSkinTone.description}` : 'Belum terdeteksi'}
- Rekomendasi warna: ${userSkinTone ? userSkinTone.recommendations?.join(', ') : 'Akan dianalisis'}

Pertanyaan user: "${userMessage}"

Berikan respons yang:
- Maksimal 200 kata
- Menggunakan emoji yang relevan
- Menyebutkan tips praktis
- Jika relevan, berikan rekomendasi kombinasi outfit
- Jika ada produk, berikan saran styling khusus untuk produk tersebut

Selalu akhiri dengan pertanyaan untuk melanjutkan percakapan.
`.trim();

    try {
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
                parts: [{ text: contextPrompt }]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: API request failed`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya sedang belajar hal baru! Coba tanya yang lain ya! ✨";
    } catch (error) {
      console.error("Error generating stylist response:", error);
      return "Ups! Ada gangguan teknis. Tapi jangan khawatir, saya tetap di sini untuk membantu! 💪✨";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const botResponse = await generateAdvancedStylistResponse(userMessage);
      
      const newBotMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Maaf, koneksi sedang bermasalah! Mari coba lagi dalam beberapa saat! 🔄💫',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickSuggestions = [
    { text: "Warna apa yang cocok untuk kulit saya?", icon: "🎨" },
    { text: "Bagaimana cara mix and match outfit ini?", icon: "👗" },
    { text: "Aksesoris apa yang pas dengan style ini?", icon: "💎" },
    { text: "Tren fashion apa yang sedang in?", icon: "🔥" },
    { text: "Tips styling untuk acara formal", icon: "💼" },
    { text: "Outfit casual untuk sehari-hari", icon: "👕" }
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion.text);
  };

  const personalityButtons = [
    { id: 'friendly', label: 'Ramah', icon: FaHeart, color: 'from-pink-500 to-rose-500' },
    { id: 'professional', label: 'Profesional', icon: BiStar, color: 'from-blue-500 to-indigo-500' },
    { id: 'trendy', label: 'Trendy', icon: HiSparkles, color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 animate-pulse hover:animate-none"
          title="Chat dengan AI Stylist"
        >
          <FaRobot className="text-2xl" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-2 -left-2 text-yellow-300 animate-bounce">✨</div>
          <div className="absolute -bottom-2 -right-2 text-yellow-300 animate-bounce" style={{animationDelay: '0.5s'}}>⭐</div>
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-xs px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          💬 Chat dengan AI Stylist
        </div>
      </div>      {/* Enhanced Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${colors.card} rounded-3xl shadow-2xl w-full max-w-md h-[700px] flex flex-col overflow-hidden`}>
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <BiBot className="text-2xl" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Stylist Premium</h3>
                    <p className="text-sm opacity-90">Fashion Expert • Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Personality selector */}
              <div className="flex space-x-2 mt-4 relative z-10">
                {personalityButtons.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersonality(p.id)}
                    className={`flex-1 py-1 px-2 rounded-full text-xs font-medium transition-all ${
                      personality === p.id 
                        ? 'bg-white text-purple-700' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <p.icon className="inline mr-1" />
                    {p.label}
                  </button>
                ))}
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            </div>            {/* User info panel */}
            {userSkinTone && (
              <div className={`${glass.background} ${glass.border} p-3 border-b`}>
                <div className="flex items-center space-x-3 text-sm">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: userSkinTone.hex }}
                  ></div>
                  <span className={`${colors.text} font-medium`}>
                    Warna kulit: {userSkinTone.name}
                  </span>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${colors.background}`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.type === 'user' ? <FaUser className="text-xs" /> : <BiBot className="text-sm" />}
                    </div>                    <div className={`rounded-2xl p-4 shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : message.isWelcome
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : `${colors.card} ${colors.text} ${colors.border}`
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 
                        message.isWelcome ? 'text-purple-100' : colors.textMuted
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                      <BiBot className="text-sm" />
                    </div>                    <div className={`${colors.card} rounded-2xl p-4 shadow-lg ${colors.border}`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <p className={`text-xs ${colors.textMuted} mt-2`}>AI sedang berpikir...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className={`px-4 py-3 ${colors.card} border-t ${colors.border}`}>
                <p className={`text-xs ${colors.textMuted} mb-3 flex items-center`}>
                  <FaMagic className="mr-1 text-purple-500" />
                  Saran pertanyaan:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      className={`text-xs ${glass.background} hover:${button.secondary} px-3 py-2 rounded-xl transition-all ${colors.border} text-left ${colors.text}`}
                    >
                      <span className="mr-1">{suggestion.icon}</span>
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}            {/* Enhanced Input */}
            <div className={`p-4 ${colors.card} border-t ${colors.border}`}>
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanya apapun tentang fashion..."
                  className={`flex-1 border-2 ${colors.border} rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm ${colors.background} ${colors.text}`}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
              <p className={`text-xs ${colors.textMuted} text-center mt-2`}>
                ✨ Powered by AI • Fashion Darknessmerch ✨
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AdvancedStylistChatbot.propTypes = {
  product: PropTypes.object,
  userSkinTone: PropTypes.object
};

export default AdvancedStylistChatbot;
