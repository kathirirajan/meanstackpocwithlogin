var express = require('express');
var app = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cors = require('cors');
var databaseConfig = require('./config/database');
var router = require('./app/routes');
var redis = require('redis').createClient('redis://h:p77643ed6e566cde5b9211d6de4fb59682732c25a603634d118cebd8ce0f6ba96@ec2-34-206-162-178.compute-1.amazonaws.com:27859');

redis.on("error", function(err) {
  console.log(err);
});

mongoose.connect(databaseConfig.url, () => {
  console.log("Mongodb connected");
});

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate, public, max-age=0');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

router(app, redis);
app.use(express.static('./public'));

app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
