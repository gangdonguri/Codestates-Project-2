'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/', async function (request, reply) {
    const test = this.mongo.client.db('TEST')
    const article = test.collection('text')
    await article.insertOne({ 'title': '안녕 세상아' })

    const result = await article.find({}).toArray();

    reply.send(result)
  })
}
