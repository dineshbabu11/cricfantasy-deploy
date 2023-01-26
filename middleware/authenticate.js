const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})

const authenticate = async (req, res, next) =>{
    try{
        const token = req.cookies.crictoken

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        
        const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token})

        if(!rootUser) {throw new Error('User not found')}
        req.token = token
        req.rootUser = rootUser

        next()

    } catch(error){
        console.log(error)
        res.status(401).send('UnAuthorized : no token provided')
    }


}

module.exports = authenticate