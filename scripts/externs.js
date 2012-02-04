var goog = {}; goog.appengine = {};
/** @constructor @param {string} str */
goog.appengine.Channel = function (str) {};

/** @constructor
    @param {string} str */
goog.appengine.Socket = function () {};

goog.appengine.Socket.prototype.close = function () {};
goog.appengine.Socket.prototype.onclose = function () {};
goog.appengine.Socket.prototype.onopen = function () {};
goog.appengine.Socket.prototype.onerror = function () {};
goog.appengine.Socket.prototype.onmessage = function () {};

/** @param {Object} obj
    @return {goog.appengine.Socket} */
goog.appengine.Channel.prototype.open = function (obj) {};

/** @typedef {HTMLAudioElement} */
var Audio;
