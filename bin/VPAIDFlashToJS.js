(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

//if this code already run once don't do anything
var VPAIDFlashToJS = (function () {
    if (window.VPAIDFlashToJS) return;

    var JSFlashBridge = require('./jsFlashBridge').JSFlashBridge;
    var VPAIDCreative = require('./VPAIDCreative').VPAIDCreative;

    var noop = require('./utils').noop;
    var isPositiveInt = require('./utils').isPositiveInt;
    var createElementWithID = require('./utils').createElementWithID;
    var uniqueVPAID = require('./utils').unique('vpaid');

    var ERROR = 'error';

    var VPAIDFlashToJS = (function () {
        function VPAIDFlashToJS(vpaidParentEl, callback) {
            var swfConfig = arguments[2] === undefined ? { data: 'VPAIDFlash.swf', width: 800, height: 400 } : arguments[2];
            var version = arguments[3] === undefined ? '9' : arguments[3];
            var params = arguments[4] === undefined ? { wmode: 'transparent', salign: 'tl', allowScriptAccess: 'always' } : arguments[4];
            var debug = arguments[5] === undefined ? true : arguments[5];

            _classCallCheck(this, VPAIDFlashToJS);

            if (!swfobject) throw new Error('no swfobject in global scope. check: https://github.com/swfobject/swfobject or https://code.google.com/p/swfobject/');

            this._vpaidParentEl = vpaidParentEl;
            this._flashID = uniqueVPAID();
            this._load = callback || noop;
            this._destroyed = false;

            //validate the height
            swfConfig.width = isPositiveInt(swfConfig.width, 800);
            swfConfig.height = isPositiveInt(swfConfig.height, 400);

            createElementWithID(vpaidParentEl, this._flashID);

            params.movie = swfConfig.data;
            params.FlashVars = 'flashid=' + this._flashID + '&handler=' + JSFlashBridge.VPAID_FLASH_HANDLER + '&debug=' + debug;

            if (swfobject.hasFlashPlayerVersion(version)) {
                this.el = swfobject.createSWF(swfConfig, params, this._flashID);
                this._flash = new JSFlashBridge(this.el, swfConfig.data, this._flashID, swfConfig.width, swfConfig.height, callback || noop);
            }
        }

        _createClass(VPAIDFlashToJS, [{
            key: 'destroy',
            value: function destroy() {
                this._flash.destroy();
                this._flash = null;
                this.el = null;
                this._creativeLoad = null;
                this._destroyed = true;
            }
        }, {
            key: 'isDestroyed',
            value: function isDestroyed() {
                return this._destroyed;
            }
        }, {
            key: 'loadAdUnit',
            value: function loadAdUnit(adURL, callback) {
                var _this = this;

                if (this._creative) {
                    throw new error('creative still exists');
                }

                this._creativeLoad = function (err, message) {
                    if (!err) {
                        _this._creative = new VPAIDCreative(_this._flash);
                    }
                    _this._creativeLoad = null;
                    callback(err, _this._creative);
                };

                this._flash.callFlashMethod('loadAdUnit', [adURL], this._creativeLoad);
            }
        }, {
            key: 'unloadAdUnit',
            value: function unloadAdUnit() {
                var callback = arguments[0] === undefined ? undefined : arguments[0];

                if (!this._creative) {
                    throw new Error('Can\'t unload a creative that doesn\'t exist');
                }

                this._creative = null;

                if (this._creativeLoad) {
                    this._flash.removeCallback(this._creativeLoad);
                    this._creativeLoad = null;
                }

                this._flash.callFlashMethod('unloadAdUnit', [], callback);
            }
        }, {
            key: 'getFlashID',
            value: function getFlashID() {
                return this._flash.getFlashID();
            }
        }, {
            key: 'getFlashURL',
            value: function getFlashURL() {
                return this._flash.getFlashURL();
            }
        }]);

        return VPAIDFlashToJS;
    })();

    window.VPAIDFlashToJS = VPAIDFlashToJS;

    return VPAIDFlashToJS;
})();

module.exports = VPAIDFlashToJS;

},{"./VPAIDCreative":3,"./jsFlashBridge":4,"./utils":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

//simple representation of the API

var IVPAIDCreative = (function () {
    function IVPAIDCreative() {
        _classCallCheck(this, IVPAIDCreative);
    }

    _createClass(IVPAIDCreative, [{
        key: 'handshakeVersion',

        //all methods below
        //are async methods
        value: function handshakeVersion() {
            var playerVPAIDVersion = arguments[0] === undefined ? '2.0' : arguments[0];
            var callback = arguments[1] === undefined ? undefined : arguments[1];
        }
    }, {
        key: 'initAd',

        //width and height is not in the beginning because we will use the default width/height used in the constructor
        value: function initAd(viewMode, desiredBitrate) {
            var width = arguments[2] === undefined ? 0 : arguments[2];
            var height = arguments[3] === undefined ? 0 : arguments[3];
            var creativeData = arguments[4] === undefined ? '' : arguments[4];
            var environmentVars = arguments[5] === undefined ? '' : arguments[5];
            var callback = arguments[6] === undefined ? undefined : arguments[6];
        }
    }, {
        key: 'resizeAd',
        value: function resizeAd(width, height, viewMode) {
            var callback = arguments[3] === undefined ? undefined : arguments[3];
        }
    }, {
        key: 'startAd',
        value: function startAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];
        }
    }, {
        key: 'stopAd',
        value: function stopAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];
        }
    }, {
        key: 'pauseAd',
        value: function pauseAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];
        }
    }, {
        key: 'resumeAd',
        value: function resumeAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];
        }
    }, {
        key: 'expandAd',
        value: function expandAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];
        }
    }, {
        key: 'collapseAd',
        value: function collapseAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];
        }
    }, {
        key: 'skipAd',
        value: function skipAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];
        }
    }, {
        key: 'adLinear',

        //properties that will be treat as async methods
        value: function adLinear(callback) {}
    }, {
        key: 'adWidth',
        value: function adWidth(callback) {}
    }, {
        key: 'adHeight',
        value: function adHeight(callback) {}
    }, {
        key: 'adExpanded',
        value: function adExpanded(callback) {}
    }, {
        key: 'adSkippableState',
        value: function adSkippableState(callback) {}
    }, {
        key: 'adRemainingTime',
        value: function adRemainingTime(callback) {}
    }, {
        key: 'adDuration',
        value: function adDuration(callback) {}
    }, {
        key: 'setAdVolume',
        value: function setAdVolume(soundVolume) {
            var callback = arguments[1] === undefined ? undefined : arguments[1];
        }
    }, {
        key: 'getAdVolume',
        value: function getAdVolume(callback) {}
    }, {
        key: 'adCompanions',
        value: function adCompanions(callback) {}
    }, {
        key: 'adIcons',
        value: function adIcons(callback) {}
    }]);

    return IVPAIDCreative;
})();

