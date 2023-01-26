const dotenv = require('dotenv')
const express = require('express')
const app = express()

const path = require('path')

dotenv.config({path: './config.env'})

require('./db/conn')
//const User = require('./models/userSchema')

app.use(express.json())

//link the router files for easy routing
app.use(require('./router/auth'))

const PORT = process.env.PORT || 5000

app.get('/login', (req, res)=>{
    res.send('You are logged in!!!!')
})


app.use(express.static("client/build"))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})

app.listen(PORT, ()=>{
    console.log('Server running on port :' + PORT)
})