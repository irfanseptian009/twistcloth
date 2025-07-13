import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store'
import { ThemeProvider } from './contexts/ThemeContext'

// Import CORS diagnostic in development
if (import.meta.env.DEV) {
  import('./utils/corsDiagnostic.js').then(({ runFullDiagnostic }) => {
    // Make diagnostic available globally in development
    window.runCORSDiagnostic = runFullDiagnostic;
    console.log("🔧 CORS diagnostic available: Run 'window.runCORSDiagnostic()' in console");
  });
  
  import('./utils/cloudinaryDiagnostic.js').then(({ runCloudinaryDiagnostic }) => {
    // Make Cloudinary diagnostic available globally in development
    window.runCloudinaryDiagnostic = runCloudinaryDiagnostic;
    console.log("☁️ Cloudinary diagnostic available: Run 'window.runCloudinaryDiagnostic()' in console");
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