exports.IVPAIDCreative = IVPAIDCreative;

Object.defineProperty(IVPAIDCreative, 'EVENTS', {
    writable: false,
    configurable: false,
    value: ['AdLoaded', 'AdStarted', 'AdStopped', 'AdSkipped', 'AdSkippableStateChange', 'AdSizeChange', 'AdLinearChange', 'AdDurationChange', 'AdExpandedChange', 'AdRemainingTimeChange', // [Deprecated in 2.0] but will be still fired for backwards compatibility
    'AdVolumeChange', 'AdImpression', 'AdVideoStart', 'AdVideoFirstQuartile', 'AdVideoMidpoint', 'AdVideoThirdQuartile', 'AdVideoComplete', 'AdClickThru', 'AdInteraction', 'AdUserAcceptInvitation', 'AdUserMinimize', 'AdUserClose', 'AdPaused', 'AdPlaying', 'AdLog', 'AdError']
});

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x17, _x18, _x19) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x17,
    property = _x18,
    receiver = _x19; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x17 = parent; _x18 = property; _x19 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var IVPAIDCreative = require('./IVPAIDCreative').IVPAIDCreative;

var VPAIDCreative = (function (_IVPAIDCreative) {
    function VPAIDCreative(flash) {
        _classCallCheck(this, VPAIDCreative);

        _get(Object.getPrototypeOf(VPAIDCreative.prototype), 'constructor', this).call(this);
        this._flash = flash;
    }

    _inherits(VPAIDCreative, _IVPAIDCreative);

    _createClass(VPAIDCreative, [{
        key: 'on',
        value: function on(eventName, callback) {
            this._flash.on(eventName, callback);
        }
    }, {
        key: 'off',
        value: function off(eventName, callback) {
            this._flash.on(eventName, callback);
        }
    }, {
        key: 'handshakeVersion',

        //VPAID interface
        value: function handshakeVersion() {
            var playerVPAIDVersion = arguments[0] === undefined ? '2.0' : arguments[0];
            var callback = arguments[1] === undefined ? undefined : arguments[1];

            this._flash.callFlashMethod('handshakeVersion', [playerVPAIDVersion], callback);
        }
    }, {
        key: 'initAd',
        value: function initAd(viewMode, desiredBitrate) {
            var width = arguments[2] === undefined ? 0 : arguments[2];
            var height = arguments[3] === undefined ? 0 : arguments[3];
            var creativeData = arguments[4] === undefined ? '' : arguments[4];
            var environmentVars = arguments[5] === undefined ? '' : arguments[5];
            var callback = arguments[6] === undefined ? undefined : arguments[6];

            //resize element that has the flash object
            this._flash.setSize(width, height);

            this._flash.callFlashMethod('initAd', [this._flash.getWidth(), this._flash.getHeight(), viewMode, desiredBitrate, creativeData, environmentVars], callback);
        }
    }, {
        key: 'resizeAd',
        value: function resizeAd(width, height, viewMode) {
            var callback = arguments[3] === undefined ? undefined : arguments[3];

            //resize element that has the flash object
            this._flash.setSize(width, height);

            //resize ad inside the flash
            this._flash.callFlashMethod('resizeAd', [this._flash.getWidth(), this._flash.getHeight(), viewMode], callback);
        }
    }, {
        key: 'startAd',
        value: function startAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];

            this._flash.callFlashMethod('startAd', [], callback);
        }
    }, {
        key: 'stopAd',
        value: function stopAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];

            this._flash.callFlashMethod('stopAd', [], callback);
        }
    }, {
        key: 'pauseAd',
        value: function pauseAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];

            this._flash.callFlashMethod('pauseAd', [], callback);
        }
    }, {
        key: 'resumeAd',
        value: function resumeAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];

            this._flash.callFlashMethod('resumeAd', [], callback);
        }
    }, {
        key: 'expandAd',
        value: function expandAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];

            this._flash.callFlashMethod('expandAd', [], callback);
        }
    }, {
        key: 'collapseAd',
        value: function collapseAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];

            this._flash.callFlashMethod('collapseAd', [], callback);
        }
    }, {
        key: 'skipAd',
        value: function skipAd() {
            var callback = arguments[0] === undefined ? undefined : arguments[0];

            this._flash.callFlashMethod('skipAd', [], callback);
        }
    }, {
        key: 'adLinear',

        //properties that will be treat as async methods
        value: function adLinear(callback) {
            this._flash.callFlashMethod('adLinear', [], callback);
        }
    }, {
        key: 'adWidth',
        value: function adWidth(callback) {
            this._flash.callFlashMethod('adWidth', [], callback);
        }
    }, {
        key: 'adHeight',
        value: function adHeight(callback) {
            this._flash.callFlashMethod('adHeight', [], callback);
        }
    }, {
        key: 'adExpanded',
        value: function adExpanded(callback) {
            this._flash.callFlashMethod('adExpanded', [], callback);
        }
    }, {
        key: 'adSkippableState',
        value: function adSkippableState(callback) {
            this._flash.callFlashMethod('adSkippableState', [], callback);
        }
    }, {
        key: 'adRemainingTime',
        value: function adRemainingTime(callback) {
            this._flash.callFlashMethod('adRemainingTime', [], callback);
        }
    }, {
        key: 'adDuration',
        value: function adDuration(callback) {
            this._flash.callFlashMethod('adDuration', [], callback);
        }
    }, {
        key: 'setAdVolume',
        value: function setAdVolume(volume) {
            var callback = arguments[1] === undefined ? undefined : arguments[1];

            this._flash.callFlashMethod('setAdVolume', [volume], callback);
        }
    }, {
        key: 'getAdVolume',
        value: function getAdVolume(callback) {
            this._flash.callFlashMethod('getAdVolume', [], callback);
        }
    }, {
        key: 'adCompanions',
        value: function adCompanions(callback) {
            this._flash.callFlashMethod('adCompanions', [], callback);
        }
    }, {
        key: 'adIcons',
        value: function adIcons(callback) {
            this._flash.callFlashMethod('adIcons', [], callback);
        }
    }]);

    return VPAIDCreative;
})(IVPAIDCreative);

