import express from "express";
import path from "path";
import os from "os";
import chalk from "chalk";

export function startHosting(port = 3000) {
    const addresses = getNetworkInterfaces(port);
    const app = express();

    app.use("/", express.static(path.join("slice-dice-ui", "public")));
    app.use("/", express.static(path.join("slice-dice-ui", "dist")));

    app.listen(port);
    console.log(chalk.green("Web UI is available is at:"));
    for (const address of addresses) {
        console.log(chalk.blue("http://" + address));
    }
}

// Function to get network interfaces
function getNetworkInterfaces(port: number) {
    const interfaces = os.networkInterfaces();
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
