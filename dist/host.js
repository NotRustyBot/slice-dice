"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHosting = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const chalk_1 = __importDefault(require("chalk"));
function startHosting(port = 3000) {
    const addresses = getNetworkInterfaces(port);
    const app = (0, express_1.default)();
    app.use("/", express_1.default.static(path_1.default.join("slice-dice-ui", "public")));
    app.use("/", express_1.default.static(path_1.default.join("slice-dice-ui", "dist")));
    app.listen(port);
    console.log(chalk_1.default.green("Web UI is available is at:"));
    for (const address of addresses) {
        console.log(chalk_1.default.blue("http://" + address));
    }
}
exports.startHosting = startHosting;
// Function to get network interfaces
function getNetworkInterfaces(port) {
    const interfaces = os_1.default.networkInterfaces();
    const addresses = [];
    for (let iface in interfaces) {
        interfaces[iface].forEach((ifaceDetails) => {
            // Only include IPv4 addresses
            if (ifaceDetails.family === "IPv4" && !ifaceDetails.internal) {
                addresses.push(`${ifaceDetails.address}:${port}`);
            }
        });
    }
    return addresses;
}
