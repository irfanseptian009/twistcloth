import { useState } from "react";
import bg from "../assets/authbg.jpg"
import { PiNote } from "react-icons/pi";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Link } from "react-router";


export default function SignUp() {

  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Harap isi semua field.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("password tidak sama");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password, );
      setSuccessMessage("Pendaftaran berhasil!");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }


  return (
    <div
    className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundRepeat: "repeat-y",
    }}
  >
    <PiNote className="bg-slate-50 h-32 w-32 rounded-full absolute mb-96  p-4 -mt-10  shadow-xl" />
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-2xl">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Daftar Akun
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
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
              className="appearance-none bg-transparent rounded-lg mt-2 block relative w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-nonefocus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Alamat Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none bg-transparent rounded-lg mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray- focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="current-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none bg-transparent rounded-lg mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Konfirmasi Password"
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="text-green-500 text-sm text-center">{successMessage}</p>
        )}

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Daftar
          </button>
        </div>

        <div className="text-sm text-center">
          Sudah punya akun?{" "}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </div>
      </form>
    </div>
  </div>
  )

}