var goog = {}; goog.appengine = {};
/** @constructor @param {string} str */
goog.appengine.Channel = function (str) {};

/** @constructor
    @param {string} str */
goog.appengine.Socket = function (str) {};

goog.appengine.Socket.prototype.close = function () {};
/** @param {...} var_args */
goog.appengine.Socket.prototype.onclose = function (var_args) {};
/** @param {...} var_args */
goog.appengine.Socket.prototype.onopen = function (var_args) {};
/** @param {...} var_args */
goog.appengine.Socket.prototype.onerror = function (var_args) {};
/** @param {...} var_args */
goog.appengine.Socket.prototype.onmessage = function (var_args) {};

/** @param {Object} obj
    @return {goog.appengine.Socket} */
goog.appengine.Channel.prototype.open = function (obj) {};

/** @typedef {HTMLAudioElement} */
var Audio;

/** @constructor */
Window.prototype.Notification = function (title, options) {};

var console = {};
/** @param {...} var_args */
console.log = function (var_args) {};

var webkitNotifications = Window.prototype.webkitNotifications;