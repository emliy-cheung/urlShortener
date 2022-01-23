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
  resObj['original_url'] = input;

  let inputShort = 1;
  Url.findOne({})
      .sort({short: 'desc'})
      .exec((err, res) => {
        if (!error && result != undefined) {
          inputShort = res.short +1;
        }
        if (!error) {
          Url.findOneAndUpdate(
            {original: input},
            {original: input, short: inputShort},
            {new: true, upsert: true}, 
            (err, savedUrl) => {
              if(!error) {
                resObj['short_url'] = savedUrl.short;
                res.json(resObj);
              }
            })
        }
      })

  
})