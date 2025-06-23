import { Outlet } from "react-router"
import Header from "../components/costumer/Header"
import Navbar from "../components/costumer/NavBar"



const MainLayout = () => {
  return (
    <>
    <Navbar/>
    <Header/>
      <Outlet />
    </>
  )
}

export default MainLayout
