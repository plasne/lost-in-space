import * as winston from 'winston';

declare global {
    namespace NodeJS {
        interface Global {
            logger: winston.Logger;
        }
    }
}
