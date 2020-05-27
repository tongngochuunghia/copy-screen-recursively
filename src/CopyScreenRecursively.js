"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline"));
var fse = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var CopyScreenRecursively = (function () {
    function CopyScreenRecursively(props) {
        var _this = this;
        this.currentSourceName = "";
        this.currentDestName = "";
        this.execute = function () {
            _this.requestSourceName(function (sourceName, sourcePath) {
                _this.currentSourceName = sourceName;
                console.log("");
                _this.requestDestName(function (destName, destPath) {
                    _this.currentDestName = destName;
                    console.log("");
                    _this.copyFileRecursive(sourcePath, destPath, function () {
                        console.log("\x1b[33m%s\x1b[0m", "\n\n\nNEW SCREEN COPY COMPLETED!!!");
                        process.exit();
                    });
                });
            });
        };
        this.requestSourceName = function (callback) {
            console.log("\nWhat is the screen name you want to copy?");
            _this.rl.question("[SOURCE] Screen name: ", function (answer) {
                if (_this.isNullOrEmpty(answer)) {
                    console.log("Please enter the screen name.");
                    _this.requestSourceName(callback);
                    return;
                }
                var sourceName = ("" + answer).trim();
                var sourcePath = path.join(_this.config.screenPath, sourceName);
                if (_this.config.debug) {
                    console.log(_this.className + "#requestSourceName: sourcePath=" + sourcePath);
                }
                console.log("Absolute path: " + path.resolve(sourcePath));
                if (fse.existsSync(sourcePath)) {
                    callback(sourceName, sourcePath);
                }
                else {
                    console.log("The \"" + sourceName + "\" screen does not exist, please check and try again.");
                    process.exit();
                }
            });
        };
        this.requestDestName = function (callback) {
            console.log("\nWhat is the screen name you want to create?");
            _this.rl.question("[DESTINATION] Screen name: ", function (answer) {
                if (_this.isNullOrEmpty(answer)) {
                    console.log("Please enter the screen name.");
                    _this.requestDestName(callback);
                    return;
                }
                var destName = ("" + answer).trim();
                var destPath = path.join(_this.config.screenPath, destName);
                if (_this.config.debug) {
                    console.log(_this.className + "#requestDestName: destPath=" + destPath);
                }
                console.log("Absolute path: " + path.resolve(destPath));
                if (fse.existsSync(destPath)) {
                    console.log("The \"" + destName + "\" screen already exists, please check and try again.");
                    process.exit();
                }
                else {
                    callback(destName, destPath);
                }
            });
        };
        this.copyFileRecursive = function (fromPath, toPath, callback) {
            if (_this.config.debug) {
                console.log(_this.className + "#copyFileRecursive: " +
                    ("Start copying the screen from \"" + fromPath + "\" to \"" + toPath + "\"."));
            }
            fse.ensureDirSync(toPath);
            var files = fse.readdirSync(fromPath);
            files.forEach(function (name) {
                var sourcePath = path.join(fromPath, name);
                var newName = _this.replaceAll(name, _this.currentSourceName, _this.currentDestName);
                var stats = fse.statSync(sourcePath);
                if (stats.isDirectory()) {
                    var destPath = path.join(toPath, newName);
                    if (_this.config.debug) {
                        console.log(_this.className + "#copyFileRecursive: destPath=\"" + destPath + "\".");
                    }
                    _this.copyFileRecursive(sourcePath, destPath);
                }
                else {
                    var newFilePath = path.join(toPath, newName);
                    if (_this.config.debug) {
                        console.log(_this.className + "#copyFileRecursive: newFilePath=" + newFilePath);
                    }
                    fse.ensureFileSync(newFilePath);
                    var sourceWords = _this.getReplaceWords(_this.currentSourceName);
                    var destWords = _this.getReplaceWords(_this.currentDestName);
                    var fileData = fse.readFileSync(sourcePath, { encoding: "utf8" });
                    var newFileData = fileData;
                    for (var key in sourceWords) {
                        newFileData = _this.replaceAll(newFileData, sourceWords[key], destWords[key]);
                    }
                    fse.outputFileSync(newFilePath, newFileData, { encoding: "utf8" });
                    console.log("The file \"" + sourcePath + "\" was copied successfully.");
                }
            });
            if (typeof callback === "function") {
                callback();
            }
        };
        this.getReplaceWords = function (key) {
            key = key || "";
            var keyLowerCase = key.toLowerCase();
            var words = [key, keyLowerCase, key.toUpperCase()];
            keyLowerCase = keyLowerCase.replace(keyLowerCase[0], keyLowerCase[0].toUpperCase());
            if (words.indexOf(keyLowerCase) === -1) {
                words.push(keyLowerCase);
            }
            return words;
        };
        this.replaceAll = function (source, search, replacement) {
            return source.replace(new RegExp(search, "g"), replacement);
        };
        this.isNullOrEmpty = function (value) {
            return value === undefined || value === null || value === "";
        };
        this.className = this.constructor.name;
        this.config = props;
        if (this.config.debug) {
            console.log(this.className + "#constructor: props=" + JSON.stringify(props));
        }
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    return CopyScreenRecursively;
}());
exports.default = CopyScreenRecursively;
