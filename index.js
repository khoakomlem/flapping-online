/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable no-constant-condition */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

const port = process.env.PORT || 7777;

server.listen(port, () => {
	console.log(`listening on *${port}`);
});
app.use(express.static(path.join(__dirname, 'views')));
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

function random(a, b, isRound = false) {
	return isRound ? Math.round(Math.random() * b + a) : Math.random() * b + a;
}

const GameRecords = [];

io.on('connection', (socket) => {
	socket.on('connected', () => {
		console.log(`Web hien gio da co ${io.sockets.server.engine.clientsCount} nguoi vao web`);
	});

	socket.on('game record', (gameRecord) => {
		GameRecords.push({
			playerID: socket.id,
			gameRecord,
		});
		if (GameRecords.length > 5) {
			GameRecords.splice(0, 1);
		}
	});

	socket.on('game req pvp', () => {
		const alertConfig = {
			title: 'Oops!',
			text: 'Server cannot find your opponent!',
			icon: 'error',
			_onDestroy: '$(\'#menu_button\').fadeIn(200, () => {});$("#pvp").prop(\'disabled\', false);',
		};

		if (GameRecords.length === 0) {
			socket.emit('alert', alertConfig);
			return;
		}

		const danhdau = {
			arr: [],
			obj: {},
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
		while (1);
		socket.emit('game res pvp', {
			gameRecord: GameRecords[i],
		});
	});
});

setInterval(() => {
	io.emit('game online', io.sockets.server.engine.clientsCount);
}, 1000);
