'use strict'

const fp = require('fastify-plugin')

const mongodb = require('@fastify/mongodb')

module.exports = fp(async function (fastify, opts) {
  console.log("MONGO_URL:", process.env.MONGO_URL);
  
  fastify.register(mongodb, {
    forceClose: true,
    url: 'mongodb://root:example@mongo:27017/?authMechanism=DEFAULT'
  } )
  
  console.log('mongobd 플러그인 등록 성공')
})
