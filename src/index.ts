import figlet from "figlet";
import clear from "clear";
import chalk from "chalk";
import CopyScreenRecursively from "./CopyScreenRecursively";
import { author, name, version } from "../package.json";
import commandLineArgs, { CommandLineOptions } from "command-line-args";
import Logger from "./Logger";

export interface IOptions extends CommandLineOptions {
    screenPath: string;
    debug: boolean;
}

/**
 * Command options
 */
let options: IOptions;

/**
 * Main function.
 */
export default ((): void => {
    // clear all console
    clear();

    // Write log module info
    console.log(chalk.yellow(figlet.textSync(name)));
    console.log(chalk.yellow(` Version ${version} - ${author} `));
    console.log();

    // https://github.com/75lb/command-line-args
    options = commandLineArgs([
        { name: "screenPath", alias: "m", type: String, defaultValue: "./src/pages" },
        { name: "debug", alias: "d", type: Boolean, defaultValue: false }
    ]) as any;

    // Log options
    const logger = Logger(options);
    logger.debug("%s - [debug] options=%s", new Date().toISOString(), JSON.stringify(options));

    try {
        new CopyScreenRecursively(options).execute();
    } catch (err) {
        logger.error(chalk.red("Copying error:"), err);
    }
})();
