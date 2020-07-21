var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var port = process.env.PORT || 7777;
var so_nguoi_vao_web = 0;
var visit = [];

server.listen(port, function() {
    console.log('listening on *' + port);
});
app.use(express.static(path.join(__dirname, 'views')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/visitcount', function(req, res) {
	if (!!req.query.set)
		so_nguoi_vao_web = req.query.set;
	if (!!req.query.plus)
		so_nguoi_vao_web += req.query.plus;

    res.send('<h1>visited: ' + so_nguoi_vao_web + '<br>visit time: ' + JSON.stringify(visit) +'</h1><script>var visit=`'+JSON.stringify(visit)+'`; console.log(JSON.parse(visit))</script>');
});

// -----------main-------------

function random(a, b, isRound = false) {
    return isRound ? Math.round(Math.random() * b + a) : Math.random() * b + a;
}

var animation = {
    'Pipe': function() {
        this.isObstacle = true;
        this.frame = 60; // frame to wait after run this
        this.depth = random(200, canvas.height - 200);
    },
    'Block': function() {
        this.isObstacle = true;
        this.frame = 60; // frame to wait after run this
        this.sizeX = random(50, 100);
        this.y = random(0, canvas.width);
        this.speedY = random(5, 10);
        this.direction = ['up', 'down'][Math.floor(random(0, 1))];
    },
    'MovingPipe': function() {
        this.isObstacle = true;
        this.frame = 60; // frame to wait after run this
        this.starY = random(0, canvas.height);
        this.speedY = 3;
        this.direction = ['up', 'down'][Math.round(random(0, 1))];
    },
    'Popen': function() {
        this.isObstacle = true;
        this.frame = 60; // frame to wait after run this
        this.depth = random(230, canvas.height - 230);
        this.open = Boolean(Math.round(random(0, 1)));
    },
    'Coin': function() {
        this.frame = 30;
        this.y = random(50, canvas.height - 50);
    }
}

var legal_animation = ['Pipe', 'Block', 'MovingPipe', 'Popen', 'Coin'];
var GameRecords = [];


var map = [],
    queue_player = {},
    legal_mode = [
        'duo',
        'rank'
    ];

var canvas = {
    width: 1366,
    height: 659
}

var matchBegin = function(mode, socket1, socket2) {
    socket1.emit('game ' + mode);
    socket2.emit('game ' + mode);
}

var addPlayerToQueue = function(socketID, mode) {
    if (legal_mode.indexOf(mode) == -1) return;
    if (!queue_player[mode])
        queue_player[mode] = [];
    queue_player[mode].push(socketID);
    // console.log(queue_player)
}

io.on('connection', function(socket) {
    socket.on('connected', () => {
    	visit.push({
    		id: socket.id,
    		time: Date.now(),
    		out: Date.now()
    	})
        // console.log(socket.request.headers.cookie);
        so_nguoi_vao_web++;
        console.log('Web hien gio da co ' + so_nguoi_vao_web + ' nguoi vao web');
    })

    socket.on('game record', gameRecord => {
    	// console.log('gay')
        GameRecords.push({ playerID: socket.id, gameRecord: gameRecord });
        if (GameRecords.length > 5){
        	GameRecords.splice(0, 1);
        	// console.log(GameRecords)
        }
    })

    socket.on('game req pvp', () => {
        // console.log(GameRecords)
        // debugger;

        let alertConfig = {
            title: 'Oops!',
            text: "Server cannot find your opponent!",
            icon: "error",
            _onDestroy: `$('#menu_button').fadeIn(200, () => {});$("#pvp").prop('disabled', false);`
        }

        if (GameRecords.length == 0) {
            socket.emit('alert', alertConfig)
            return;
        }

        var danhdau = {
            arr: [],
            obj: {}
        };
        let i = 0;
        do {
            i = random(0, GameRecords.length - 1, true);
            if (!danhdau.obj[i]) {
                danhdau.arr.push(i);
            }
            danhdau.obj[i] = true;
            if (GameRecords[i].playerID != socket.id) break;

            if (danhdau.arr.length == GameRecords.length) {
                socket.emit('alert', alertConfig);
                return;
            }
        }
        while (1)
        socket.emit('game res pvp', { gameRecord: GameRecords[i] });
    })

    socket.on('disconnect', ()=> {
    	let index = visit.findIndex((a)=>a.id == socket.id);
    	if (index != -1)
    		visit[index].out = Date.now();
    })
})

setInterval(() => {
    io.emit('game online', io.sockets.server.engine.clientsCount);
    // console.log(io.sockets.server.engine.clientsCount)
}, 1000)

//     io.emit('client online', io.sockets.server.engine.clientsCount);
// }, 1000);