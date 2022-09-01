const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    fullname: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String }
})

UserSchema.pre('save', async function() {
    let salt = await bcrypt.genSalt(10)
    let pass = this.password
    let hashpass = await bcrypt.hash(pass, salt)
    this.password = hashpass

})

const User = new mongoose.model('User', UserSchema)


module.exports = User