import { Outlet } from "react-router"
import { NavBar } from "../components"



const MainLayout = () => {
  return (
    <>
    <NavBar/>
      <Outlet />
    </>
  )
}

export default MainLayout
