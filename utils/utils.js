const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

function parseDate(str) {
    const mdy = str.split('-')
    //console.log(mdy[0] , mdy[1] , mdy[2])
    return new Date(mdy[0], parseInt(mdy[1] , 10 ) - 1, mdy[2]);
}
    
function diffDay(first, second) {
    //console.log(parseDate(first) , parseDate(second))
    return Math.abs(Math.round((parseDate(first) - parseDate(second))/(1000*60*60*24)) ) + 1; // 1,314,000
}

function diffWorkDay(startDate, endDate) {
    let count = 0;
    const curDate = new Date(`${startDate}`.split("T")[0].split(" ")[0]);
    const futureDate = new Date(`${endDate}`.split("T")[0].split(" ")[0]);
    while (curDate <= futureDate) {
        const dayOfWeek = curDate.getDay();
        if(dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return Math.abs(count);
}

async function processFileAttachment(file , imageName , imageLocation) {
    // const pathDestination = path.join(imageLocation, `${created_date}/` )
    const pathDestination = path.join(imageLocation)
    if(!fs.existsSync(pathDestination)){
        fs.mkdirSync(pathDestination);
        fs.chmodSync(pathDestination, 0o777);
    }
    const fileDestination = path.join( pathDestination , file.filename )
    await sharp(file.path).toFormat('jpeg').resize({ width: 500 }).toFile(fileDestination).then(data => {
        fs.unlinkSync( file.path ) 
        fs.renameSync( fileDestination , path.join( pathDestination , `${imageName}.jpeg` /* + path.extname(file.originalname) */ ) )
        console.log( path.join( pathDestination , `${imageName}` + path.extname(file.originalname) ) )
    });
}

function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

module.exports = { 
    parseDate,
    diffDay,
    diffWorkDay,
    processFileAttachment,
    checkFileType,
  };