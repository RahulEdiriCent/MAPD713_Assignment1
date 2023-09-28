let SERVER_NAME = 'product-api'
let PORT = 8081;
let HOST = '127.0.0.1';
let POST_COUNTER = 0;
let GET_COUNTER = 0;


let errors = require('restify-errors');
let restify = require('restify')


  // Get a persistence engine for the products
  , productsDB = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /products')
  //console.log(' /users/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.get('/products', function(req,res,next){
    console.log("get all");

    productsDB.find({}, function(error, products){
        ++GET_COUNTER
        console.log("TEST: Gets: " + GET_COUNTER + "| Posts: " + POST_COUNTER )
        res.send(products);
    })
})

server.post('/products', function(req, res, next){
    console.log("Post")


    let newProduct= {
        productId: req.body.productId,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    }

    productsDB.create( newProduct, function (error, product){
        ++POST_COUNTER
        console.log("TEST: Gets: " + GET_COUNTER + "| Posts: " + POST_COUNTER )
        res.send(201, product)
    })
})

server.del('/products/:pid', function(req,res,next){
    console.log("Delete One")

    productsDB.delete(req.params.pid, function(error, products){

        res.send(204)
    })
})

server.del('/products', function(req,res,next){
    console.log("Delete All")

    productsDB.delete({}, function(error, products){

        res.send(204)
    })
})

