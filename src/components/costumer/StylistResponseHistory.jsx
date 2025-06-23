import { useState } from 'react';
import { FaHistory, FaEye, FaTimes, FaDownload, FaShare } from 'react-icons/fa';
import { BiBot } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const StylistResponseHistory = ({ responses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const { colors, glass, button } = useTheme();

  if (!responses || responses.length === 0) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadImage = (response) => {
    if (!response.image) return;
    
    const link = document.createElement('a');
    link.download = `ai-analysis-${response.product.name}-${Date.now()}.png`;
    link.href = response.image;
    link.click();
  };

  return (
    <>
      {/* History Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative ${button.secondary} px-4 py-4 rounded-xl transition-all hover:scale-105`}
        title="Lihat Riwayat Analisis AI"
      >
        <FaHistory className="" />
        <span>Riwayat AI</span>
        {responses.length > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
            {responses.length}
          </div>
        )}
      </button>

      {/* History Modal */}
      {isOpen && (
        <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`${colors.card} rounded-3xl shadow-2xl w-full max-w-5xl py-8 px-0 max-h-[95vh] overflow-visible border border-white/10 dark:border-white/20`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BiBot className="text-2xl" />
                  <div>
                    <h3 className="font-bold text-xl">Riwayat Analisis AI Stylist</h3>
                    <p className="text-sm opacity-90">{responses.length} analisis tersimpan</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="py-6 px-6 max-h-[70vh] overflow-y-auto ">
              <div className="grid md:grid-cols-2 gap-6">
                {responses.map((response, index) => (
                  <div key={index} className={`${glass.background} ${glass.border} rounded-2xl p-5 hover:shadow-xl transition-all flex flex-col h-full`}> 
                    <div className="flex items-start space-x-4">
                      {/* Screenshot Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={response.image}
                          alt={`Analysis ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-md"
                        />
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold ${colors.text} truncate`}>
                            {response.product.name}
                          </h4>
                          <span className={`text-xs ${colors.textMuted} whitespace-nowrap ml-2`}>
                            {formatDate(response.timestamp)}
                          </span>
                        </div>
                        <div className="border-b border-dashed border-purple-200 dark:border-purple-800 mb-2"></div>
                        <p className={`text-sm ${colors.textMuted} line-clamp-3 mb-3`}>{response.analysis.substring(0, 120)}...</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => setSelectedResponse(response)}
                            className="flex items-center space-x-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-all"
                          >
                            <FaEye />
                            <span>Lihat Detail</span>
                          </button>
                          <button
                            onClick={() => downloadImage(response)}
                            className="flex items-center space-x-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-all"
                          >
                            <FaDownload />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {responses.length === 0 && (
                <div className="text-center py-12">
                  <BiBot className={`text-6xl ${colors.textMuted} mx-auto mb-4`} />
                  <h3 className={`font-semibold ${colors.text} mb-2`}>Belum Ada Analisis</h3>
                  <p className={`${colors.textMuted}`}>
                    Gunakan fitur &quot;Ask AI Stylist&quot; untuk mendapatkan analisis outfit pertama Anda!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center p-4 z-60">
          <div className={`${colors.card} rounded-3xl shadow-2xl w-full max-w-3xl py-8 px-0 max-h-[95vh] overflow-visible border border-white/10 dark:border-white/20`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HiSparkles className="text-2xl" />
                  <div>
                    <h3 className="font-bold text-xl">Detail Analisis AI</h3>
                    <p className="text-sm opacity-90">{selectedResponse.product.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="py-6 px-6 max-h-[70vh] overflow-y-auto bg-white/40 dark:bg-black/30">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div>
                  <h4 className={`font-semibold ${colors.text} mb-4`}>Screenshot Outfit</h4>
                  <img
                    src={selectedResponse.image}
                    alt="Outfit analysis"
                    className="w-full rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-lg"
                  />
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => downloadImage(selectedResponse)}
                      className={`flex-1 ${button.secondary} py-2 px-4 rounded-xl transition-all hover:scale-105`}
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `AI Analysis: ${selectedResponse.product.name}`,
                            text: selectedResponse.analysis.substring(0, 100) + '...',
                            url: window.location.href
                          });
                        }
                      }}
                      className={`flex-1 ${button.secondary} py-2 px-4 rounded-xl transition-all hover:scale-105`}
                    >
                      <FaShare className="mr-2" />
                      Share
                    </button>
                  </div>
                </div>
                {/* Analysis */}
                <div>
                  <h4 className={`font-semibold ${colors.text} mb-4`}>Analisis AI Stylist</h4>
                  <div className={`${glass.background} ${glass.border} rounded-xl p-4 mb-4`}>
                    <div className={`${colors.text} text-sm whitespace-pre-wrap leading-relaxed`}>
                      {selectedResponse.analysis}
                    </div>
                  </div>
                  {/* Product Info */}
                  <div className={`${glass.background} ${glass.border} rounded-xl p-4`}>
                    <h5 className={`font-medium ${colors.text} mb-3`}>Informasi Produk</h5>
                    <div className={`text-sm ${colors.textMuted} space-y-2`}>
                      <div className="flex justify-between">
                        <span>Nama:</span>
                        <span className={`font-medium ${colors.text}`}>{selectedResponse.product.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Harga:</span>
                        <span className={`font-medium ${colors.text}`}>
                          Rp {selectedResponse.product.price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal Analisis:</span>
                        <span className={`font-medium ${colors.text}`}>
                          {formatDate(selectedResponse.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

StylistResponseHistory.propTypes = {
  responses: PropTypes.array.isRequired
};

export default StylistResponseHistory;