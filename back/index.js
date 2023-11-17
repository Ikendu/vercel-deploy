const express = require(`express`)
const cors = require(`cors`)
const { default: mongoose } = require('mongoose')
const bcrypt = require(`bcryptjs`)
const jwt = require('jsonwebtoken')
const cookieParser = require(`cookie-parser`)
const multer = require('multer')
const uploadMd = multer({ dest: `uploads/` })
const fs = require(`fs`)
const User = require('./models/User')
const Post = require('./models/Post')
const dotenv = require(`dotenv`)

const salt = bcrypt.genSaltSync(10)
const secretJwt = `fsgsyuewy643873vncxm0q34kjd048,znahfuaoghdfj3400232`

const app = express()
dotenv.config()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(`/uploads`, express.static(__dirname + `/uploads`))

const MONGO_URL = `mongodb+srv://ecomm:11111234Aa@cluster0.cuu14a6.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL)

// app.all('/', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With')
//   next()
// })

app.post(`/register`, async (req, res) => {
  const { name, email, password } = req.body
  const hash = bcrypt.hashSync(password, salt)
  try {
    const userDoc = await User.create({ name, email, password: hash })
    res.json(userDoc)
  } catch (e) {
    res.status(400).json(e)
  }
})

app.post(`/login`, async (req, res) => {
  const { name, password } = req.body
  const userDoc = await User.findOne({ name })
  const checker = bcrypt.compareSync(password, userDoc?.password)
  if (checker) {
    //login
    // let token = await jwt.sign({ email, id: userDoc._id }, secretJwt)
    // res.json(token)
    jwt.sign({ name, id: userDoc._id }, secretJwt, {}, (err, token) => {
      if (err) throw err
      else {
        res.cookie(`token`, token).json({
          id: userDoc._id,
          name,
        })
      }
    })
  } else {
    res.status(400).json(`Wrong Credentials`)
  }
})

//to use cookie(name) on the Navbar
app.get(`/profile`, (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, secretJwt, {}, (err, info) => {
    if (err) throw err
    else res.json(info)
  })
})

app.post(`/logout`, (req, res) => {
  res.cookie(`token`, ``).json(`ok`)
})

app.post(`/post`, uploadMd.single(`file`), async (req, res) => {
  const { originalname, path } = req.file
  const div = originalname.split(`.`)
  const extension = div[div.length - 1].toLowerCase()
  const newPath = path + `.` + extension
  fs.renameSync(path, newPath)

  const { token } = req.cookies
  jwt.verify(token, secretJwt, {}, async (err, info) => {
    if (err) throw err
    const { name, price, content } = req.body
    const userPost = await Post.create({
      name,
      price,
      content,
      image: newPath,
      count: 1,
      added: false,
      author: info.id,
    })
    res.json(userPost)
  })
})

app.put(`/post`, uploadMd.single(`file`), async (req, res) => {
  let newPath = null
  if (req.file) {
    const { originalname, path } = req.file
    const div = originalname.split(`.`)
    const extension = div[div.length - 1].toLowerCase()
    newPath = path + `.` + extension
    fs.renameSync(path, newPath)
  }

  const { token } = req.cookies
  jwt.verify(token, secretJwt, {}, async (err, info) => {
    if (err) throw err
    const { id, name, price, content } = req.body
    const postDoc = await Post.findById(id)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
    if (!isAuthor) {
      res.status(400).json(`You are not the author`)
    }
    await postDoc.updateOne({
      name,
      price,
      content,
      image: newPath ? newPath : postDoc.image,
    })
    res.json(postDoc)
  })
})

app.get(`/products`, async (req, res) => {
  const products = await Post.find().populate(`author`, [`name`, `email`]).sort({ createdAt: -1 })
  //.limit(20)
  res.json(products)
})
app.get(`/product/:id`, async (req, res) => {
  const { id } = req.params
  const product = await Post.findById(id).populate(`author`, [`name`, `email`])
  res.json(product)
})
app.delete(`/delete/:id`, async (req, res) => {
  const { id } = req.params
  const result = await Post.findByIdAndDelete(id)
  res.json(result)
})

const PORT = process.env.PORT || 4000
if (PORT) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
module.exports = app
