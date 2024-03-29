const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: '../config.env'})

const highestSchema = new mongoose.Schema({
    matchid : {
        type: Number,
        required: true
    },
    high_scores : {
        type: Array
    },
    high_wickets : {
        type: Array
    },
    mom : {
        name : String,
        data : String
    },
    winner : {
        type : String
    },
    high_fours : {
        type: Array
    },
    high_sixs : {
        type: Array
    },
    high_SR : {
        type: Array
    },
    high_econ : {
        type: Array
    }

})



const High = mongoose.model('HIGH', highestSchema)

module.exports = High