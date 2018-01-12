const debug = require('debug');
const { spawn } = require('child_process');

function executeMicrobitCommand(command, options){

	return new Promise( (resolve, reject) => {

		const arguments = [
			'execute.py',
			`scrolling-text`,
			"Hello!"
		];
		
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
			/*msg.payload = msg.payload.toLowerCase();
			node.send(msg);*/
		});
		
	}
		
	RED.nodes.registerType("bitio", bitio);

}

executeMicrobitCommand();