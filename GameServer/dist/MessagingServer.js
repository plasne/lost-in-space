"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// includes
var tcp_comm_1 = require("tcp-comm");
var MessagingServer = /** @class */ (function (_super) {
    __extends(MessagingServer, _super);
    function MessagingServer(options) {
        return _super.call(this, options) || this;
    }
    MessagingServer.prototype.listen = function () {
        // start listening
        _super.prototype.listen.call(this);
    };
    return MessagingServer;
}(tcp_comm_1.TcpServer));
exports.MessagingServer = MessagingServer;
