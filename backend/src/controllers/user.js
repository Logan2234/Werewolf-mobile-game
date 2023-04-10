const status = require('http-status');

const userModel = require('../models/users.js');
const jws = require('jws')
const bcrypt = require('bcrypt') // eslint-disable-line no-unused-vars 
const CodeError = require('../util/CodeError.js')


const has = require('has-keys');
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env


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
        
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'username') || !has(JSON.parse(req.body.data), 'password'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the username and password'};

        const username = JSON.parse(req.body.data).username;
        if (username == '') throw new CodeError('You must set an username !', status.BAD_REQUEST);

        const password = JSON.parse(req.body.data).password;
        if (password == '') throw new CodeError('You must set a password !', status.BAD_REQUEST);
    
        await userModel.create({username, password});

        res.json({status: true, message: 'User Added'});
    },
    async logIn(req, res){
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'username') || !has(JSON.parse(req.body.data), 'password'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the username and password'};

        const username = JSON.parse(req.body.data).username;
        if (username == '') throw new CodeError('You must set an username !', status.BAD_REQUEST);

        const password = JSON.parse(req.body.data).password;
        if (password == '') throw new CodeError('You must set a password !', status.BAD_REQUEST);
        
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
