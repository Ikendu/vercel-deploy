import './card.css'
import { CartIcon } from '../ICON/CartIcon'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  addBtn,
  closeCart,
  decreaseBtn,
  increaseBtn,
  openCart,
  reduceBtn,
  removeItem,
} from '../../STORE/reducers/cartRedecer'
import { openModel } from '../../STORE/reducers/modalReducer'
import { useContext } from 'react'
import { UserContext } from '../../operators/UserContext'

const Card = () => {
  const { total, counter, isOpen, sales } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const { url } = useContext(UserContext)

  return (
    <>
      {/* <div className='shopping' onClick={() => dispatch(openCart())}>
        <CartIcon />
        <span>{counter}</span>
        <p>Open</p>
      </div> */}
      {isOpen && (
        <div className='card-shopping'>
          <div className='card-header'>
            <h2>Selections</h2>
            <h3>Happy Shopping</h3>
          </div>
          <div className='heading'>
            <p>Items</p>
            <p>Quantity</p>
          </div>
          <div>
            {sales.map(({ name, image, _id, price, count }) => (
              <div className='cardGroup' key={_id}>
                <div className='listItems'>
                  <img src={url + `/` + image} alt={name} style={{ width: 70 }} />
                  <div className='details'>
                    <p>{name}</p>
                    <p className='gapping'>N {price.toLocaleString()}</p>
                    <button onClick={() => dispatch(removeItem(_id))}>remove</button>
                  </div>
                </div>
                <div className='counter'>
                  <button
                    onClick={() => {
                      dispatch(increaseBtn(_id))
                      dispatch(addBtn(_id))
                    }}
                  >
                    +
                  </button>
                  <p>{count}</p>
                  <button
                    onClick={() => {
                      if (count == 1) dispatch(removeItem(_id))
                      else {
                        dispatch(decreaseBtn(_id))
                        dispatch(reduceBtn(_id))
                      }
                    }}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className='total-amount'>Total</p>
          <div className='checkout'>
            <div className='final' onClick={() => dispatch(openModel())}>
              Pay here
            </div>
            <div className='total'>N{total.toLocaleString()}</div>
            <div className='closeShopping' onClick={() => dispatch(closeCart())}>
              Minimize
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default Card
