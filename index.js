let SERVER_NAME = 'product-api'
let PORT = 8081;
let HOST = '127.0.0.1';
let POST_COUNTER = 0;
let GET_COUNTER = 0;


let errors = require('restify-errors');
let restify = require('restify')


  // Get a persistence engine for the users
  , usersSave = require('save')('users')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /users')
  console.log(' /users/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());



