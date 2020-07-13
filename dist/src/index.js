"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var figlet_1 = __importDefault(require("figlet"));
var clear_1 = __importDefault(require("clear"));
var chalk_1 = __importDefault(require("chalk"));
var CopyScreenRecursively_1 = __importDefault(require("./CopyScreenRecursively"));
var package_json_1 = require("../package.json");
var command_line_args_1 = __importDefault(require("command-line-args"));
var Logger_1 = __importDefault(require("./Logger"));
var options;
exports.default = (function () {
    clear_1.default();
    console.log(chalk_1.default.yellow(figlet_1.default.textSync(package_json_1.name)));
    console.log(chalk_1.default.yellow(" Version " + package_json_1.version + " - " + package_json_1.author + " "));
    console.log();
    options = command_line_args_1.default([
        { name: "screenPath", alias: "m", type: String, defaultValue: "./src/pages" },
        { name: "debug", alias: "d", type: Boolean, defaultValue: false }
    ]);
    var logger = Logger_1.default(options);
    logger.debug("%s - [debug] options=%s", new Date().toISOString(), JSON.stringify(options));
    try {
        new CopyScreenRecursively_1.default(options).execute();
    }
    catch (err) {
        logger.error(chalk_1.default.red("Copying error:"), err);
    }
})();
