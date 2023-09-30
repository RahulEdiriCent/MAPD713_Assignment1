//Create by Rahul Edirisinghe
//For Assignment 1 MAPD713
//Code derived from class notes and weekly example code
//App is a simple server that stores product objects, can get, post and delete

let SERVER_NAME = 'product-api' //server name
let PORT = 8082; //set server port
let HOST = '127.0.0.1';
let POST_COUNTER = 0;
let GET_COUNTER = 0;

//create reference objects for restify and restify-errors
let errors = require('restify-errors');
let restify = require('restify')


  // Get a persistence engine for the products
  , productsDB = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints:')
  console.log('http://127.0.0.1:5000/products method: GET, POST, DELETE')
  console.log('http://127.0.0.1:5000/products/:pid method: GET, DELETE')
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

//get all products
server.get('/products', function(req,res,next){
    //message as per requirements
    console.log("> products GET: received request");

    //function to find products
    productsDB.find({}, function(error, products){
        ++GET_COUNTER
        //message as per requirements
        console.log('< products GET: sending response')
        console.log("Server Requests --> Gets: " + GET_COUNTER + "| Posts: " + POST_COUNTER )
        //return all found products
        res.send(products);
    })
})

//post function that adds a new product to the system
server.post('/products', function(req, res, next){
    //message as per requirements
    console.log("> products POST: received request, creating product");

      // validate manadatory fields
        if (req.body.productId === undefined ) {
            // If there are any errors, pass them to next in the correct format
            return next(new errors.BadRequestError('ERROR! Product Id must be supplied'))
        }
        //same as above for name
        if (req.body.name === undefined ) {
            return next(new errors.BadRequestError('ERROR! Product Name (name) must be supplied'))
        }


    //if it passed validations then:
    //create new product object as a json object using the 
    // the information recieved by the request body
    let newProduct= {
        productId: req.body.productId,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    }

    

    //add the product through create
    productsDB.create( newProduct, function (error, product){

        if (error){//check for errors
            //if error occurred, then send a Error message and go to next function
            return next(new Error(JSON.stringify("ERROR! " + error.error)))
        }
        else{
            ++POST_COUNTER
            console.log("< products POST: send request, sent product");
            console.log("Server Requests --> Gets: " + GET_COUNTER + "| Posts: " + POST_COUNTER )
            
            //send newly created/added product alongside corresponding status code
            res.send(201, product)
        }
    })
})

//delete specific product from the system using product id  (pid as param)
server.del('/products/:pid', function(req,res,next){
    console.log("> products/" +req.params.pid + " DELETE: received request");

    //delete specified product using delete
    productsDB.delete(req.params.pid, function(error, products){
        if (error){//check for errors
            //if error occurred, then send a Error message and go to next function
            return next(new Error(JSON.stringify("ERROR! " + error.error)))
        }
        else{//if no errors proceed to display relevant messages and send status
            console.log("< products/" +req.params.pid + " DELETE: sending response");
            res.send(204)
        }
    })
})


//add server delete functionality that removes all products
server.del('/products', function(req,res,next){
    console.log("> products DELETE: received request")

    //delete all stored produtcs using delete
    productsDB.delete({}, function(error, products){
        if (error){//check for errors
            //if error occurred, then send a Error message and go to next function
            return next(new Error(JSON.stringify("ERROR! " + error.error)))
        }
        else{//if no errors proceed to display relevant messages and send status
            console.log("< products DELETE: sending response");
            res.send(204)
        }
    })
})

