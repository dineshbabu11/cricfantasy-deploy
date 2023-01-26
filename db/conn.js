const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE

mongoose.set("strictQuery", false)
mongoose.connect(DB).then(() => {
    console.log('DB connection succesful!!!')
}).catch((err) => console.log("DB connection failure"))

