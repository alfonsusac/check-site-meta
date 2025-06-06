#!/usr/bin/env -S node --no-warnings
import { spawn } from "child_process";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import { program } from "commander";
import { readFileSync } from "fs";
// Configs
const DEFAULT_PORT = 3050;
const DEFAULT_HOST = "localhost";
// Get the directory of the current module (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Read version from package.json using import
const packageJson = JSON.parse(readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
const appName = packageJson['name'];
const appVersion = packageJson['version'];
const appDescription = packageJson['description'];
// Initialize CLI setup (arguments, options, parsing)
program
    .name(appName)
    .version(appVersion)
    .description(appDescription)
    .argument("[input]", "URL to check, or localhost port to check (optional)")
    .option("-p, --port <number>", "Specify port number", (value) => parseInt(value, 10))
    .option("-b, --bind <address>", "Specify address to bind", "localhost")
    .option("--showdir", "Show directory path of where the command is run")
    .option("--no-analytics", "Disable analytics tracking. You can also set DO_NO_TRACK=true in your environment")
    .parse(process.argv);
const options = program.opts();
// Analytics
const skipAnalytics = options.noAnalytics || ['true', '1', 'yes', 'y'].includes(String(process.env['DO_NOT_TRACK'] ?? '').toLowerCase());
if (!skipAnalytics) {
    fetch(`https://alfon.dev/api/public/analytics`, {
        method: 'POST',
        body: JSON.stringify({
            p: 'check-site-meta',
            e: 'command-run',
            m: { version: appVersion }
        })
    }).catch(() => { });
}
// --showdir
if (options.showdir) {
    console.log(`\n → Running from directory: ${__dirname}\n`);
    process.exit();
}
const HOST = options.bind ?? DEFAULT_HOST;
const PORT = options.port ?? DEFAULT_PORT;
// Input inference
const URLorPORT = program.args[0];
const URL = isPositiveInteger(URLorPORT) ? `http://localhost:${URLorPORT}` : URLorPORT;
console.log(`\n   ▲ Check Site Meta ${appVersion}`);
// Setting up for IO
const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const env = {
    ...process.env,
    HOSTNAME: HOST,
    PORT: String(PORT),
    DISABLE_ANALYTICS: !options.analytics ? "true" : undefined,
    CSM_VERSION: appVersion,
    LOCAL: 'true',
    USING_NPX: 'true',
};
// Setting up process
const nextProcess = spawn("node", [path.join(__dirname, "./standalone/server.js")], {
    stdio: ["ignore", "pipe", "pipe"],
    env,
});
// Register io hooks, listen to input output.
nextProcess.stdout.on("data", (data) => {
    const message = String(data);
    if (message.startsWith("   ▲ Next.js ")) {
        process.stdout.write(message.replace("Next.js", "Using Next.js"));
        return;
    }
    if (message.startsWith("   - Local:")) {
        process.stdout.write(`   - Local: http://${HOST}:${PORT}${skipAnalytics ? " (Analytics disabled)" : ""}
   - Starting... 🚀\n\n`);
        return;
    }
    process.stdout.write(`${data}`);
    if (message.includes(`✓ Ready in`)) {
        io.question(' ? Do you want to open the browser? (Y/n) ', (answer) => {
            if (answer.toLowerCase() === 'y' || answer === '') {
                console.log(` → Opening browser at http://${HOST}:${PORT}`);
                open(`http://${HOST}:${PORT}${URL ? `/?url=${URL}` : ""}`);
            }
            else {
                console.log(' → Skipping browser launch.');
                setTimeout(() => {
                    console.log(' → Found any bugs? Be sure to DM me on X: @alfonsusac or create an issue in the check-site-meta github repo.');
                }, 2000);
            }
            io.close();
        });
    }
});
// Read and modify stderr (warnings/errors)
nextProcess.stderr.on("data", (data) => {
    process.stderr.write(`[ERROR] ${data}`);
});
// Handle process exit
nextProcess.on("exit", (code) => {
    if (code === 0) {
        console.log("\n✅ Next.js server is running!");
    }
    else {
        console.error("\n❌ Next.js server failed to start.");
    }
});
const cleanup = () => {
    console.log(`\n → Stopping server on port ${PORT}...`);
    nextProcess.kill("SIGTERM"); // Gracefully stop child process
    process.exit();
};
process.on("SIGINT", cleanup); // Ctrl + C
process.on("SIGTERM", cleanup); // Kill command
// Util
function isPositiveInteger(str) {
    return /^[1-9]\d*$/.test(str);
}
