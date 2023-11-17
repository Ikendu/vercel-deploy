import './body.css'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  addBtn,
  addItems,
  addToCart,
  decreaseBtn,
  increaseBtn,
  productAdd,
  reduceBtn,
} from '../../STORE/reducers/cartRedecer'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../operators/UserContext'
import { Link } from 'react-router-dom'

// import TimeAgo from 'javascript-time-ago'
// import en from 'javascript-time-ago/locale/en.json'
// import ru from 'javascript-time-ago/locale/ru.json'
// import ReactTimeAgo from 'react-time-ago'
// TimeAgo.addDefaultLocale(en)
// TimeAgo.addLocale(ru)

const Products = () => {
  const { products, isLoading } = useSelector((state) => state.cart)

  // useEffect(() => {
  //   fetch(`http://localhost:4000/products`).then((resp) => {
  //     resp.json().then((products) => {
  //       console.log(products)
  //     })
  //   })
  // }, [])

  if (isLoading) {
    return (
      <div className='loading'>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div className='container'>
      <div className='heading-product' id='products'>
        <h2>Current Products on Sale</h2>
      </div>
      <section className='list'>
        {products.map((items) => (
          <Display {...items} key={items._id} />
        ))}
      </section>
    </div>
  )
}

const Display = ({ image, name, price, _id, added, count, createdAt, author }) => {
  const dispatch = useDispatch()
  const { user, setUser, url } = useContext(UserContext)

  useEffect(() => {
    fetch(url + `/profile`, { credentials: 'include' }).then((resp) =>
      resp.json().then((userData) => {
        setUser(userData)
      })
    )
  }, [])

  const deleteItem = (id) => {
    fetch(url + `/delete/${id}`, {
      method: `DELETE`,
    }).then((res) => {
      console.log(res)
      window.location.reload()
    })
  }

  return (
    <div className='item' key={_id}>
      <Link to={`/product/${_id}`}>
        <img src={url + `/` + image} alt={name} />
      </Link>

      <p className='title'>{name}</p>
      <p>N {price.toLocaleString()}</p>

      {!added ? (
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
      )}

      <div className='extraBtn'>
        {user?.name && (
          <div>
            <Link to={`/edit/${_id}`}>
              <button className='editPost'>Edit</button>
            </Link>
            <button onClick={() => deleteItem(_id)} className='deletePost'>
              Delete
            </button>
          </div>
        )}

        <Link to={`/product/${_id}`}>
          <button className='more-details'>More details</button>
        </Link>
      </div>
    </div>
  )
}
export default Products
