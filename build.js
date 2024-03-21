const fs = require('fs-extra');
try {
    // Remove current build
    fs.removeSync('./dist/');
    fs.copySync('./migrations/', './dist/migrations');
} catch (err) {
    console.log(err);
}
