const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: '../config.env'})

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    cpassword : {
        type: String,
        required: true
    },
    tokens : [
        {
            token : {
                type: String,
                required: true
            }
        }
    ],

    matches : [
        {
            matchid : {
                type : Number,
                required: true
            },
            team : {
                type : String
            },
            batsman : {
                type: String
            },
            bowler : {
                type: String
            },
            mom : {
                type: String
            },
            fours : {
                type: String
            },
            sixs : {
                type: String
            },
            SR : {
                type: String
            },
            econ : {
                type: String
            },
            points : {
                type: Number
            }

        }
    ],

    group : {
        type: String,
    }
})


userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next()

})

userSchema.methods.genAuthToken = async function(){
    try{
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token: token})
        await this.save()
        return token
    } catch(err){
        console.log(err)
    }
}

const User = mongoose.model('USER', userSchema)

module.exports = User