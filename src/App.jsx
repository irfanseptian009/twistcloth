
import { RouterProvider } from "react-router";
import router from "../src/router/routes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <>  <ToastContainer 
    position="top-right" 
    autoClose={3000} 
    hideProgressBar={false} 
    newestOnTop={false} 
    closeOnClick 
    rtl={false} 
    pauseOnFocusLoss 
    draggable 
    pauseOnHover 
    theme="light"
  />
  <div className="bg-white dark:bg-gray-950">

        <RouterProvider router={router} />
  </div>
    </>
  );
}

export default App;