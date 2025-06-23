import { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ThreeDViewerWithRef from '../../components/Simple3DViewer';

const GLBViewerDemo = () => {
  const { isDark } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomInTrigger, setZoomInTrigger] = useState(0);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const viewerRef = useRef();

  const takeScreenshot = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current;
      const dataURL = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = '3d-model-screenshot.png';
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`}>
      {/* Background image with glassmorphism overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/authbg.jpg')" }}
      />
      <div className={`fixed inset-0 ${
        isDark 
          ? 'bg-gray-900/80 backdrop-blur-sm' 
          : 'bg-white/30 backdrop-blur-sm'
      }`} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`backdrop-blur-xl rounded-3xl p-8 mb-8 border shadow-2xl ${
          isDark 
            ? 'bg-gray-800/30 border-gray-700/50' 
            : 'bg-white/20 border-white/30'
        }`}>
          <h1 className={`text-4xl font-bold text-center mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            🎽 3D GLB Model Viewer
          </h1>
          <p className={`text-center ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Interactive Three.js GLB model viewer with rotation, zoom, and screenshot capabilities
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
            isDark 
              ? 'bg-gray-800/30 border-gray-700/50' 
              : 'bg-white/20 border-white/30'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              3D Model Preview
            </h2>
            
            <ThreeDViewerWithRef
              ref={viewerRef}
              isRotating={isRotating}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              zoomInTrigger={zoomInTrigger}
              zoomOutTrigger={zoomOutTrigger}
              resetTrigger={resetTrigger}
            />

            {/* Controls */}
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isRotating
                      ? 'bg-purple-500 text-white border-purple-500'
                      : isDark
                      ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50'
                      : 'bg-white/50 text-gray-700 border-gray-300 hover:bg-white/70'
                  }`}
                >
                  {isRotating ? '⏸️ Stop Rotation' : '▶️ Auto Rotate'}
                </button>

                <button
                  onClick={() => setIsFullscreen(true)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50'
                      : 'bg-white/50 text-gray-700 border-gray-300 hover:bg-white/70'
                  }`}
                >
                  🔍 Fullscreen
                </button>

                <button
                  onClick={() => setZoomInTrigger(prev => prev + 1)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50'
                      : 'bg-white/50 text-gray-700 border-gray-300 hover:bg-white/70'
                  }`}
                >
                  🔍+ Zoom In
                </button>

                <button
                  onClick={() => setZoomOutTrigger(prev => prev + 1)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50'
                      : 'bg-white/50 text-gray-700 border-gray-300 hover:bg-white/70'
                  }`}
                >
                  🔍- Zoom Out
                </button>

                <button
                  onClick={() => setResetTrigger(prev => prev + 1)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isDark
                      ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50'
                      : 'bg-white/50 text-gray-700 border-gray-300 hover:bg-white/70'
                  }`}
                >
                  🔄 Reset View
                </button>

                <button
                  onClick={takeScreenshot}
                  className="px-4 py-2 rounded-lg border bg-green-500 text-white border-green-500 hover:bg-green-600 transition-all duration-200"
                >
                  📸 Screenshot
                </button>
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
            isDark 
              ? 'bg-gray-800/30 border-gray-700/50' 
              : 'bg-white/20 border-white/30'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Features
            </h2>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700/30' : 'bg-white/30'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  🎽 GLB Model Loading
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Loads baju.glb or t-shirt.glb from public folder with automatic fallback and error handling
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700/30' : 'bg-white/30'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  🖱️ Interactive Controls
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Mouse drag to rotate, scroll to zoom, with smooth damping controls
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700/30' : 'bg-white/30'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  💡 Realistic Lighting
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Ambient and directional lighting with shadow casting for realistic appearance
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700/30' : 'bg-white/30'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  📸 Screenshot Capture
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Preserves drawing buffer for high-quality screenshot capture
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700/30' : 'bg-white/30'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  🌙 Theme Integration
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Fully integrated with dark/light mode and glassmorphism design
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className={`backdrop-blur-xl rounded-3xl p-8 mt-8 border shadow-2xl ${
          isDark 
            ? 'bg-gray-800/30 border-gray-700/50' 
            : 'bg-white/20 border-white/30'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Technical Implementation
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Libraries Used:
              </h3>
              <ul className={`space-y-2 text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li>• Three.js v0.157.0 - 3D graphics library</li>
                <li>• GLTFLoader - GLB/GLTF model loading</li>
                <li>• OrbitControls - Camera interaction</li>
                <li>• React hooks - State management</li>
              </ul>
            </div>

            <div>
              <h3 className={`font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Features:
              </h3>
              <ul className={`space-y-2 text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li>• Automatic model centering & scaling</li>
                <li>• Shadow mapping & realistic lighting</li>
                <li>• Responsive design & fullscreen mode</li>
                <li>• Screenshot capture functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GLBViewerDemo;
