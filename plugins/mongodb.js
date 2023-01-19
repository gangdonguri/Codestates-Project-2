'use strict'

const fp = require('fastify-plugin')

const { MONGO_HOSTNAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env

module.exports = fp(async function (fastify, opts) {
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:27017/?authMechanism=DEFAULT`
  console.log(url)

  fastify.register(require('@fastify/mongodb'), {
    forceClose: true,
    url: url
  })

  console.log('플러그인 등록에 성공하였습니다.')
})
