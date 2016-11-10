'use strict';
var exec = require('child_process').exec;
var async = require('async');

//making the calling othe commands queued
var q = async.queue(function(cmd, callback){
    exec(cmd, function(){
        setTimeout(function(){
            callback()
        },150);
    });
});

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
function buildCmd(system, unit, state){
    return cmd + system + " " + unit + " " +state;
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
            q.push(buildCmd(system, device, state), callback);
        });
};

RTAccessory.prototype.getServices = function () {
    return [this.service];
};
