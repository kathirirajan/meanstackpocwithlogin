var User = require('../models/user');

exports.getAllUser = function(req, res, next) {
    User.find({
        email: {
            $ne: req.headers.email
        }
    }).exec((err, users) => {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
};

exports.getUserById = function(req, res, next) {
    User.find({
        _id: req.body._id
    }).exec((req.body,
        (err, result) => {
            if (!err) {
                var userById = {
                    _id: result[0]._id,
                    name: result[0].name,
                    email: result[0].email
                };
                res.json(userById);
            }
            else {
                res.send(err);
            }
        }));
};

exports.modifyUserById = function(req, res, next) {
    var modifyUser = {
        email: req.body.email,
        name: req.body.name,
    };
    User.findByIdAndUpdate(req.body._id, {
        $set: modifyUser
    }, {
        new: true
    }).exec((req.body,
        (err, result) => {
            if (!err) {
                var userById = {
                    name: result.name,
                    email: result.email
                };
                res.json(userById);
            }
            else {
                res.send(err);
            }
        }));
};

exports.deleteUserById = function(req, res, next) {
    console.log(req.body._id)
    User.remove({
        _id: req.body._id
    }, function(err, user) {
        if (!err) {
            res.json(user);
        }
        else {
            res.send(err)
        }
    });
}

// exports.createTodo = function(req, res, next) {

//     Todo.create({
//         title: req.body.title
//     }, function(err, todo) {

//         if (err) {
//             res.send(err);
//         }

//         Todo.find(function(err, todos) {

//             if (err) {
//                 res.send(err);
//             }

//             res.json(todos);

//         });

//     });

// }

// exports.deleteTodo = function(req, res, next) {

//     Todo.remove({
//         _id: req.params.todo_id
//     }, function(err, todo) {
//         res.json(todo);
//     });

// }
