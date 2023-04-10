const status = require('http-status');

const userModel = require('../models/users.js');


const has = require('has-keys');


module.exports = {
    // async getUserById(req, res){
    //     if(!has(req.params, 'id'))
    //         throw {code: status.BAD_REQUEST, message: 'You must specify the id'};

    //     let {id} = req.params;

    //     let data = await userModel.findOne({where: {id}});

    //     if(!data)
    //         throw {code: status.BAD_REQUEST, message: 'User not found'};

    //     res.json({status: true, message: 'Returning user', data});
    // },

    // async getUsers(req, res){
    //     let data = await userModel.findAll();

    //     res.json({status: true, message: 'Returning users', data});
    // },

    async signIn(req, res){
        if(!has(req.params, ['username', 'pasword']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the username and password'};

        let { username, password } = req.body;
        
        await userModel.create({username, password});

        res.json({status: true, message: 'User Added'});
    },
    async logIn(req, res){
        if(!has(req.params, ['username', 'pasword']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the username and password'};

        let { username, password } = req.body;
        
        const user = await userModel.findOne({where: {username, password}});

        if (user){
            const token = jws.sign({ header: { alg: 'HS256' }, payload: username, secret: TOKENSECRET })
            res.json({ status: true, message: 'Login success', token })
            return
        }
        res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong username or password' })
    },
    async updateUser(req, res){
        if(!has(req.body, ['id', 'name', 'email']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id, name and email'};

        let { id, name, email } = req.body;
    
        await userModel.updateUser({name, email}, {where:{id}});

        res.json({status: true, message: 'User updated'});
    },
    async deleteUser(req, res){
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id'};

        let { id } = req.params;

        await userModel.destroy({where: {id}});

        res.json({status: true, message: 'User deleted'});
    }
}
