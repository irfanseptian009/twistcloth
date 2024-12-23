import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/auth/authSlice";
import { Link, useNavigate } from "react-router";
import { CiShop } from "react-icons/ci";
import bg from "../assets/authbg.jpg";
import { Box, LinearProgress } from '@mui/material';

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      alert("Harap isi semua field.");
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat-y",
      }}
    >
      <CiShop className="bg-slate-50 h-32 w-32 rounded-full absolute mb-96 p-4 shadow-xl" />
      <div className="max-w-md w-full h-96 space-y-8 p-8  bg-white rounded-2xl shadow-xl mt-16">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Masuk sebagai seller
        </h2>
      
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none bg-transparent rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Alamat email"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none bg-transparent rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              status === 'loading' ? "bg-blue-300" : "bg-slate-800 hover:bg-blue-900"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {status === "loading" ? 
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box> 
              : "Masuk"
            }
          </button>  
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div className="text-sm text-center">
            Belum punya akun?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-500 hover:text-blue-700"
            >
              Daftar disini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
