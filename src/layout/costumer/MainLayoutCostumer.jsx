import { Outlet } from "react-router"
import Navbar from "../../components/costumer/NavBar"


const MainLayoutCostumer = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default MainLayoutCostumer
