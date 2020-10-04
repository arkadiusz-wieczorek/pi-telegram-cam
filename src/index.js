// TELEGRAM CONFIG
const tg = require("node-telegram-bot-api");
const TOKEN = process.env.TELEGRAM_TOKEN;
const USER_1 = process.env.USER_1;
const USER_2 = process.env.USER_2;
const bot = new tg(TOKEN, {
	polling: true,
	filepath: false,
});

// SERIAL PORT CONFIG
const raspi = require("raspi");
const Serial = require("raspi-serial").Serial;
const serial = new Serial({ portId: "/dev/ttyUSB0", baudRate: 115200 });

const ee = require("event-emitter");
const emitter = ee();
const getImage = require("./components/camera.js");

// STARTUP
bot.sendMessage(USER_1, `Restart server "pi-telegram-cam" - ${new Date()}`);

// SERIAL PORT INIT
raspi.init(() => {
	serial.open(() => {
		serial.on("data", (data) => {
			emitter.emit("event", data.toString("utf8"));
		});
	});
});

emitter.on("event", (data) => {
	dispatch(USER_1, true);
});

bot.onText(/\/photo/, (data) => {
	console.log(`data.chat.id: ${data.chat.id}`);

	if (chatId == USER_1 || chatId == USER_2) {
		dispatch(data.chat.id, false);
	} else {
		bot.sendMessage(
			`Block user id: ${data.chat.id}, first_name: ${data.chat.first_name}`
		);
	}
});

function dispatch(chatId, toAll = false) {
	getImage("/dev/video0", 640, 480, "1").then((data) =>
		sendPhoto(data, toAll)
	);
	getImage("/dev/video1", 640, 480, "1").then((data) =>
		sendPhoto(data, toAll)
	);
}

function sendPhoto(data, toAll = false) {
	if (!toAll) {
		bot.sendPhoto(USER_1, data, {
			caption: new Date(),
		});
	} else {
		bot.sendPhoto(USER_1, data, {
			caption: new Date(),
		});
		bot.sendPhoto(USER_2, data, {
			caption: new Date(),
		});
	}
}