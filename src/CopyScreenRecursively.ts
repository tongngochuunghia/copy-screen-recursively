// Read input string from commandline
// https://nodejs.org/api/readline.html#readline_readline
import * as readline from "readline";

// Handle for read/write file from nodejs
// https://github.com/jprichardson/node-fs-extra
import * as fse from "fs-extra";
import * as path from "path";

import { IOptions } from "./index";
import Logger, { LoggerInstance } from "./Logger";
import chalk from "chalk";

export default class CopyScreenRecursively {
    public currentSourceName = "";
    public currentDestName = "";

    private readonly logger: typeof LoggerInstance;
    private readonly className: string;
    private readonly rl: readline.Interface;
    private readonly options: IOptions;

    /**
     * Constructor.
     *
     * @param props IConfig
     */
    constructor(props: IOptions) {
        this.className = this.constructor.name;
        this.options = props;
        this.logger = Logger(props);
        this.logger.debug("%s - [debug] %s#constructor: props=%s", new Date().toISOString(), this.className, JSON.stringify(props));

        // Init readline interface
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Proceed to copy the screen.
     */
    public execute = (): void => {
        // Request screen source name
        this.requestSourceName((sourceName: string, sourcePath: string) => {
            this.currentSourceName = sourceName;

            // Request screen destination name
            this.requestDestName((destName: string, destPath: string) => {
                this.currentDestName = destName;
                // Add new lines to the console
                this.logger.info("");

                this.copyFileRecursive(sourcePath, destPath, () => {
                    this.logger.info(chalk.green("\nCompleted."));
                    process.exit();
                });
            });
        });
    }

    /**
     * Request user input screen source name
     *
     * @param callback Callback after requested
     */
    private requestSourceName = (callback: (screenName: string, screenPath: string) => void): void => {
        this.logger.info(chalk.yellow("\nWhat is the screen name you want to copy?"));
        this.rl.question("[SOURCE] Screen name: ", (answer: string) => {
            if (this.isNullOrEmpty(answer)) {
                this.logger.info("Please enter the screen name.");
                this.requestSourceName(callback);
                return;
            }

            const sourceName = `${answer}`.trim();
            const sourcePath = path.join(this.options.screenPath, sourceName);
            this.logger.debug("%s - [debug] %s#requestSourceName: sourcePath=%s",
                new Date().toISOString(), this.className, chalk.gray(sourcePath));
            if (fse.existsSync(sourcePath)) {
                callback(sourceName, sourcePath);
            } else {
                this.logger.error(chalk.red(`The "${sourceName}" screen does not exist, please check and try again.`));
                process.exit();
            }
        });
    }

    /**
     * Request user input screen destination name
     *
     * @param callback Callback after requested
     */
    private requestDestName = (callback: (screenName: string, screenPath: string) => void): void => {
        this.logger.info(chalk.yellow("\nWhat is the screen name you want to create?"));
        this.rl.question("[DESTINATION] Screen name: ", (answer: string) => {
            if (this.isNullOrEmpty(answer)) {
                this.logger.info("Please enter the screen name.");
                this.requestDestName(callback);
                return;
            }

            const destName = `${answer}`.trim();
            const destPath = path.join(this.options.screenPath, destName);
            this.logger.debug("%s - [debug] %s#requestDestName: destPath=%s",
                new Date().toISOString(), this.className, chalk.gray(destPath));
            if (fse.existsSync(destPath)) {
                this.logger.error(chalk.red(`The "${destName}" screen already exists, please check and try again.`));
                process.exit();
            } else {
                callback(destName, destPath);
            }
        });
    }

    /**
     * Copy all file from source to destination folder.
     *
     * @param fromPath Screen source path
     * @param toPath Screen destination path
     * @param callback Callback function after copy
     */
    private copyFileRecursive = (fromPath: string, toPath: string, callback?: () => void): void => {
        this.logger.debug("%s - [debug] %s#copyFileRecursive: Start copying the screen from %s to %s",
            new Date().toISOString(), this.className, chalk.gray(fromPath), chalk.gray(toPath));
        this.logger.info(`- [Folder] Start copying ${chalk.gray(fromPath)} to ${chalk.gray(toPath)}`);

        // Ensures that the directory exists.
        fse.ensureDirSync(toPath);

        // Get all files and folders name in the sourcePath
        const files = fse.readdirSync(fromPath);
        files.forEach((name) => {
            const sourcePath = path.join(fromPath, name);
            const newName: string = this.replaceAll(name, this.currentSourceName, this.currentDestName);
            const stats = fse.statSync(sourcePath);
            if (stats.isDirectory()) {
                const destPath = path.join(toPath, newName);
                this.logger.debug('%s - [debug] %s#copyFileRecursive: destPath="%s"', new Date().toISOString(), this.className, destPath);
                this.copyFileRecursive(sourcePath, destPath);
            } else {
                const newFilePath: string = path.join(toPath, newName);
                this.logger.debug("%s - [debug] %s#copyFileRecursive: newFilePath=%s", new Date().toISOString(), this.className, newFilePath);

                // Create file in target folder
                fse.ensureFileSync(newFilePath);

                // Create a keyword list to replace
                const sourceWords = this.getReplaceWords(this.currentSourceName);
                const destWords = this.getReplaceWords(this.currentDestName);

                // Replace the entire contents of the file
                const fileData = fse.readFileSync(sourcePath, { encoding: "utf8" });
                let newFileData = fileData;
                for (const key in sourceWords) {
                    newFileData = this.replaceAll(newFileData, sourceWords[key], destWords[key]);
                }
                fse.outputFileSync(newFilePath, newFileData, { encoding: "utf8" });
                this.logger.info(`  + [File] ${chalk.gray(sourcePath)} ${chalk.green("successfully")} copied to ${chalk.gray(newFilePath)}`);
            }
        });
        if (typeof callback === "function") {
            callback();
        }
    }

    /**
     * Get array key word replacement
     *
     * @param key Key replacement
     */
    private getReplaceWords = (key: string): string[] => {
        key = key || "";
        let keyLowerCase: string = key.toLowerCase();
        const words: string[] = [key, keyLowerCase, key.toUpperCase()];
        keyLowerCase = keyLowerCase.replace(keyLowerCase[0], keyLowerCase[0].toUpperCase());
        if (words.indexOf(keyLowerCase) === -1) {
            words.push(keyLowerCase);
        }
        return words;
    }

    /**
     * Support replace all text source to dest
     *
     * @param source String source
     * @param search Keywords
     * @param replacement String replacement
     */
    private replaceAll = (source: string, search: string, replacement: string): string => {
        return source.replace(new RegExp(search, "g"), replacement);
    }

    /**
     * Check Object is null or String null or empty.
     *
     * @param  value Object or String
     * @returns if null or empty return TRUE, otherwise return FALSE.
     */
    private isNullOrEmpty = (value: any): value is undefined | boolean => {
        return value === undefined || value === null || value === "";
    }
}
