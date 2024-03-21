module.exports = async () => {
    const path = require('path');
    const moduleDir = path.resolve(__dirname, '../../dist/index.js')
    const _ = require(moduleDir);
    process.env.SERVER_ADDRESS = `http://localhost:${process.env.PORT || 3000}`;
}