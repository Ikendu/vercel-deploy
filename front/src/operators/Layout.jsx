import { Outlet } from 'react-router-dom'
import Navbar from '../features/AHeader/Navbar'
import Footer from '../features/ZFooter/Footer'

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
export default Layout
