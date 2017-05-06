var AuthenticationController = require('./controllers/authentication'),
    userController = require('./controllers/user'),
    TodoController = require('./controllers/todos'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {
        session: false
    }),
    requireLogin = passport.authenticate('local', {
        session: false
    });

module.exports = function(app, redis) {

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router(),
        userRoutes = express.Router();

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    authRoutes.get('/protected', requireAuth, (req, res) => {
        res.send({
            content: 'Success'
        });
    });

    // user Router
    apiRoutes.use('/user', userRoutes);

    userRoutes.get('/getAllUsers', requireAuth, userController.getAllUser);
    userRoutes.post('/getUserById', requireAuth, userController.getUserById);
    userRoutes.put('/modifyUserById', requireAuth, userController.modifyUserById);
    userRoutes.delete('/deleteUserById', requireAuth, userController.deleteUserById);

    // Todo Routes
    apiRoutes.use('/todos', todoRoutes);

    todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['reader', 'creator', 'editor']), TodoController.getTodos);
    todoRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['creator', 'editor']), TodoController.createTodo);
    todoRoutes.delete('/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['editor']), TodoController.deleteTodo);
    todoRoutes.get('/redisCacheset', function(req, res) {
        redis.set('someTitle', 'data');
        return res.status(200).send('Done');
    });

    todoRoutes.get('/redisCacheget', function(req, res) {
        redis.get('someTitle', function(err, reply) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).send(reply);
        });
    });

    // Set up routes
    app.use('/api', apiRoutes);
    app.use(passport.initialize());
    app.use(passport.session());

};
