let Image = require('../models/images');
const fs = require('fs');
let path2= require('path');
/*
Saves the image to the db
 */
exports.saveImage = function(req, res, next){
    let userId = req.body.userId;
    let currentTime = new Date().getTime();

    let parent = String(__dirname + "/../");

    let dir_path = 'public/images/'
    let directory = path2.join(parent, dir_path);
    if(!fs.existsSync(directory)){
        try {
            fs.mkdirSync(directory);
        }catch(e){
            console.log(e);
        }
    }

    let blob =  req.body.imageBlob.replace(/^data:image\/\w+;base64,/,"");
    let buf = new Buffer(blob, 'base64');
    let pathToImage = directory + currentTime+'.png';
    fs.writeFile(pathToImage, buf, err=>{
        console.log(err);
    });
    let filePath = pathToImage.replace(directory,"/images/")
    console.log('Path replacing')
        console.log(filePath)
        let image_data = new Image({
            user: userId,
            file_path: filePath
        });
        image_data.save(function(err, results){
            console.log(err)
            console.log('Results:', results);
        })
    Image.find(
        function (err, images) {
            if (err)
                res.status(500).send('Invalid data!');
            console.log(images);
        });
    res.end(JSON.stringify(image_data));
};

/*fn that renders images on the page
 */
exports.renderImages = function(req, res, next){
    //find all images and send in the list of the filepaths as json to the receiving page
    //render the images on the receiving page
    try {
        Image.find(
            function (err, images) {
                if (err) {
                    res.status(500).send('Invalid data!');
                }
                //let character =null;
                console.log(images);
                //res.setHeader('Content-Type', 'application/json');
                //res.send(JSON.stringify(images));

            })
            .then(results =>res.render('images', { images: results }));
    } catch (e) {
        res.status(500).send('error '+ e);
    }
};