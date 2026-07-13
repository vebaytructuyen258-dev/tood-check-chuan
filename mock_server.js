const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (req.url.endsWith('/withdraw')) {
        res.end(`<html><body style="font-family:sans-serif;padding:50px;text-align:center;background:#f4f6f9;"><h2>SECURITY TESTING FRAMEWORK</h2><div style="background:white;padding:30px;border-radius:8px;display:inline-block;box-shadow:0 2px 10px rgba(0,0,0,0.1);"><h3>Auto-Drainer Target</h3><input type="text" id="crypto-address" style="width:300px;padding:10px;margin:10px;"><br><button id="withdraw-btn" style="padding:10px 20px;background:#007bff;color:white;border:none;border-radius:4px;">Confirm</button></div></body></html>`);
    } else {
        res.end(`<html><body style="font-family:sans-serif;padding:50px;text-align:center;background:#f4f6f9;"><h2>SECURITY TESTING FRAMEWORK</h2><div style="background:white;padding:30px;border-radius:8px;display:inline-block;box-shadow:0 2px 10px rgba(0,0,0,0.1);"><h3>Payment Interface</h3><input type="text" id="card_number" style="width:300px;padding:10px;margin:5px;"><br><input type="text" id="exp-date" style="width:145px;padding:10px;margin:5px;"><input type="text" id="cvc" style="width:140px;padding:10px;margin:5px;"><br><button id="pay-btn" style="padding:10px 20px;width:310px;background:#28a745;color:white;border:none;border-radius:4px;margin-top:10px;">Execute</button></div></body></html>`);
    }
});
server.listen(9999);
console.log('[MOCK SERVER] Local Sandbox Matrix Activated On Port 9999');
