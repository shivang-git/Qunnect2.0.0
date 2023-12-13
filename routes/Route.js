const express = require('express')
const Route = express.Router()
const jwt = require('jsonwebtoken')
const { home } = require('../controller/RouteController')

const protectroute = (req, res, next) => {
    let auth = req.cookies._loggedin
    if (auth) {
        let data = jwt.verify(auth, process.env.SECRET_KEY)
        if (data) {
            req.user=data.id
            next()
        }
    } else {
        res.redirect('/account/login')
    }

}


Route
    .route('/')
    .get(protectroute, home)


module.exports = Route