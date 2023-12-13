const User=require('../models/Users')
async function home(req, res) {
    const user=await User.findOne({_id:req.user})
    res.render('home',{
        username:user.fullname
    })
}

module.exports = { home }