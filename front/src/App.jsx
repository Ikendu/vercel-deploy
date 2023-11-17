import { useEffect } from 'react'
import Products from './features/CBody/Products'
import Card from './features/DCart/Card'
import { useDispatch, useSelector } from 'react-redux'
import { calculate, getCartItems } from './STORE/reducers/cartRedecer'
import Payment from './features/EPayment/Payment'
import FrontPage from './features/AHeader/FrontPage'
import { Routes, Route } from 'react-router-dom'
import Admin from './operators/Admin'
import Register from './operators/Register'
import Layout from './operators/Layout'
import { ContextProvider, UserContext } from './operators/UserContext'
import Post from './operators/Post'
import Product from './features/CBody/Product'
import EditPost from './operators/EditPost'

const App = () => {
  const { sales, isLoading } = useSelector((state) => state.cart)
  const { isOpen } = useSelector((state) => state.modal)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCartItems())
  }, [])

  useEffect(() => {
    dispatch(calculate())
  }, [sales])

  // if (isLoading) {
  //   return <h1>Loading...</h1>
  // }

  return (
    <>
      <ContextProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route
              index
              element={
                <div>
                  <FrontPage />
                  {isOpen && <Payment />}
                  <Card />
                  <Products />
                </div>
              }
            />
            <Route path='/admin' element={<Admin />} />
            <Route path='/register' element={<Register />} />
            <Route path='/post' element={<Post />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/edit/:id' element={<EditPost />} />
          </Route>
        </Routes>
      </ContextProvider>
    </>
  )
}

export default App
