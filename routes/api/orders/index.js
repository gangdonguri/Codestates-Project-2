'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (req, reply) {
    console.log('-------------------------------------------------------------------')
    const db = this.mongo.client.db('baedal');
    const collectionOfOrders = db.collection('order');
    const collectionOfrestaurants = db.collection('restaurants');
    const orders = await collectionOfOrders.find({}).toArray();
    const restaurants = await collectionOfrestaurants.find({}).toArray();

    let rating;
    let restaurantId;
    let restaurantMenu = [];
    let currentOrderedMenu = [];
    let result = [];

    for (let order of orders) {
      for (let restaurant of restaurants) {
        if (order.restaurant.name === restaurant.name) {
          restaurantId = restaurant._id;
          rating = restaurant.rating;
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
    let currentOrderedMenu = [];

    for (let order of orders) {
      if (req.params.id === `${order._id}`) {
        currentOrder = order;
      }
    }

    for (let restaurant of restaurants) {
      if (currentOrder.restaurant.name === restaurant.name) {
        restaurantId = restaurant._id;
        rating = restaurant.rating;
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

  fastify.post('/', async function (req, reply) {
    const courier = ['김배송', '이배송', '박배송', '권배송', '전배송']
    const db = this.mongo.client.db('baedal');
    const collectionOfOrders = db.collection('order');
    const collectionOfrestaurants = db.collection('restaurants');
    const restaurantid = this.mongo.ObjectId(req.body.restaurantId);
    const restaurants = await collectionOfrestaurants.find({ "_id": restaurantid }).toArray();

    const newOrderObjectId = this.mongo.ObjectId();
    const newConsumerObjectId = this.mongo.ObjectId();
    const currentOrdercourier = courier[Math.floor(Math.random() * 5)];
    let restaurantMenu = [];
    let orderedMenu = [];
    let insertOrderMenu = [];

    for (let menu of restaurants[0].menu) {
      restaurantMenu.push(menu);
    }

    for (let menu of req.body.menu) {
      orderedMenu.push(menu);
      delete menu._id;
      insertOrderMenu.push(menu)
    }

    await collectionOfOrders.insertOne(
      {
        "_id": newOrderObjectId,
        "deliveryInfo": {
          "status": "preparing",
          "assignedCourier": currentOrdercourier,
          "estimateDeleveryTime": 40
        },
        "consumer_id": newConsumerObjectId,
        "restaurant": {
          "name": restaurants[0].name,
          "address": restaurants[0].address
        },
        "orderedMenu": insertOrderMenu
      }
    )

    const result = {
      "_id": newOrderObjectId,
      "restaurant": {
        "_id": restaurants[0]._id,
        "name": restaurants[0].name,
        "menu": restaurantMenu,
        "address": restaurants[0].address,
        "rating": restaurants[0].rating
      },
      "orderedMenu": orderedMenu,
      "deliveryInfo": {
        "status": "PREPARING",
        "assignedCourier": "김배달",
        "estimateDeleveryTime": 40
      }
    }

    reply
      .code(201)
      .header('content-type', 'application/json')
      .send(result)

  })

}

