let Image = require('../models/images');
const fs = require('fs');
exports.saveImage = function(req, res, next){
    //drop the images db
    Image.remove({}, function(err) {
          console.log('collection removed')
    });
        let userId = req.body.userId;
        let currentTime = new Date().getTime();
        let directory = './images/' + userId + '/';
        if(!fs.existsSync(directory)){
            try {
                fs.mkdirSync(directory,  { recursive: true });
            }catch(e){
                console.log(e);
            }
        }
        console.log('Saving file to '+ directory+currentTime);

        let blob =  req.body.imageBlob.replace(/^data:image\/\w+;base64,/,"");
        let buf = new Buffer(blob, 'base64');
        let path = directory + currentTime+'.png' ;
        console.log(typeof path);
        fs.writeFile(path, buf, err=>{
            console.log(err);
        });
        let filePath = directory + currentTime;
        console.log('file saved!');
        let image_data = new Image({
            user: userId,
            filePath: filePath
        });
        image_data.save(function(err, results){
            console.log(err)
            console.log('Results:', results);
        })
    res.end(JSON.stringify(image_data));
};