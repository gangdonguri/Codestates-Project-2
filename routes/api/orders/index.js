'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, reply) {
    const baedal = this.mongo.client.db('baedal');
    const restaurant = baedal.collection('order');
    const result = await restaurant.find({}).toArray();

    reply
      .code(200)
      .header('content-type', 'application/json')
      .send(result)
    
  })
}

