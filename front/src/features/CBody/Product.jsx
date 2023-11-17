import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../../operators/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import {
  addBtn,
  addItems,
  addToCart,
  decreaseBtn,
  increaseBtn,
  productAdd,
  reduceBtn,
} from '../../STORE/reducers/cartRedecer'
import Card from '../DCart/Card'
import Payment from '../EPayment/Payment'
// import { formatISO9075 } from 'date-fns'

const Product = () => {
  const [details, setDetails] = useState([])
  const { id } = useParams()
  const { user, setUser, url } = useContext(UserContext)
  const dispatch = useDispatch()
  const { isOpen } = useSelector((state) => state.modal)

  useEffect(() => {
    fetch(url + `/profile`, { credentials: `include` }).then((resp) =>
      resp.json().then((userData) => {
        setUser(userData)
      })
    )
  }, [])

  useEffect(() => {
    fetch(url + `/product/${id}`, { credentials: `include` }).then((resp) =>
      resp.json().then((userData) => setDetails(userData))
    )
  }, [])

  const { name, price, image, content, createdAt, _id, author, added, count } = details
  return (
    <>
      {isOpen && <Payment />}
      <Card />

      <div className='product-details'>
        <h2>{name?.toUpperCase()}</h2>
        {/* <time>{formatISO9075(new Date(createdAt))}</time> */}
        <img src={url + '/' + image} />

        <div className='time-ago'>{/* <ReactTimeAgo date={createdAt} locale='en-US' /> */}</div>
        <div className='fullprice'>
          <p>N {price?.toLocaleString()}</p>
        </div>

        <div className='button-para'>
          <button
            onClick={() => {
              dispatch(addItems({ _id }))
              dispatch(productAdd({ _id }))
            }}
          >
            <span>Add to Cart</span>
          </button>
          <p className='button-para'>
            Open the cart above to increaese or decrease the quantity of this product you want to
            buy.
          </p>
        </div>
        {/* {!added ? (
          <button
            onClick={() => {
              dispatch(addItems({ _id }))
              dispatch(productAdd({ _id }))
            }}
          >
            <span>Add to Cart</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                dispatch(increaseBtn(_id))
                dispatch(addBtn(_id))
              }}
              className='plus'
            >
              +
            </button>
            <button
              className='adderBtn'
              onClick={() => {
                dispatch(addToCart({ _id }))
              }}
            >
              {count}
            </button>
            <button
              onClick={() => {
                if (count == 0) return
                dispatch(decreaseBtn(_id))
                dispatch(reduceBtn(_id))
              }}
              className='plus'
            >
              -
            </button>
          </>
        )} */}

        <h3 className='more-detail'>More Product Details</h3>
        <div className='inner-html' dangerouslySetInnerHTML={{ __html: content }} />
        {user?.name && (
          <div className='extraBtn'>
            <Link to={`/edit/${_id}`}>
              <button className='editPost'>Edit</button>
            </Link>

            <div className='time-ago'>
              <time>Post created on {createdAt}</time>

              <p>{author?.name}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
export default Product
