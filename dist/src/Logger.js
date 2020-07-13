"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInstance = void 0;
var options;
exports.LoggerInstance = {
    info: console.log,
    error: console.error,
    debug: function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (options && options.debug) {
            var length_1 = params.length;
            switch (length_1) {
                case 0: return console.debug(message);
                case 1: return console.debug(message, params[0]);
                case 2: return console.debug(message, params[0], params[1]);
                case 3: return console.debug(message, params[0], params[1], params[2]);
                case 4: return console.debug(message, params[0], params[1], params[2], params[3]);
                case 5: return console.debug(message, params[0], params[1], params[2], params[3], params[4]);
                default: return console.debug(message, params.join(" "));
            }
        }
    }
};
exports.default = (function (props) {
    options = props;
    return exports.LoggerInstance;
});
