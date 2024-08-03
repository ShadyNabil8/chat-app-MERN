const asynchandler = require('express-async-handler')
const chatModel = require('../models/chat')

const create = asynchandler(async (req, res) => {
    console.log('hiii');
    
})

module.exports = {create}