var jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var User = require('../models/user');
var authConfig = require('../../config/auth');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "meanstackpoc@gmail.com",
        pass: "Raju@1990"
    }
});

function generateToken(user) {
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}

function setUserInfo(request) {
    return {
        _id: request._id,
        email: request.email,
        name: request.name,
        password: request.password
    };
}

exports.login = function(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(406).send(errors);
    }
    else {

        var user = {
            email: req.body.email,
            password: req.body.password,
        };

        User.findOne({
            email: user.email
        }, function(err, existingUser) {
            if (err) {
                return next(err);
            }
            if (existingUser) {
                var userInfo = setUserInfo(existingUser);
                res.status(200).json({
                    success: true,
                    token: 'JWT ' + generateToken(userInfo),
                    userDetails: userInfo
                });
            }
        });
    }
};

exports.register = function(req, res, next) {

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confPassword', 'Confirm Password is required').notEmpty();
    req.checkBody('password', 'Password dose not match').equals(req.body.confPassword);

    var errors = req.validationErrors();

    if (errors) {
        res.status(406).send(errors);
    }
    else {
        var user = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        };

        User.findOne({
            email: user.email
        }, function(err, existingUser) {
            if (err) {
                return next(err);
            }
            if (existingUser) {
                return res.status(422).send({
                    error: 'That email address is already in use'
                });
            }
            var userCreate = new User({
                email: user.email,
                name: user.name,
                password: user.password,
            });
            userCreate.save(function(err, user) {
                if (err) {
                    return next(err);
                }
                var userInfo = setUserInfo(user);

                var mailOptions = {
                    from: 'meanstackpoc@gmail.com',
                    to: userInfo.email,
                    cc: 'kathirirajanv@gmail.com',
                    subject: 'MEAN Stack POC - Hello ' + user.name,
                    text: 'Hi ' + user.name + ', <br> User created, Login Email Id ' + user.email + 'are Created',
                    html: 'Hello ' + user.name + '<p>You are registed to MEAN Stack POC and following are the login credential</p > <ul><li><b>Email Id : ' + user.email + '</b> </li><li><b>Password : ' + req.body.password + '</b> </li> </ul>'
                };
                transporter.sendMail(mailOptions, function(error, response) {
                    if (error) {
                        console.log(error);
                        res.end("error");
                    }
                    else {
                        console.log("Message sent: " + response.response);
                        res.status(201).json({
                            success: true,
                            token: 'JWT ' + generateToken(userInfo),
                            userDetails: userInfo
                        });
                    }
                });

                res.status(201).json({
                    success: true,
                    token: 'JWT ' + generateToken(userInfo),
                    userDetails: userInfo
                });
            });
        });
    }
};

exports.roleAuthorization = function(roles) {
    return function(req, res, next) {
        var user = req.user;
        User.findById(user._id, function(err, foundUser) {
            if (err) {
                res.status(422).json({
                    error: 'No user found.'
                });
                return next(err);
            }
            if (roles.indexOf(foundUser.role) > -1) {
                return next();
            }
            res.status(401).json({
                error: 'You are not authorized to view this content'
            });
            return next('Unauthorized');
        });
    };
};
