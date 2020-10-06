const NodeWebcam = require("node-webcam");
const opts = {
	quality: 100,
	delay: 0,
	saveShots: false,
	output: "jpeg",
	callbackReturn: "buffer",
	verbose: true,
};

module.exports = function getImage(cameraPath, width, height, filename) {
	return new Promise((resolve, reject) => {
		console.log(`camera path: ${cameraPath} ${filename}`);

		NodeWebcam.capture(
			filename,
			{ ...opts, cameraPath, width, height },
			(err, data) => {
				if (err) reject("error", err);
				resolve(data);
			}
		);
	});
};
