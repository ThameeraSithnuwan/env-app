const http = require("http");
const fs = require("fs");
const path = require("path");

// Load config from file if it exists
const configPath = process.env.CONFIG_PATH || "/app/config/config.json";

try {
  if (fs.existsSync(configPath)) {
    console.log(`Loading config from ${configPath}`);
    const configFile = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(configFile);

    // Merge config into process.env
    // Existing env vars take precedence? Or config file?
    // User request: "pass env values from that".
    // Usually config mount overrides or supplements.
    // Let's implement providing defaults or overrides.
    // Common pattern: config file is the source of truth for declared vars.
    Object.assign(process.env, config);
  } else {
    console.log(
      `No config file found at ${configPath}, using environment variables.`
    );
  }
} catch (error) {
  console.error("Error reading config file:", error);
}

const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (method === "GET") {
    if (url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Hello from Dockerized Node.js App!\n");
    } else if (url === "/health") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
    } else if (url === "/api/info") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
        })
      );
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("404 Not Found\n");
    }
  } else {
    res.statusCode = 405;
    res.setHeader("Content-Type", "text/plain");
    res.end("405 Method Not Allowed\n");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
