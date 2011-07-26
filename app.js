var express  = require('express');
var app   = express.createServer();
var mongoose = require('mongoose');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.configure(function() {
  app.use(express.basicAuth(process.env.USERNAME, process.env.PASSWORD));
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
})

mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.db.serverConfig.connection.autoReconnect = true;

var Schema = mongoose.Schema;

var entrySchema = new Schema({
  body       : String,
  created_at : { type: Date, default: Date.now },
  updated_at : { type: Date, default: Date.now }
});

// Timestamp
entrySchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

var Entry = mongoose.model('Entry', entrySchema);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/entries', function(req,res) {
  var skip = req.param('skip') || 0
  var limit = req.param('limit') || 1
  Entry.find({})
    .sort(['created_at'], -1)
    .limit(limit)
    .skip(skip)
    .run(function(err, docs) {
      if (err) {
        res.send(500);
      } else {
        res.json(docs);
      }
    })
});

app.post('/entries', function(req, res) {
  var entry = new Entry()
  entry.save(function(err, callback) {
    if (err) {
      res.send(500);
    } else {
      res.json(entry);
    }
  })
});

app.post('/entries/:id', function(req,res) {
  Entry.findById(req.params.id, function(err, doc) {
    if (err || !doc){
      res.send(500)
    } else {
      doc.body = req.param('body')
      doc.save(function(err) {
        if (err) {
          res.send(500)
        } else {
          res.send(200)
        }
      })
    }
  })
});

app.delete('/entries/:id', function(req, res) {
  Entry.remove({_id: req.params.id}, function(err) {
    if (err){
      res.send(500);
    } else {
      res.send(200);
    }
  });
});

var port = process.env.PORT;
app.listen(port, function(){
  console.log("Listening on " + port);
});