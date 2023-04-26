const userModel = require('../models/users.js')
const inGamesModel = require('../models/inGames.js')
const gamesModel = require('../models/games.js')
const lieuModel = require('../models/lieus.js')
const urneModel = require('../models/urnes.js')
const usersInGameModel = require('../models/usersInGames.js')
const usersInQModel = require('../models/usersInQs.js')
const salleEspiritismeModel = require('../models/salleEspiritisme.js')
const messageModel = require('../models/messages.js')

const bcrypt = require('bcrypt');
// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  const passhash = await bcrypt.hash('123456', 2)
  await userModel.create({
    username: 'lurivanj',
    password: await bcrypt.hash('test', 10)
  })
  await userModel.create({
    username: 'willeml',
    password: await bcrypt.hash('test', 10)
  })
  await inGamesModel.destroy({where: {}, truncate: true})
  await gamesModel.destroy({where: {}, truncate: true})
  await lieuModel.destroy({where: {}, truncate: true})
  await urneModel.destroy({where: {}, truncate: true})
  await usersInGameModel.destroy({where: {}, truncate: true})
  await usersInQModel.destroy({where: {}, truncate: true})
  await salleEspiritismeModel.destroy({where: {}, truncate: true})
  await messageModel.destroy({where: {}, truncate: true})
  
})()
