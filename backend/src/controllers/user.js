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
    },
    async verificationUser (req, res, next) {
        // Code vérifiant qu'il y a bien un token dans l'entête
        if (!req.headers || !req.headers.hasOwnProperty('x-access-token'))
          { throw { code: 403, message: 'Token missing' } }
        // Code vérifiant la validité du token 
        if (!jws.verify(req.headers['x-access-token'],'HS256',TOKENSECRET))
          { throw { code: 403, message: 'Token invalid' } }
        // Le payload du token contient le login de l'utilisateur
        // On modifie l'objet requête pour mettre le login à disposition pour les middleware suivants
        req.login=jws.decode(req.headers['x-access-token']).payload
        const username = req.login
        const data = await userModel.findOne({ where: { username }, attributes: ['id', 'username'] })
        if (!data) throw new CodeError('User not found', status.NOT_FOUND)
    
        next()
        
    }
}
