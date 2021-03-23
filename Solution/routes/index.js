var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/chats', function(req, res, next) {
  res.render('chats', { title: 'Image Browsing' });
});

router.get('/', function(req, res, next) {
  res.render('navigation', { title: 'Splash Screen' });
});
router.get('/searchChats', function(req, res, next) {
  res.render('searchChats', { title: 'Search Chats' });
});


router.get('/media', function(req, res, next) {
  res.render('mediaCapture', { title: 'Media Capture' });
});
module.exports = router;