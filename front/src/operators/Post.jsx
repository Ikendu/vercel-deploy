import { useContext, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom'
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

const Post = () => {
  const [name, setProduct] = useState(``)
  const [price, setPrice] = useState(``)
  const [content, setContent] = useState(``)
  const [files, setFiles] = useState(``)
  const [redirect, setRedirect] = useState(false)
  const { url } = useContext(UserContext)

  const postItems = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.set(`name`, name)
    data.set(`price`, price)
    data.set(`content`, content)
    data.set(`file`, files[0])

    const resp = await fetch(url + `/post`, {
      method: `POST`,
      body: data,
      credentials: `include`,
    })
    if (resp.ok) setRedirect(true)
  }
  if (redirect) {
    return <Navigate to={`/`} />
  }
  return (
    <div className='post'>
      <form onSubmit={postItems}>
        <h2>Create New Sales</h2>
        <input
          type='text'
          placeholder='Product name'
          value={name}
          onChange={(e) => setProduct(e.target.value)}
        />

        <input type='file' onChange={(e) => setFiles(e.target.files)} />

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
export default Post
