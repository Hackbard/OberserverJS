Observer = function () {
    this.init();
};
/**
 * all triggers
 * @type Array({String, Function})
 */
Observer.prototype.callBacks = {eventIndex: []};
/**
 * Status for device is Ready
 * @type Boolean
 */
Observer.prototype.deviceIsReady = false;
Observer.prototype.batchAtStart = [];

Observer.prototype.init = function () {
    console.log("Observer init");
    var that = this;
    this.isLoaded = false;
    document.addEventListener('DOMContentLoaded', function () {
        console.log("DOM fully loaded and parsed");
        that.onDeviceReady();
    }, false);
    return this;
};
/**
 * set a new bind
 * @param {String} event
 * @param {Function} callBack
 * @returns {void}
 */
Observer.prototype.bind = function (event, callBack) {
    //add to event Index index
    console.log("bind: " + event);
    if (this.callBacks.eventIndex.indexOf(event) === -1) {
        this.callBacks.eventIndex.push(event);
    }
    if (!this.callBacks.hasOwnProperty(event)) {
        this.callBacks[event] = [];
    }
    this.callBacks[event].push(callBack);
};
/**
 * remove a bind
 * @param {String} event
 * @returns {void}
 */
Observer.prototype.unbind = function (event) {
    //add to event Index index
    console.log("unbind: " + event);
    if (event !== "" && this.callBacks.hasOwnProperty(event)) {
        delete this.callBacks[event];
    }    
};
/**
 * trigger an event and send hin data
 * @param {String} eventName
 * @param {String|Object|Boolean|void} data
 * @returns {void|boolean}
 */
Observer.prototype.trigger = function (eventName, data) {
    console.log('Received Event: ' + eventName);
    if (typeof eventName === undefined || typeof eventName === "undefined" || eventName === undefined || eventName === "undefined" || eventName.trim() === "") {
        return false;
    }
    if (!this.isLoaded && eventName === "deviceready") {
        this.isLoaded = true;
        this.trigger(eventName, data);
        while (this.batchAtStart.length > 0) {
            var d = this.batchAtStart.pop();
            this.trigger(d.name, d.data);
        }
        return true;
    } else if (!this.isLoaded) {
        this.batchAtStart.push({'name': eventName, 'data': data});
        return false;
    }
    console.log("+++ --- ++++");
    event = eventName.trim();
    if (event !== "" && this.callBacks.hasOwnProperty(event)) {
        console.log("Fire: " + event);
        var cb = this.callBacks[event];
        for (var x = 0; x < cb.length; x++) {
            if (typeof cb[x] === "function") {
                cb[x](data);
            }
        }
    } else {
        console.log("Empty or not found: " + event);
    }
    // suicide commando! but neo can do everything
    if (event === "*") {
        console.log("****** START POWER ******");
        cb = this.callBacks.eventIndex;
        for (var x = 0; x < cb.length; x++) {
            if (cb[x] !== "*") {
                this.trigger(cb[x], data);
            }
        }
    }
};
/*
 * special listener for device is ready
 */
Observer.prototype.onDeviceReady = function () {
    if (!this.deviceIsReady) {
        this.deviceIsReady = true;
        console.log("documentReady");
        this.trigger('deviceready');
    }
};

window.ob = new Observer();
