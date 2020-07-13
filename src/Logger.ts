import { IOptions } from "./index";

/**
 * Command options
 */
let options: IOptions;

/**
 * Logger
 */
export const LoggerInstance = {
    info: console.log,
    error: console.error,
    debug: (message?: any, ...params: any[]): void => {
        if (options && options.debug) {
            const length = params.length;
            switch (length) {
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

export default (props: IOptions): typeof LoggerInstance => {
    options = props;
    return LoggerInstance;
};
