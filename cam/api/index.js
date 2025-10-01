export default function handler(req, res) {
  if (req.method === "POST" && req.url === "/upload") {
    let body = [];
    req.on("data", chunk => body.push(chunk));
    req.on("end", () => {
      global.lastImage = Buffer.concat(body);
      res.status(200).send("OK");
    });
  } else if (req.method === "GET" && req.url === "/stream.jpg" && global.lastImage) {
    res.setHeader("Content-Type", "image/jpeg");
    res.send(global.lastImage);
  } else {
    res.setHeader("Content-Type", "text/html");
    res.end(`
      <html>
        <head><title>ESP32-CAM Streaming</title></head>
        <body style="background:#000;display:flex;align-items:center;justify-content:center;height:100vh">
          <img src="/stream.jpg" style="max-width:100%;border:5px solid white" />
          <script>
            setInterval(()=>{
              document.querySelector("img").src="/stream.jpg?t="+Date.now()
            },200);
          </script>
        </body>
      </html>
    `);
  }
}
