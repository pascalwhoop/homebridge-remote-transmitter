'use strict';
var exec = require('child_process').exec;

var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-rcswitch-pi', 'rcswitch-pi', RTAccessory);
};

var cmd = '/home/pi/applications/rcswitch-orig/send ';
function execCB(error, stdout, stderr) {
    if (error) console.log(error);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
}
function buildCmd(system, device, state){
    return cmd + system + " " + device + " " +state;
}

function RTAccessory(log, config) {

    var system = config.system;
    var device = config.device;

    var platform = this;
    this.log = log;
    this.name = config.name;
    this.service = new Service[config.service || 'Outlet'](this.name);

    this.service.getCharacteristic(Characteristic.On)
        .on('set', function (value, callback) {
            var state = value ? 1 : 0;
            platform.log(config.name, "switch -> " + state);
            exec(buildCmd(system, device, state), execCB);
            callback();
        });
};

RTAccessory.prototype.getServices = function () {
    return [this.service];
};
