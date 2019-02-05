const bcrypt = require('bcryptjs')

module.exports={
    register: async (req, res) =>{
        const db = req.app.get('db')
        const {username, password, isAdmin} = req.body
        const result = await db.get_user(username) //can also be ([username])
        const existingUser = result[0]
        if(existingUser){
            return res.send(409).send('Username taken')
        }
        const hash = bcrypt.hashSync(password, 12)
        const registeredUser = await db.register_user([isAdmin, username, hash])
        const user = registeredUser[0]
        req.session.user = {isAdmin: user.is_admin, username: user.username, id: user.id}
        return res.status(201).send(req.session.user)
    },

    login: async (req, res) =>{
        const {username, password} = req.body
        const db = req.app.get('db')
        const foundUser = await db.get_user([username]) //can also be ([username])
        const user = foundUser[0]
        if(!user){
            return res.status(401).send('User not found.')
        }
        const isAuth = bcrypt.compareSync(password, user.hash)
        if(!isAuth){
            return res.status(403).send('Password incorrect')
        }
        req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username}
        return res.send(req.session.user)
    },

    logout: (req, res) =>{
        req.session.destroy()
        return res.sendStatus(200)
    }
}