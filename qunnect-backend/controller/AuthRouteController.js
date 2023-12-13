const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function sign_up(req, res) {
    let auth = req.cookies._loggedin
    if (auth) {
        let isverified = jwt.verify(auth, process.env.SECRET_KEY)
        if (isverified) {
            res.redirect('/')
        }
    } else {
        res.render('sign-up')
    }
}

async function signup_info(req, res) {
    try {
        const{fullname,username,email,password}=req.body
      
        const user = await User.findOne({ email:email })
        if (user) {
            res.send('user already exist and cannot be register');
        } else {
            const NewUser = new User({fullname,username,email,password})
            NewUser.save()
            res.redirect('/')
        }
    } catch (error) {
        console.error(error);

    }

}

function login(req, res) {
    let auth = req.cookies._loggedin
    if (auth) {
        let isverified = jwt.verify(auth, process.env.SECRET_KEY)
        if (isverified) {
            res.redirect('/')
        }
    } else{
        res.render('login')
    }
}

async function login_info(req, res) {
    const{email,password}=req.body
    try {
        
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).send("invalid credentials");
          }
        let passmatch = await bcrypt.compare(password, user.password)
        if (!passmatch) {
                return res.status(400).send("invalid credentials"); 
        }
            let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' })
            
            res.cookie('_loggedin', token, { httpOnly: true })
            res.redirect('/')
    } catch (error) {
        console.error(error);

    }


}


function logout(req, res) {

    if (req.cookies._loggedin) {
        res.clearCookie('_loggedin')
        res.clearCookie('_loggedin', false, { maxAge: 0 });
        res.redirect('/account/login')
    }
}




module.exports = {
    login,
    login_info,
    sign_up,
    signup_info,
    logout,
}