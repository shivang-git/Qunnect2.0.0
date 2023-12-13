const express = require('express')
const AuthRoute = express.Router()

const {
    login,
    login_info,
    sign_up,
    signup_info,
    logout
} = require('../controller/AuthRouteController')



AuthRoute
    .route('/login')
    .get(login)
    .post(login_info)

AuthRoute
    .route('/sign-up')
    .get(sign_up)
    .post(signup_info)


AuthRoute
    .route('/logout')
    .get(logout)

module.exports = AuthRoute