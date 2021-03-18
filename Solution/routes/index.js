var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});
router.get('/media', function(req, res, next) {
  res.render('mediaCapture', { title: 'Media Capture' });
});
module.exports = router;