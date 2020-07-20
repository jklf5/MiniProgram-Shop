const Koa = require("koa");
const app = new Koa();
const https = require("https");
const fs = require("fs");
// ssl
const enforceHttps = require("koa-sslify").default;
app.use(enforceHttps());
const bodyParser = require("koa-bodyparser");
const config = require("./config");
const router = require("./routes");

// 解析请求体
app.use(bodyParser());

app.use(router.routes());

//app.listen(config.port, () => {
//  console.log(`server is started at port ${config.port}`);
//});

const options = {
  key: fs.readFileSync('/etc/pki/nginx/private/2_jklf5.xyz.key'),
  cert: fs.readFileSync('/etc/pki/nginx/1_jklf5.xyz_bundle.crt')
};
https.createServer(options, app.callback()).listen(config.port, () => {
  // const host = server.address().address
  const host = config.mysql.host;
  const port = config.port;
  console.log(`应用实例，访问地址为 https://${host}:${port}`);
});
