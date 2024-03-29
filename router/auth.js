const express = require('express')
const User = require('../models/userSchema')
const Match = require('../models/matchSchema')
const High = require('../models/highestSchema')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/authenticate')
const cookieParser = require('cookie-parser')


require('../db/conn')

router.use(cookieParser())

router.post('/register', async (req,res)=>{
    const matches = await Match.find({})

    matches.sort((match1, match2) => {
        return match1.matchid - match2.matchid
      })

    const {name, email, password, cpassword} = req.body

    if(!name || !email || !password || !cpassword){
        return res.status(422).json({error : "Please fill all the fields!!!"})
    }

    try{
        const userExist = await User.findOne({email : email})
        if(userExist){
            return res.status(400).json({error: "User already present with the email : " + email})
        } else if(password != cpassword){
            return res.status(401).json({error: "Passwords not matching"})
        }

        const user = new User({name, email, password, cpassword, matches})
        await user.save()

        res.json({message : "User registered succesfully"})
    }catch(err) {
        console.log(err)
    }
    
})

router.post('/signin', async (req, res)=>{

    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error : "Please fill all the fields!!!"})
    }

    try{
        const user = await User.findOne({email : email})
        
        if(!user){
            return res.status(401).json({error: "User does not exist with the email : " + email})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({error: "Invalid Credentials"})
        }
        const token = await user.genAuthToken()
        
        res.cookie("crictoken", token, {
            expires: new Date(Date.now() + 25892000000),
            // sameSite: 'None',
            // secure: true
            // httpOnly: true
        })
        res.json({message: "User signed in succesfully"})

    }catch(err){
        console.log(err)
    }
})

router.get('/dashboard', authenticate, (req, res) => {
    res.send(req.rootUser)
})

router.get('/matchesinfo', async (req,res) => {
    try{
        const matches = await Match.find({})
        res.send(matches)

    } catch(error){
        console.log(error)
    }

})

router.get('/userSelected', authenticate, async (req, res) => {

    if(!req.rootUser) {
        res.send(req.rootUser)
    }

    try{
        const user = await User.findOne({email : req.rootUser.email})
        // const user = await User.findOne({email : "dinesh.d.babu@gmail.com"})
        const highest = await High.find({})
        res.send({
            'matches' : user.matches,
            'highest' : highest
        })

    }catch(error){
        console.log(error)
    }
})

router.get('/leaders', authenticate, async (req,res) => {
    
    try{
        const user = await User.findOne({email : req.rootUser.email})
        const users = await User.find({group : user.group})
        res.send(users)
    } catch(error){
        console.log(error)
    }
})

router.post('/getSelected', async (req,res) => {
    
    const token = req.cookies.crictoken
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
    const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token})

    const selected = req.body
    
    try{
        const user = await User.findOne({email : rootUser.email})
        let matches = user.matches
        let index = false

        selected.map((select) => {
            for(let i = 0 ; i < matches.length; i++) {
                const item = matches[i]
                if (item.matchid == select.matchid){
                    index = i
                }
            }
            
            select.points = matches[index].points
            matches[index] = select
    
            user.matches = matches
            
        })

        await user.save()
        
        res.json({message: "Match details added succesfully"})


    } catch(error){
        console.log(error)
    }

})

router.get('/signoff',(req, res) => {
    res.clearCookie('crictoken', { path: '/'})
    res.status(200).send('User logged out')
})



module.exports = router