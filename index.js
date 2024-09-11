const devices = require('../file/devices.json');
const equipments = require('../file/equipments.json');
const pm = require('../file/pm.json');

module.exports = () => ({
    devices: devices,
    equipments: equipments,
    pm: pm
});