/**
 * ====================================================================
 * اسکریپت رله ایران (Domestic Iran Relay Proxy)
 * ====================================================================
 * کاربرد:
 * اگر سرور CRM در دیتاسنتر داخلی ایران باشد و اتصالات خارجی به آن تایم‌اوت شود (Error 522)،
 * می‌توانید این اسکریپت را روی کامپیوتر خود یا یک سرور مجازی ایران (Iran VPS) اجرا کنید.
 *
 * نحوه اجرا:
 *   node relay.js
 *
 * سپس در کلودفلر:
 *   npx wrangler secret put CRM_RELAY_URL
 *   آدرس: http://YOUR_IRAN_IP:8788/api/my/cartable
 * ====================================================================
 */

import http from "http";
import https from "https";

const PORT = process.env.PORT || 8788;
const TARGET_HOST = "panel.hooshacrm.ir";

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`[${new Date().toLocaleTimeString("fa-IR")}] Proxying ${req.method} ${req.url}`);

  const options = {
    hostname: TARGET_HOST,
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: TARGET_HOST,
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Gateway", message: err.message }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log("==================================================");
  console.log(`✅ CRM Domestic Relay is running on port ${PORT}`);
  console.log(`Forwarding requests to https://${TARGET_HOST}`);
  console.log("==================================================");
});
