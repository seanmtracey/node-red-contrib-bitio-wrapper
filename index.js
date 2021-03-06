const debug = require('debug')('node-red-contrib-bitio-string');
const fs = require('fs');
const { spawn } = require('child_process');
const SerialPort = require('serialport');

const jobs = [];

let processRunning = false;

function executeMicrobitCommand(dataToPass, functionType = 'scrolling-text', timeToDisplay = 3){

	return new Promise( (resolve, reject) => {

		const arguments = [
			`${__dirname}/execute.py`,
			__dirname,
			functionType,
            dataToPass,
            timeToDisplay
		];
        
        debug(dataToPass);

		debug(arguments.join(' '));

		const microbitProcess = spawn('python', arguments);

		microbitProcess.stdout.on('data', (data) => {
			debug(`node-red-contrib-bitio-string: stdout: ${data}`);
		});
		
		microbitProcess.stderr.on('data', (data) => {
			debug(`node-red-contrib-bitio-string: stderr: ${data}`);
		});
		
		microbitProcess.on('close', (code) => {
			debug(`node-red-contrib-bitio-string: child process exited with code ${code}`);

			if(code === 0){
				resolve();
			} else {
				reject();
			}

		});

	});

}

function runJob(node){

    const currentJob = jobs.shift();    
    processRunning = true;

    const isBitIoImage = !!currentJob.payload.bitio_image;
    
    const dataToSend = isBitIoImage ? currentJob.payload.image : currentJob.payload.toString();
    const jobType = isBitIoImage ? 'image' : 'scrolling-text';

    debug('jobType', jobType);

    executeMicrobitCommand(dataToSend, jobType, currentJob.payload.displayFor)
        .then(function(){

            node.send(currentJob);

            processRunning = false;

            if(!processRunning && jobs.length > 0){
                runJob(node);
            }

        })
        .catch(e => {
            debug('err:', e);

            processRunning = false;

            if(!processRunning && jobs.length > 0){
                runJob(node);
            }

        })
    ;

}

module.exports = function(RED) {

    // Node for handling sending data to the bitio device.
    function handleBitioInput(config) {

        RED.nodes.createNode(this, config);
    
        var node = this;
        
        if(config.serialport !== ''){
            debug('Writing serial port to portscan.cache file');
            fs.writeFileSync(`${__dirname}/portscan.cache`, config.serialport + '\n');
        }
    
        node.on('input', function(msg) {
    
            debug('INPUT:', msg);
            debug(`There are ${jobs.length} that need to complete before this job is run.`);
            debug(`Adding job to queue`);
            
            if(config.enablebuffer || ( !config.enablebuffer && jobs.length === 0 && !processRunning ) ){
                jobs.push(msg);
            }

            if(!processRunning && jobs.length > 0){
                runJob(node);
            }
    
        });
        
    }

    RED.nodes.registerType("bitio-input", handleBitioInput);


    // Node for creating 5x5 images in the node-red UI.
    function createMicrobitImage(config) {

        RED.nodes.createNode(this, config);
    
        var node = this;
    
        node.on('input', function(msg) {
    
            debug('IMAGE-INPUT:', config);
            
            msg.payload = {};
            msg.payload.bitio_image = true;
            msg.payload.image = config.image;
            msg.payload.displayFor = config.displayFor;

            node.send(msg);
    
        });
        
    }

    RED.nodes.registerType("bitio-image", createMicrobitImage);

    RED.httpAdmin.post("/serialports", RED.auth.needsPermission("inject.write"), function(req,res) {
        
        SerialPort.list()
            .then(devices => {
                const portNames = devices.map(device => device.comName);
                res.send( JSON.stringify( { ports : portNames }) );
            })
            .catch(err => debug('There was an error getting the serial ports on this system:', err))
        ;

    });

}
