//Create by Rahul Edirisinghe
//For Assignment 1 MAPD713
//Code derived from class notes and weekly example code
//App is a simple server that stores product objects, can get, post and delete

let SERVER_NAME = 'product-api' //server name
let PORT = 3000; //set server port
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

//GET FUNCTIONITY==================================
//get all products---------------------------------
server.get('/products', function(req,res,next){
    //message as per requirements
    console.log("> products GET: received request");

    //function to find products
    productsDB.find({}, function(error, products){
        if (error){//check for errors
            //if error occurred, then send a Error message and go to next function
            return next(new Error(JSON.stringify("ERROR! " + error.errors)))
        }
        else{//if no errors proceed to display relevant messages and send succesfull response
            ++GET_COUNTER
            //message as per requirements
            console.log('< products GET: sending response')
            console.log("Server Requests --> Gets: " + GET_COUNTER + "| Posts: " + POST_COUNTER )
            //return all found products
            res.send(products);
        }
    })
})

//get specific product using product id (pid as param)---------------
server.get('/products/:pid', function(req,res,next){
    //message as per requirements
    console.log("> products/"+ req.params.pid +" GET: received request");

    //function to find products
    productsDB.find({productId: Number(req.params.pid)}, function(error, product){
        if (error){//check for errors
            //if error occurred, then send a Error message and go to next function
            return next(new Error(JSON.stringify("ERROR! " + error.errors)))
        }
        else{//if no errors proceed to display relevant messages and send succesfull response
            ++GET_COUNTER //increament counter
            //message as per requirements
            console.log('< products GET: sending response')
            console.log("Server Requests --> Gets: " + GET_COUNTER + "| Posts: " + POST_COUNTER )//show how many get and post request were made
            
            if(product){//if product was found
                //returns found product
                res.send(product);
            }else{//if product was not found
                console.log("Cound not find product with Id: " + req.params.pid)
                res.send(404)
            }
        }
    });
});

//POST FUNCTIONALITY============================================
//post function that adds a new product to the system------------
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
                return next(new Error(JSON.stringify("ERROR! " + error.errors)))
            }
            else{//if no errors proceed to display relevant messages and send succesfull response
                ++POST_COUNTER //increament counter
                console.log("< products POST: send request, sent product");
                console.log("Server Requests --> Gets: " + GET_COUNTER + "| Posts: " + POST_COUNTER );//show how many get and post request were made
                
                //send newly created/added product alongside corresponding status code and product data
                res.send(201, product)
            }
        });
})

//DELETE FUNCTIONALITY==============================================
//delete specific product from the system using product id  (pid as param)-----------
server.del('/products/:pid', function(req,res,next){
    console.log("> products/" +req.params.pid + " DELETE: received request");

    //delete specified product using deleteOne
    productsDB.deleteOne({productId: Number(req.params.pid)}, function(error, product){
        if (error){//check for errors
            //if error occurred, then send a Error message and go to next function
            return next(new Error(JSON.stringify("ERROR! " + error.errors)));
        }
        else{//if no errors proceed to display relevant messages and send succesfull response
            console.log("< products/" +req.params.pid + " DELETE: sending response");
            res.send(204)
        }
    });
});


//add server delete functionality that removes all products---------------------------
server.del('/productsp', function(req,res,next){
    console.log("> products DELETE: received request")

    //delete all stored produtcs using deleteMany
    productsDB.deleteMany({}, function(error, products){
        console.log("< products DELETE: sending response");
        if (error){//check for errors
            //if error occurred, then send a Error message and go to next function
            console.log(":::")
            return next(new Error(JSON.stringify("ERROR! " + error.errors)))
        }
        else{//if no errors proceed to display relevant messages and send status
            
            res.send(204,products)
        }
    });
});

