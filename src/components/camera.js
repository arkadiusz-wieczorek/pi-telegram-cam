const NodeWebcam = require("node-webcam");
const opts = {
	quality: 100,
	delay: 0,
	saveShots: true,
	output: "jpeg",
	callbackReturn: "buffer",
	verbose: false,
};

module.exports = function getImage(cameraPath, width, height, filename) {
	const device = cameraPath;

	return new Promise((resolve, reject) => {
		console.log(`camera path: ${device} ${filename}`);

		NodeWebcam.capture(
			filename,
			{ ...opts, device, width, height },
			(err, data) => {
				if (err) reject("error", err);
				resolve(data);
			}
		);
	});
};
