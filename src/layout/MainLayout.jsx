import { Outlet } from "react-router"
import Header from "../components/costumer/Header"



const MainLayout = () => {
  return (
    <>

    <Header/>
      <Outlet />
    </>
  )
}

export default MainLayout
