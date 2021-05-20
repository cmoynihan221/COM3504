var express = require('express');
var router = express.Router();
const fs = require('fs');
let image = require("../controllers/images");
/* GET home page. */
router.get('/chats', function(req, res, next) {
  res.render('chats', { title: 'Image Browsing' , imagePath:""});
});

router.get('/chats/:image_path/:folder/:image', function(req, res, next) {
  let imagepath = "/"+req.params['image_path'] +"/"+req.params['folder'] +"/"+req.params['image']
  res.render('chats', { title: 'Image Browsing' , imagePath: imagepath});
});

router.post('/save_image',image.saveImage);
router.get('/allImages',image.renderImages);

router.get('/', function(req, res, next) {
  res.render('navigation', { title: 'Login' });
});
router.get('/searchChats', function(req, res, next) {
  res.render('searchChats', { title: 'Search Chats' });
});


router.get('/media', function(req, res, next) {
  res.render('mediaCapture', { title: 'Media Capture' });
});
module.exports = router;