exports.VPAIDCreative = VPAIDCreative;

},{"./IVPAIDCreative":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var unique = require('./utils').unique;
var isPositiveInt = require('./utils').isPositiveInt;
var SingleValueRegistry = require('./registry').SingleValueRegistry;
var MultipleValuesRegistry = require('./registry').MultipleValuesRegistry;
var registry = require('./jsFlashBridgeRegistry');
var VPAID_FLASH_HANDLER = 'vpaid_video_flash_handler';
var ERROR = 'error';

var instances = {};

var JSFlashBridge = (function () {
    function JSFlashBridge(el, flashURL, flashID, width, height, loadHandShake) {
        _classCallCheck(this, JSFlashBridge);

        this._el = el;
        this._flashID = flashID;
        this._flashURL = flashURL;
        this._width = width;
        this._height = height;
        this._handlers = new MultipleValuesRegistry();
        this._callbacks = new SingleValueRegistry();
        this._uniqueMethodIdentifier = unique(this._flashID);
        this._loadHandShake = loadHandShake;

        registry.addInstance(this._flashID, this);
    }

    _createClass(JSFlashBridge, [{
        key: 'on',
        value: function on(eventName, callback) {
            this._handlers.add(eventName, callback);
        }
    }, {
        key: 'off',
        value: function off(eventName, callback) {
            return this._handlers.remove(eventName, callback);
        }
    }, {
        key: 'offEvent',
        value: function offEvent(eventName) {
            return this._handlers.removeByKey(eventName);
        }
    }, {
        key: 'offAll',
        value: function offAll() {
            return this._handlers.removeAll();
        }
    }, {
        key: 'callFlashMethod',
        value: function callFlashMethod(methodName) {
            var args = arguments[1] === undefined ? [] : arguments[1];
            var callback = arguments[2] === undefined ? undefined : arguments[2];

            var callbackID = '';
            // if no callback, some methods the return is void so they don't need callback
            if (callback) {
                var callbackID = this._uniqueMethodIdentifier();
                this._callbacks.add(callbackID, callback);
            }

            try {
                //methods are created by ExternalInterface.addCallback in as3 code, if for some reason it failed
                //this code will throw an error
                this._el[methodName]([callbackID].concat(args));
            } catch (e) {
                if (callback) {
                    this._callbacks.remove(callbackID);
                    setTimeout(function () {
                        callback(e);
                    }, 0);
                } else {

                    //if there isn't any callback to return error use error event handler
                    this._trigger(ERROR, [e]);
                }
            }
        }
    }, {
        key: 'removeAllCallbacks',
        value: function removeAllCallbacks() {
            return this._callbacks.removeAll();
        }
    }, {
        key: '_trigger',
        value: function _trigger(eventName, err, result) {
            //TODO: check if forEach and isArray is added to the browser with babeljs
            this._handlers.get(eventName).forEach(function (callback) {
                setTimeout(function () {
                    callback(err, result);
                }, 0);
            });
        }
    }, {
        key: '_callCallback',
        value: function _callCallback(methodName, callbackID, err, result) {

            var callback = this._callbacks.get(callbackID);

            //not all methods callback's are mandatory
            //but if there exist an error, fire the error event
            if (err && (callbackID === '' || !callback)) {
                this.trigger(ERROR, err, result);
                return;
            }

            setTimeout(function () {
                callback(err, result);
            }, 0);

            this._callbacks.remove(callbackID);
        }
    }, {
        key: 'getSize',

        //methods like properties specific to this implementation of VPAID
        value: function getSize() {
            return { width: this._width, height: this._height };
        }
    }, {
        key: 'setSize',
        value: function setSize(newWidth, newHeight) {
            this._width = isPositiveInt(newWidth, this._width);
            this._height = isPositiveInt(newHeight, this._height);
            this._el.setAttribute('width', this._width);
            this._el.setAttribute('height', this._height);
        }
    }, {
        key: 'getWidth',
        value: function getWidth() {
            return this._width;
        }
    }, {
        key: 'setWidth',
        value: function setWidth(newWidth) {
            this.setSize(newWidth, this._height);
        }
    }, {
        key: 'getHeight',
        value: function getHeight() {
            return this._height;
        }
    }, {
        key: 'setHeight',
        value: function setHeight(newHeight) {
            this.setSize(this._width, newHeight);
        }
    }, {
        key: 'getFlashID',
        value: function getFlashID() {
            return this._flashID;
        }
    }, {
        key: 'getFlashURL',
        value: function getFlashURL() {
            return this._flashURL;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.offAll();
            this.removeAllCallbacks();
            registry.removeInstanceByID(this._flashID);
            if (this._el.parentElement) {
                this._el.parentElement.removeChild(this._el);
            }
        }
    }]);

    return JSFlashBridge;
})();

exports.JSFlashBridge = JSFlashBridge;

Object.defineProperty(JSFlashBridge, 'VPAID_FLASH_HANDLER', {
    writable: false,
    configurable: false,
    value: VPAID_FLASH_HANDLER
});

window[VPAID_FLASH_HANDLER] = function (flashID, type, event, callID, error, data) {
    var instance = registry.getInstanceByID(flashID);
    if (!instance) return;
    if (event === 'handShake') {
        instance._loadHandShake(error, data);
    } else {
        if (type !== 'event') {
            instance._callCallback(event, callID, error, data);
        } else {
            instance._trigger(event, error, data);
        }
    }
};

},{"./jsFlashBridgeRegistry":5,"./registry":6,"./utils":7}],5:[function(require,module,exports){
'use strict';

var SingleValueRegistry = require('./registry').SingleValueRegistry;
var instances = new SingleValueRegistry();

var JSFlashBridgeRegistry = {};
Object.defineProperty(JSFlashBridgeRegistry, 'addInstance', {
    writable: false,
    configurable: false,
    value: function value(id, instance) {
        instances.add(id, instance);
    }
});

Object.defineProperty(JSFlashBridgeRegistry, 'getInstanceByID', {
    writable: false,
    configurable: false,
    value: function value(id) {
        return instances.get(id);
    }
});

Object.defineProperty(JSFlashBridgeRegistry, 'removeInstanceByID', {
    writable: false,
    configurable: false,
    value: function value(id) {
        return instances.remove(id);
    }
});

module.exports = JSFlashBridgeRegistry;

},{"./registry":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MultipleValuesRegistry = (function () {
    function MultipleValuesRegistry() {
        _classCallCheck(this, MultipleValuesRegistry);

        this._registries = {};
    }

    _createClass(MultipleValuesRegistry, [{
        key: "add",
        value: function add(id, value) {
            if (!this._registries[id]) {
                this._registries[id] = [];
            }
            if (this._registries[id].indexOf(value) === -1) {
                this._registries[id].push(value);
            }
        }
    }, {
        key: "get",
        value: function get(id) {
            return this._registries[id] || [];
        }
    }, {
        key: "findValueKeys",
        value: function findValueKeys(value) {
            //TODO: check if keys and find is added to the browser with babeljs
            var keys = Object.keys(this._registries).filter(function (key) {
                return this._registries[key].indexOf(value) !== -1;
            });

            return keys;
        }
    }, {
        key: "remove",
        value: function remove(key, value) {
            if (!this._registries[key]) {
                return;
            }

            var index = this._registries[key].indexOf(value);

            if (index < 0) {
                return;
            }
            return this._registries[key].splice(index, 1);
        }
    }, {
        key: "removeByKey",
        value: function removeByKey(id) {
            var old = this._registries[id];
            delete this._registries[id];
            return old;
        }
    }, {
        key: "removeByValue",
        value: function removeByValue(value) {
            var keys = this._findValueKeys(value);
            return keys.map(function (key) {
                return this.destroy(key, value);
            });
        }
    }, {
        key: "removeAll",
        value: function removeAll() {
            var old = this._registries;
            this._registries = {};
            return old;
        }
    }, {
        key: "size",
        value: function size() {
            return Object.keys(this._registries).length;
        }
    }]);

    return MultipleValuesRegistry;
})();

exports.MultipleValuesRegistry = MultipleValuesRegistry;

var SingleValueRegistry = (function () {
    function SingleValueRegistry() {
        _classCallCheck(this, SingleValueRegistry);

        this._registries = {};
    }

    _createClass(SingleValueRegistry, [{
        key: "add",
        value: function add(id, value) {
            this._registries[id] = value;
        }
    }, {
        key: "get",
        value: function get(id) {
            return this._registries[id];
        }
    }, {
        key: "findValueKeys",
        value: function findValueKeys(value) {
            //TODO: check if keys and find is added to the browser with babeljs
            var key = Object.keys(this._registries).filter(function (key) {
                return this._registries[key] === value;
            });

            return key;
        }
    }, {
        key: "remove",
        value: function remove(id) {
            var old = this._registries[id];
            delete this._registries[id];
            return old;
        }
    }, {
        key: "removeByValue",
        value: function removeByValue(value) {
            var keys = this._findValueKeys(value);
            return keys.map(function (key) {
                return this.destroy(key);
            });
        }
    }, {
        key: "removeAll",
        value: function removeAll() {
            var old = this._registries;
            this._registries = {};
            return old;
        }
    }, {
        key: "size",
        value: function size() {
            return Object.keys(this._registries).length;
        }
    }]);

    return SingleValueRegistry;
})();

exports.SingleValueRegistry = SingleValueRegistry;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.unique = unique;
exports.noop = noop;
exports.createElementWithID = createElementWithID;
exports.isPositiveInt = isPositiveInt;
'use strict';

function unique(prefix) {
    var count = -1;
    return function (f) {
        return '' + prefix + '_' + ++count;
    };
}

function noop() {}

function createElementWithID(parent, id) {
    var nEl = document.createElement('div');
    nEl.id = id;
    parent.innerHTML = '';
    parent.appendChild(nEl);
    return nEl;
}

function isPositiveInt(newVal, oldVal) {
    return Number.isSafeInteger(newVal) && newVal > 0 ? newVal : oldVal;
}

},{}]},{},[1])


//# sourceMappingURL=VPAIDFlashToJS.js.map