import './header.css'

import shopIcon from '../ICON/shopIcon3.jpg'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../operators/UserContext'
import { CartIcon, NavIcon } from '../ICON/CartIcon'
import { openCart } from '../../STORE/reducers/cartRedecer'
import { useDispatch, useSelector } from 'react-redux'

const Navbar = () => {
  const { url } = useContext(UserContext)
  const { counter } = useSelector((state) => state.cart)
  const { user, setUser } = useContext(UserContext)
  const dispatch = useDispatch()
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    fetch(url + `/profile`, {
      credentials: 'include',
    }).then((resp) =>
      resp.json().then((userInfo) => {
        setUser(userInfo)
      })
    )
  }, [])

  const logout = () => {
    fetch(url + `/logout`, {
      credentials: `include`,
      method: `POST`,
    })
    setUser(null)
  }
  // const disPlayNav = () => {
  //   setShowNav(true)
  // }
  const userName = user?.name

  return (
    <>
      <header className='top'>
        <div className='logo'>
          <Link to='/'>
            <img src={shopIcon} className='icon' alt='logo' />
            <p className='name'>Lifella</p>
          </Link>
        </div>

        <nav className='content' id='content'>
          <ul className='lists' id='bar'>
            <Link to='/'>
              <li>Home</li>
            </Link>
            <a href='#products'>
              <li>Produts</li>
            </a>
            <a href='#social'>
              <li>Social Media</li>
            </a>
            <a href='#about-us'>
              <li>About us</li>
            </a>
          </ul>
        </nav>

        {/* After LOGIN IS PASSED */}
        {userName && (
          <div className='logged'>
            <span className='user-name'> {userName.toUpperCase()}</span>
            <a className='logout' onClick={logout}>
              Logout
            </a>
            <Link className='create' to={`/post`}>
              Update
            </Link>
          </div>
        )}

        <div className='shopping' onClick={() => dispatch(openCart())}>
          <CartIcon />
          <span>{counter}</span>
          <p>Open</p>
        </div>

        <div className='nav-icon' onClick={() => setShowNav(!showNav)}>
          <NavIcon />
        </div>
      </header>
      {showNav && (
        <nav className='content-mob' id='content-mob'>
          <ul className='lists-mob' id='bar'>
            <Link to='/'>
              <li>Home</li>
            </Link>
            <a href='#products'>
              <li>Produts</li>
            </a>
            <a href='#social'>
              <li>Social Media</li>
            </a>
            <a href='#about-us'>
              <li>About us</li>
            </a>
          </ul>
        </nav>
      )}
    </>
  )
}
export default Navbar
