var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/stream',function(req,res){
	const path = './assets/video.mp4';
	const stat = fs.statSync(path);
	const filesize = stat.size;
	const range = req.headers.range;
	if(range){
		const parts = range.replace(/bytes=/,"").split("-");
		const start = parseInt(parts[0],10);
		const end = parts[1] ? parseInt(parts[1],10) : filesize - 1;
		const chunkSize = (end-start) + 1;
		const file = fs.createReadStream(path,{start,end});
		const head = {
			'Content-Range' : `bytes ${start}-${end}/${filesize}`,
			'Accept-Ranges' : 'bytes',
			'Content-Length' : chunkSize,
			'Content-Type' : 'video/mp4'
		}
		res.writeHead(206,head);
		file.pipe(res);
	}else{
		const head = {
			'Content-Length' : filesize,
			'Content-Type' : 'video/mp4'
		}
		res.writeHead(200,head);
		fs.createReadStream(path).pipe(res);
	}
});



io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log(msg);
  });
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});