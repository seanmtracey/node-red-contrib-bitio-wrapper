const debug = require('debug')('node-red-contrib-bitio-wrapper');
const { spawn } = require('child_process');

function executeMicrobitCommand(wordsToSay){

	return new Promise( (resolve, reject) => {

		const arguments = [
			`${__dirname}/execute.py`,
			__dirname,
			`scrolling-text`,
			wordsToSay
		];
		
		console.log(arguments);

		const microbitProcess = spawn('python', arguments);

		microbitProcess.stdout.on('data', (data) => {
			console.log(`node-red-contrib-bitio-wrapper: stdout: ${data}`);
		});
		
		microbitProcess.stderr.on('data', (data) => {
			console.log(`node-red-contrib-bitio-wrapper: stderr: ${data}`);
		});
		
		microbitProcess.on('close', (code) => {
			console.log(`node-red-contrib-bitio-wrapper: child process exited with code ${code}`);

			if(code === 0){
				resolve();
			} else {
				reject();
			}

		});

	});

}

module.exports = function(RED) {
		
	function bitio(config) {
		
		RED.nodes.createNode(this, config);
		
		var node = this;

		node.on('input', function(msg) {

			console.log('INPUT:', msg);
			executeMicrobitCommand(msg.payload.toString())
				.then(d => {
					console.log(d);
					node.send(msg);
				})
				.catch(e => console.log('err:', e))
			;

		});
		
	}
		
	RED.nodes.registerType("bitio-wrapper", bitio);

}