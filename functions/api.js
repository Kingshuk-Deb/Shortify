const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ShortiFy = require('./shortiFy');
const bodyParser = require('body-parser')
const serverless = require("serverless-http");
const shortid = require('shortid');
const app = express();
const router = express.Router();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Code to establish mongoose connection
const uri = 'mongodb+srv://testuser:87654321@cluster0.caftg.mongodb.net/UserData?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
const connection = mongoose.connection;
connection.once("open", () => { console.log("MongoDB database connection established successfully."); });

router.get('/', (req, res) => {
  res.render('../dist/index.html')
});

// Route to shorten mongo
router.post('/shortit', urlencodedParser, async (req, res) => {
  if(req.body.slug === '') req.body.slug = shortid.generate();
  const slugFlag = await ShortiFy.exists({ slug: req.body.slug });
  if(slugFlag) return res.json({ error: "Slug already exists! Try another one" });
  let shorti = req.headers.host + '/' + req.body.slug;
  const newShort = new ShortiFy({
    long: req.body.url,
    short: shorti,
    slug: req.body.slug
  });
  await ShortiFy.create(newShort);
  return res.json({ shortURL: shorti });
});
  
router.get('/:slug', async (req, res) => {
  if(req.params.slug === ''){
    res.redirect('/');
  } else {
    const slugFlag = await ShortiFy.exists({ slug: req.params.slug });
    if(slugFlag) {
      const shortUrl = await ShortiFy.find({ slug: req.params.slug });
      if (shortUrl == null) return res.sendStatus(404).json({ error: "Invalid URL!" });
      let url = shortUrl[0].long;
      res.redirect(url);
    } else { res.redirect('/'); }
  }
});

app.use('/', router);

module.exports = app;
module.exports.handler = serverless(app);
