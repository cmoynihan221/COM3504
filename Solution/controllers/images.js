let Image = require('../models/images');
const fs = require('fs');
exports.saveImage = function(req, res, next){
    //drop the images db
    /*Image.remove({}, function(err) {
          console.log('collection removed')
    });
    */
        let userId = req.body.userId;
        let currentTime = new Date().getTime();
        let directory = 'Solution/public/images/' + userId + '/';
        //console.log("file")
        if(!fs.existsSync(directory)){
            try {
                fs.mkdirSync(directory);
            }catch(e){
                console.log(e);
            }
        }
        console.log('Saving file to '+ directory+currentTime);

        let blob =  req.body.imageBlob.replace(/^data:image\/\w+;base64,/,"");
        let buf = new Buffer(blob, 'base64');
        let path = directory + currentTime+'.png';
        fs.writeFile(path, buf, err=>{
            console.log(err);
        });
        let filePath = directory + currentTime;
        console.log('file saved!');
        let image_data = new Image({
            user: userId,
            file_path: path
        });
        image_data.save(function(err, results){
            console.log(err)
            console.log('Results:', results);
        })
    Image.find(
        function (err, images) {
            if (err)
                res.status(500).send('Invalid data!');
            //let character =null;
            console.log(images);
            //res.setHeader('Content-Type', 'application/json');
            //res.send(JSON.stringify(images));
            //res.render('images', { title: JSON.stringify(images) });
        });
    res.end(JSON.stringify(image_data));
};

//fn that renders images on the page
exports.renderImages = function(req, res, next){
    //find all images and send in the list of the filepaths as json to the receiving page
    //render the images on the receiving page
    /*Image.remove({}, function(err) {
        console.log('collection removed')
    });*/
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