require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let mongoose = require('mongoose');
mongoose.connect('mongodb+srv://emilyc:cWl56emilY7@cluster0.ggryb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  original: {type: String, required: true},
  short: Number
})

let Url = mongoose.model('Url', urlSchema);

let bodyParser = require('body-parser');
let resObj = {};
app.post('/api/shorturl', bodyParser.urlencoded({extended: false}),(req, res) => {
  let input = req.body['url'];

  let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;;
  if (!input.match(urlRegex)) {
    res.json({error: 'invalid url'});
    return;
  }

  resObj['original_url'] = input;

  let inputShort = 1;
  Url.findOne({})
      .sort({short: 'desc'})
      .exec((error, result) => {
        if (!error && result != undefined) {
          inputShort = result.short +1;
        }
        if (!error) {
          Url.findOneAndUpdate(
            {original: input},
            {original: input, short: inputShort},
            {new: true, upsert: true}, 
            (error, savedUrl) => {
              if(!error) {
                resObj['short_url'] = savedUrl.short;
                res.json(resObj);
              }
            })
        }
      }) 
})


//when input the short url
app.get('/api/shorturl/:input', (req, res) => {
  let input = req.params.input;

  Url.findOne({short: input}, (error, result) => {
    if (!error || result != undefined) {
      res.redirect(result.original);
    } else {
      res.json('URL not found');
    }
  })
})