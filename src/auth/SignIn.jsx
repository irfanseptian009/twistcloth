
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, signInWithGoogle, signInWithGithub } from "../store/auth/authSlice";
import { Link, useNavigate } from "react-router"; 
import bg from "../assets/authbg.jpg";
import { toast } from "react-toastify";
import { AiOutlineShopping } from "react-icons/ai";
import { FaGoogle, FaGithub } from "react-icons/fa"; 
import { useTheme } from "../contexts/ThemeContext";
import { ThemeToggle } from "../components/UI/ThemeToggle";
export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colors, glass, button } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { user, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input
    if (!email || !password) {
      toast.error("Harap isi semua field.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password harus lebih dari 6 karakter.");
      return;
    }

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        toast.success("Selamat Datang!", { autoClose: 2000 });
      })
      .catch(() => {
        toast.error("Email atau password salah.");
      });  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle())
      .unwrap()
      .then(() => {
        toast.success("Login dengan Google berhasil!", { autoClose: 2000 });
      })
      .catch((error) => {
        toast.error(`Login dengan Google gagal: ${error}`, { autoClose: 3000 });
      });
  };

  const handleGithubSignIn = () => {
    dispatch(signInWithGithub())
      .unwrap()
      .then(() => {
        toast.success("Login dengan GitHub berhasil!", { autoClose: 2000 });
      })
      .catch((error) => {
        toast.error(`Login dengan GitHub gagal: ${error}`, { autoClose: 3000 });
      });
  };
  return (
    <>
      <div
        className={`min-h-screen flex items-center justify-center ${colors.background} py-10 px-4 sm:px-6 lg:px-8 relative`}
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

        <AiOutlineShopping className={`${glass.background} ${glass.border} h-32 w-32 rounded-full absolute top-6 p-4 shadow-2xl backdrop-blur-lg z-10 ${colors.primary}`} />
        
        <div className={`max-w-md w-full space-y-8 p-8 ${glass.background} ${glass.border} rounded-2xl shadow-2xl mt-14 backdrop-blur-lg relative z-20`}>
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className={`mt-6 text-center text-3xl font-extrabold ${colors.text}`}>
                Masuk ke akun Anda
              </h2>
              <p className={`mt-2 text-center text-sm ${colors.textMuted}`}>
                Selamat datang kembali!
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
                    onChange={handleChange}
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handleChange}
                    className={`appearance-none ${glass.background} ${glass.border} rounded-lg block relative w-full px-4 py-3 placeholder-gray-400 ${colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200 backdrop-blur-lg`}
                    placeholder="Masukkan password"
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg ${button.primary} transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {status === "loading" ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    "Masuk"
                  )}
                </button>
                
                {/* Social Sign-In Buttons */}
                <div className="flex flex-col space-y-3">
                  <div className={`flex items-center ${colors.textMuted}`}>
                    <div className={`flex-1 h-px ${colors.border}`}></div>
                    <span className="px-3 text-sm">atau</span>
                    <div className={`flex-1 h-px ${colors.border}`}></div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className={`w-full flex justify-center items-center px-4 py-3 ${glass.border} rounded-lg ${glass.background} ${colors.text} hover:${colors.surfaceSecondary} transition-all duration-200 hover:scale-105 backdrop-blur-lg`}
                  >
                    <FaGoogle className="w-4 h-4 mr-3 text-red-500" />
                    Masuk dengan Google
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleGithubSignIn}
                    className={`w-full flex justify-center items-center px-4 py-3 ${glass.border} rounded-lg ${glass.background} ${colors.text} hover:${colors.surfaceSecondary} transition-all duration-200 hover:scale-105 backdrop-blur-lg`}
                  >
                    <FaGithub className="w-4 h-4 mr-3" />
                    Masuk dengan GitHub
                  </button>
                </div>
                
                <div className={`text-sm text-center ${colors.textMuted}`}>
                  Belum punya akun?{" "}
                  <Link
                    to="/signup"
                    className={`font-medium ${colors.primary} hover:underline transition-colors duration-200`}
                  >
                    Daftar di sini
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
