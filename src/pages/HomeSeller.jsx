
import { useNavigate } from "react-router";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export default function HomeSeller() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin"); 
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Selamat Datang, Seller!
      </h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
