import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/auth/authSlice";
import { Link, useNavigate } from "react-router";
import { PiNote } from "react-icons/pi";
import bg from "../assets/authbg.jpg";
import { Typography, Box, LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useTheme } from "../contexts/ThemeContext";
import { ThemeToggle } from "../components/UI/ThemeToggle";

export default function SignUp() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colors, glass, button } = useTheme();
  
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validasi input
    if (!email || !password || !confirmPassword) {
      alert("Harap isi semua field.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Password tidak sama.");
      return;
    }
  
    dispatch(signup({ email, password }))
      .unwrap()
      .then(() => {
        setSuccessMessage("Pendaftaran berhasil!");
        toast.success("Pendaftaran berhasil!");
      })
      .catch(() => {
        setSuccessMessage("");
      });
  };
    return (
    <div
      className={`min-h-screen flex items-center justify-center ${colors.background} py-12 px-4 sm:px-6 lg:px-8 relative`}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat-y",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle variant="floating" />
      </div>

      <PiNote className={`${glass.background} ${glass.border} h-32 w-32 rounded-full absolute mb-96 p-4 -mt-10 shadow-2xl backdrop-blur-lg z-10 ${colors.primary}`} />
      
      <div className={`max-w-md w-full space-y-8 p-8 ${glass.background} ${glass.border} rounded-2xl shadow-2xl backdrop-blur-lg relative z-20`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${colors.text}`}>
            Daftar Akun
          </h2>
          <p className={`mt-2 text-center text-sm ${colors.textMuted}`}>
            Buat akun baru untuk memulai berbelanja
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className={`block text-sm font-medium ${colors.text} mb-2`}>
                Alamat Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none ${glass.background} ${glass.border} rounded-lg block relative w-full px-4 py-3 placeholder-gray-400 ${colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 backdrop-blur-lg`}
                placeholder="contoh@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${colors.text} mb-2`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none ${glass.background} ${glass.border} rounded-lg block relative w-full px-4 py-3 placeholder-gray-400 ${colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 backdrop-blur-lg`}
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${colors.text} mb-2`}>
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`appearance-none ${glass.background} ${glass.border} rounded-lg block relative w-full px-4 py-3 placeholder-gray-400 ${colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 backdrop-blur-lg`}
                placeholder="Konfirmasi password"
              />
            </div>
          </div>

          {loading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <Typography className="text-red-400 text-sm text-center font-medium">
                {error}
              </Typography>
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
              <Typography className="text-green-400 text-sm text-center font-medium">
                {successMessage}
              </Typography>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg ${button.primary} transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </div>

          <div className={`text-sm text-center ${colors.textMuted}`}>
            Sudah punya akun?{" "}
            <Link to="/" className={`font-medium ${colors.primary} hover:underline transition-colors duration-200`}>
              Login di sini
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
