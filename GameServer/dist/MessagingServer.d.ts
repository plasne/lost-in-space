import { TcpServer, ITcpServerOptions } from 'tcp-comm';
export declare class MessagingServer extends TcpServer {
    constructor(options?: ITcpServerOptions);
    listen(): void;
}
