const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: '../config.env'})

const matchSchema = new mongoose.Schema({
    matchid : {
        type: Number,
        required: true
    },
    players : {
        type: Array,
        required: true
    },
    teams : {
        type: Array,
        required: true
    }
})



const Match = mongoose.model('MATCH', matchSchema)

module.exports = Match