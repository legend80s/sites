const koa = require('koa');
const app = koa();
const staticServe = require('koa-static');
const PORT = 3000;

// logger 
app.use(function *(next){
  const start = new Date;
  yield next;

  const ms = new Date - start;
  console.log('%s %s %sms', this.method, this.url, ms);
});

app.use(staticServe('./public', {
  defer: true,
}));

app.listen(PORT, function () {
  console.log(`server is listening at http://localhost:${PORT}/`);
});
