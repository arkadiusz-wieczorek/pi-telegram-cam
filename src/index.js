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
bot.sendMessage(USER_1, `Restart "pi-telegram-cam" bot - ${new Date()}`);

// SERIAL PORT INIT
raspi.init(() => {
	serial.open(() => {
		serial.on("data", (data) => {
			emitter.emit("event", data.toString("utf8"));
		});
	});
});

emitter.on("event", (data) => {
	console.log("event →", data);
	dispatch(USER_1);
});

bot.onText(/\/photo/, (data) => {
	if (data.chat.id == USER_1 || data.chat.id == USER_2) {
		bot.sendMessage(data.chat.id, `Roger that! 👀`);
		dispatch(data.chat.id, true);
	} else {
		logBlockedUser();
	}
});

function dispatch(chatId, byUser = false) {
	getImage("/dev/video0", 1920, 1080, "1").then((buffer) =>
		bot.sendPhoto(chatId, buffer, {
			caption: new Date(),
		})
	);

	if (byUser) {
		setTimeout(() => {
			getImage("/dev/video1", 1920, 1080, "1").then((buffer_2) =>
				bot.sendPhoto(chatId, buffer_2, {
					caption: new Date(),
				})
			);
		}, 1000);
	}
}

function logBlockedUser(data) {
	bot.sendMessage(
		USER_1,
		`Block user id: ${data.chat.id}, first_name: ${
			data.chat.first_name
		}, \n ${JSON.stringify(data)}`
	);
}
