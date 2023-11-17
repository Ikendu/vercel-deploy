import { useContext, useEffect, useState } from 'react'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate, useParams } from 'react-router-dom'
import { UserContext } from './UserContext'

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
]

const EditPost = () => {
  const { id } = useParams()
  const [name, setProduct] = useState(``)
  const [price, setPrice] = useState(``)
  const [content, setContent] = useState(``)
  const [files, setFile] = useState(``)
  const [redirect, setRedirect] = useState(false)
  const { url } = useContext(UserContext)

  useEffect(() => {
    fetch(url + `/product/${id}`, { credentials: `include` }).then((resp) =>
      resp.json().then((productInfo) => {
        const { name, price, content } = productInfo
        setProduct(name)
        setPrice(price)
        setContent(content)
      })
    )
  }, [])

  const editItems = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.set(`name`, name)
    data.set(`price`, price)
    data.set(`content`, content)
    if (files?.[0]) data.set(`file`, files?.[0])
    data.set(`id`, id)

    const resp = await fetch(url + `/post`, {
      method: `PUT`,
      body: data,
      credentials: `include`,
    })
    resp.ok && setRedirect(true)
  }
  if (redirect) {
    return <Navigate to={`/product/${id}`} />
  }

  return (
    <div className='post'>
      <form onSubmit={editItems}>
        <h2>Edit Post</h2>
        <input
          type='text'
          placeholder='Product name'
          value={name}
          onChange={(e) => setProduct(e.target.value)}
        />

        <input type='file' onChange={(e) => setFile(e.target.files)} />

        <input
          type='number'
          placeholder='Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <ReactQuill
          modules={modules}
          formats={formats}
          value={content}
          onChange={(newValue) => setContent(newValue)}
        />
        <input type='submit' className='btn' />
      </form>
    </div>
  )
}
export default EditPost
