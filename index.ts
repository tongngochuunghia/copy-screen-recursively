import figlet from "figlet";
import clear from "clear";
import chalk from "chalk";
import IConfig from "./IConfig";
import CopyScreenRecursively from "./CopyScreenRecursively";
import { author, name, version } from "../package.json";

export interface IParameter {
    screenDir?: string;
}

class Index {
    public config: IConfig;
    public params: IParameter;
    public readonly className: string;

    constructor() {
        this.className = this.constructor.name;
        this.config = {
            debug: false,
            screenPath: "./src/pages"
        };
        this.params = this.getParams();
        if (!this.isNullOrEmpty(this.params.screenDir)) {
            this.config.screenPath = this.params.screenDir;
        }
    }

    /**
     * Execute copy screen recursively
     */
    public execute = (): void => {
        // clear all console
        clear();

        // write module name
        // https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
        console.log(chalk.yellow(figlet.textSync(name)));
        console.log(chalk.yellow(` Version ${version} - ${author} `));
        console.log();

        new CopyScreenRecursively(this.config).execute();
    }

    /**
     * Check Object is null or String null or empty.
     *
     * @param {object | string} value Object or String
     * @returns if null or empty return true, otherwise return false.
     */
    private isNullOrEmpty = (value: any): value is undefined | boolean => {
        return value === undefined || value === null || value === "";
    }

    /**
     * Read and parse params from command line args
     *
     * @see https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
     */
    private getParams = (): IParameter => {
        const params: any = {};
        const args: string[] = process.argv;
        for (const param of args) {
            const split: string[] = param.split(/=/g);
            params[split[0]] = (split.length > 1) ? split[1] : "";
        }
        if (this.config.debug) {
            console.log(`${this.className}#parseParams: params=${JSON.stringify(params)}`);
        }
        return params;
    }
}

const index = new Index();
index.execute();
export default index;
