'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, reply) {
    console.log('-------------------------------------------------------------------')
    const db = this.mongo.client.db('baedal');
    const collectionOfOrders = db.collection('order');
    const collectionOfrestaurants = db.collection('restaurants');
    const orders = await collectionOfOrders.find({}).toArray();
    const restaurants = await collectionOfrestaurants.find({}).toArray();

    let rating = 0;
    let restaurantId;
    let restaurantMenu = [];
    let currentOrderedMenu = [];
    let result = [];

    for (let order of orders) {
      for (let restaurant of restaurants) {
        if (order.restaurant.name === restaurant.name) {
          restaurantId = restaurant._id;
          for (let i = 0; i < restaurant.menu.length; i++) {
            restaurantMenu.push(restaurant.menu[i])
          }
        }
      }

      for (let i = 0; i < order.orderedMenu.length; i++) {
        currentOrderedMenu.push(order.orderedMenu[i])
      }
      
      result.push(
        {
          "_id": `${order._id}`,
          "restaurant": {
            "_id": `${restaurantId}`,
            "name": `${order.restaurant.name}`,
            "menu": restaurantMenu,
            "address": `${order.restaurant.address}`,
            "rating": rating,
          },
          "orderedMenu": currentOrderedMenu,
          "deliveryInfo": order.deliveryInfo
        }
      )
      restaurantMenu = [];
      currentOrderedMenu = [];
      rating += 1
    }

    reply
      .code(200)
      .header('content-type', 'application/json')
      .send(result)
    
  })

  fastify.get('/:id', async function (req, reply) {
    const db = this.mongo.client.db('baedal');
    const collectionOfOrders = db.collection('order');
    const collectionOfrestaurants = db.collection('restaurants');
    const orders = await collectionOfOrders.find({}).toArray();
    const restaurants = await collectionOfrestaurants.find({}).toArray();
    
    let currentOrder;
    let restaurantId;
    let restaurantMenu = [];
    let rating;
    let index = 0;
    let currentOrderedMenu = [];

    for (let order of orders) {
      if (req.params.id === `${order._id}`) {
        currentOrder = order;
        rating = index;
      }
      index += 1;
    }

    for (let restaurant of restaurants) {
      if (currentOrder.restaurant.name === restaurant.name) {
        restaurantId = restaurant._id;
        for (let i = 0; i < restaurant.menu.length; i++) {
          restaurantMenu.push(restaurant.menu[i])
        }
      }
    }

    for (let i = 0; i < currentOrder.orderedMenu.length; i++) {
      currentOrderedMenu.push(currentOrder.orderedMenu[i])
    }

    const result = {
      "_id": `${currentOrder._id}`,
      "restaurant": {
        "_id": `${restaurantId}`,
        "name": `${currentOrder.restaurant.name}`,
        "menu": restaurantMenu,
        "address": `${currentOrder.restaurant.address}`,
        "rating": rating
      },
      "orderedMenu": currentOrderedMenu,
      "deliveryInfo": currentOrder.deliveryInfo
    }

    reply
      .code(200)
      .header('content-type', 'application/json')
      .send(result)

  })
}

