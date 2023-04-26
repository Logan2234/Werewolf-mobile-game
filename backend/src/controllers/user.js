const status = require('http-status');

const userModel = require('../models/users.js');
const usersInQModel = require('../models/usersInQs.js');
const usersInGameModel = require('../models/usersInGames.js');
const jws = require('jws')
const bcrypt = require('bcrypt') // eslint-disable-line no-unused-vars 
const CodeError = require('../util/CodeError.js')


const has = require('has-keys');
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env


module.exports = {
    async signIn(req, res){
        
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'username') || !has(JSON.parse(req.body.data), 'password'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the username and password'};

        const username = JSON.parse(req.body.data).username;
        if (username == '') throw new CodeError('You must set an username !', status.BAD_REQUEST);

        const password = JSON.parse(req.body.data).password;
        if (password == '') throw new CodeError('You must set a password !', status.BAD_REQUEST);
        const hash = await bcrypt.hash(password, 10)
        await userModel.create({"username": username, "password": hash});
        const token = jws.sign({ header: { alg: 'HS256' }, payload: username, secret: TOKENSECRET })

        res.json({status: true, message: 'User Added', token});
    },
    async logIn(req, res){
        if (!has(req.body, ['data']) || !has(JSON.parse(req.body.data), 'username') || !has(JSON.parse(req.body.data), 'password'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the username and password'};

        const username = JSON.parse(req.body.data).username;
        if (username == '') throw new CodeError('You must set an username !', status.BAD_REQUEST);
        
        const user = await userModel.findOne({where: {"username": username}});
        if (user){
            const password = JSON.parse(req.body.data).password;
            if (password == '') throw new CodeError('You must set a password !', status.BAD_REQUEST);

            bcrypt.compare(password, user.password, function(err, result) {
                if (result) {
                    const token = jws.sign({ header: { alg: 'HS256' }, payload: username, secret: TOKENSECRET })
                    res.json({ status: true, message: 'Login success', token })
                    return
                } else {
                    res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong password' })
                    return
                }
            });
        } else 
            res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong username' })
    },

    async checkWhereIAm (req, res) {
        const username = req.login
        const userId = (await userModel.findOne({where: {username}})).id
        const inSession = await usersInQModel.findOne({where: {"idUser": userId}})
        if (inSession) {
            const idSession = inSession.idGame
            res.json({status: true, message: 'User is in a session', idSession})
            return
        }
        const inGame = await usersInGameModel.findOne({where: {"idUser": userId}})
        if (inGame) {
            const idGame = inGame.idGame
            res.json({status: true, message: 'User is in a game', idGame})
            return
        }
        throw new CodeError('User is not in game or in a session', status.NOT_FOUND)
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
        
    },

    async getRole(req, res) {
        const username = req.login
        const data = await userModel.findOne({where: {username}})
        const userId = parseInt(data.id)

        let userProfile = await usersInGameModel.findOne({where: {idUser: userId}})
        if (userProfile) {
            res.json({status: true, message: 'Role of user ' + username, role: userProfile.role, pouvoir: userProfile.pouvoir, vie: userProfile.vie})
            return
        } else {
            userProfile = await usersInQModel.findOne({where: {idUser: userId}})
            if (userProfile) {
                throw new CodeError(username + " stills in the queue", status.NOT_FOUND)
            } else throw new CodeError(username + " is not in a game nor in a queue", status.NOT_FOUND)
        }
    },

    async whoAmI(req, res) {
        const username = req.login
        res.json({status: true, message: 'You\'re...', username})
    }

}
