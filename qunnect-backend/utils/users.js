const contacts = []

function joinUser(id, username) {
    const user = { id, username }
    contacts.push(user)
    return user
}

function removeUser(id) {
    const index=contacts.findIndex(user=>user.id===id)
    if(index!==-1){
        return contacts.splice(index,1)[0]
    }
} 


function getUser(id) {
    return contacts.find(user=>user.id===id)
}


module.exports={
    contacts,joinUser,removeUser,getUser
}
