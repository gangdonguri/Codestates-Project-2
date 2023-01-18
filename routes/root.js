'use strict'

module.exports = async function (fastify, opts) {
    const db = fastify.mongo.client.db('TEST')

    fastify.get('/', async function (req, reply) {
        const result = await db.collection('text').find().toArray()

        if(result.length !== 0) {
            reply
                .code(200)
                .header('Content-type', 'Application/json')     
                .send(result)
        } else {
            reply
                .code(404)
                .header('Content-type', 'plain/text')
                .send('Not Found')
        }
    })

    fastify.post('/', async function(req, reply) {
        const result = await db.collection('text').insertOne(req.body)

        if(result) {
            reply
                .code(201)
                .header('Content-type', 'Application/json')     
                .send({
                    message: 'complete to write',
                    title: req.body.title,
                    content: req.body.content
                })
        } else {
            reply
                .code(400)
                .header('Content-type', 'plain/text')
                .send('Bad Request')
        }
    })
}
