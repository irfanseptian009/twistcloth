import { Outlet } from "react-router"
import { NavBar } from "../components"
import Header from "../components/costumer/Header"



const MainLayout = () => {
  return (
    <>
    <NavBar/>
    <Header/>
      <Outlet />
    </>
  )
}

export default MainLayout
