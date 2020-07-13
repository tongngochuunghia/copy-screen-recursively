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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = __importStar(require("readline"));
var fse = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var Logger_1 = __importDefault(require("./Logger"));
var chalk_1 = __importDefault(require("chalk"));
var CopyScreenRecursively = (function () {
    function CopyScreenRecursively(props) {
        var _this = this;
        this.currentSourceName = "";
        this.currentDestName = "";
        this.execute = function () {
            _this.requestSourceName(function (sourceName, sourcePath) {
                _this.currentSourceName = sourceName;
                _this.requestDestName(function (destName, destPath) {
                    _this.currentDestName = destName;
                    _this.logger.info("");
                    _this.copyFileRecursive(sourcePath, destPath, function () {
                        _this.logger.info(chalk_1.default.green("\nCompleted."));
                        process.exit();
                    });
                });
            });
        };
        this.requestSourceName = function (callback) {
            _this.logger.info(chalk_1.default.yellow("\nWhat is the screen name you want to copy?"));
            _this.rl.question("[SOURCE] Screen name: ", function (answer) {
                if (_this.isNullOrEmpty(answer)) {
                    _this.logger.info("Please enter the screen name.");
                    _this.requestSourceName(callback);
                    return;
                }
                var sourceName = ("" + answer).trim();
                var sourcePath = path.join(_this.options.screenPath, sourceName);
                _this.logger.debug("%s - [debug] %s#requestSourceName: sourcePath=%s", new Date().toISOString(), _this.className, chalk_1.default.gray(sourcePath));
                if (fse.existsSync(sourcePath)) {
                    callback(sourceName, sourcePath);
                }
                else {
                    _this.logger.error(chalk_1.default.red("The \"" + sourceName + "\" screen does not exist, please check and try again."));
                    process.exit();
                }
            });
        };
        this.requestDestName = function (callback) {
            _this.logger.info(chalk_1.default.yellow("\nWhat is the screen name you want to create?"));
            _this.rl.question("[DESTINATION] Screen name: ", function (answer) {
                if (_this.isNullOrEmpty(answer)) {
                    _this.logger.info("Please enter the screen name.");
                    _this.requestDestName(callback);
                    return;
                }
                var destName = ("" + answer).trim();
                var destPath = path.join(_this.options.screenPath, destName);
                _this.logger.debug("%s - [debug] %s#requestDestName: destPath=%s", new Date().toISOString(), _this.className, chalk_1.default.gray(destPath));
                if (fse.existsSync(destPath)) {
                    _this.logger.error(chalk_1.default.red("The \"" + destName + "\" screen already exists, please check and try again."));
                    process.exit();
                }
                else {
                    callback(destName, destPath);
                }
            });
        };
        this.copyFileRecursive = function (fromPath, toPath, callback) {
            _this.logger.debug("%s - [debug] %s#copyFileRecursive: Start copying the screen from %s to %s", new Date().toISOString(), _this.className, chalk_1.default.gray(fromPath), chalk_1.default.gray(toPath));
            _this.logger.info("- [Folder] Start copying " + chalk_1.default.gray(fromPath) + " to " + chalk_1.default.gray(toPath));
            fse.ensureDirSync(toPath);
            var files = fse.readdirSync(fromPath);
            files.forEach(function (name) {
                var sourcePath = path.join(fromPath, name);
                var newName = _this.replaceAll(name, _this.currentSourceName, _this.currentDestName);
                var stats = fse.statSync(sourcePath);
                if (stats.isDirectory()) {
                    var destPath = path.join(toPath, newName);
                    _this.logger.debug('%s - [debug] %s#copyFileRecursive: destPath="%s"', new Date().toISOString(), _this.className, destPath);
                    _this.copyFileRecursive(sourcePath, destPath);
                }
                else {
                    var newFilePath = path.join(toPath, newName);
                    _this.logger.debug("%s - [debug] %s#copyFileRecursive: newFilePath=%s", new Date().toISOString(), _this.className, newFilePath);
                    fse.ensureFileSync(newFilePath);
                    var sourceWords = _this.getReplaceWords(_this.currentSourceName);
                    var destWords = _this.getReplaceWords(_this.currentDestName);
                    var fileData = fse.readFileSync(sourcePath, { encoding: "utf8" });
                    var newFileData = fileData;
                    for (var key in sourceWords) {
                        newFileData = _this.replaceAll(newFileData, sourceWords[key], destWords[key]);
                    }
                    fse.outputFileSync(newFilePath, newFileData, { encoding: "utf8" });
                    _this.logger.info("  + [File] " + chalk_1.default.gray(sourcePath) + " " + chalk_1.default.green("successfully") + " copied to " + chalk_1.default.gray(newFilePath));
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
        this.options = props;
        this.logger = Logger_1.default(props);
        this.logger.debug("%s - [debug] %s#constructor: props=%s", new Date().toISOString(), this.className, JSON.stringify(props));
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    return CopyScreenRecursively;
}());
exports.default = CopyScreenRecursively;
