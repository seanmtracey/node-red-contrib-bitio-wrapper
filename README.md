# node-red-contrib-bitio-wrapper

A node-red module that wraps some of the functionality of [David Whale's Bitio Library](https://github.com/whaleygeek/bitio/).

## Included in this module

1. A Bitio input node (for receiving messages, and communicating them to the Microbit)
2. A Bitio image node (for creating images that can be displayed on the Microbit)

## Usage

Before using the nodes, you must flash your Microbit with the Bitio hex file, included in the source code of this repo. Either clone or download the [source code](https://github.com/seanmtracey/node-red-bitio-wrapper) for this module and drag the bitio.hex file into the microbit folder on your computer. If successful, the bitio log will display.

### bitio-input

The bitio-input node is used to configure the connection to the microbit, and pass messages along to be displayed on the Microbit's 5x5 led screen (either as scrolling text or an image)

#### Setting serial port

Before you can connect to the Microbit, you need to configure the serial port to connect the device with. The a list of serial ports for each system should be populated automatically. 

1. Double-click on the `bitio-input` node to open the configuration panel
2. Click on the serial port dropdown
3. Select the port that your microbit is connected on. On a Mac, it should be something like /dev/tty.usbmodemXXXX. On a Raspberry Pi, it should be something like /dev/ttyACA0.
4. Click done and deploy your changes.

#### Sending text
To have text scroll across the Microbit LED display, pass a string as the value of the payload property

```JSON
{
    "payload" : "Hello, World!"
}
```

#### Sending an image

To set an LED on the Microbit display to on or off, you can pass an object like the following to the bitio-input node:

```JSON
{
    "payload": { 
        "bitio_image" : true, // If this value is not set, the image will not be displayed
        "image": "09090:09090:00000:90009:09990", // 9 = LED ON, 0 = LED OFF
        "displayFor" : "5" // The minimum number of seconds the image should display for. Some systems will allow the image to display for longer
    } 
}

```
You can generate the above output using the bitio-image node

### bitio-image

The bitio-image node is a visual way of setting the which LEDs to ON and which to OFF. 

1. Drag the node to the canvas and double-click to open the configuration panel. 
2. Click to toggle the ON/OFF states of the LEDs
3. Click done.
4. Connect your `bitio-image` node to a `bitio-input` node
5. Deploy your changes.
6. Click the button on the bitio-image node to display the image set on the Microbit display.

## Dependencies

This node-red module wraps [David Whale's Bitio Library](https://github.com/whaleygeek/bitio/) (which means all of the clever stuff is down to David!), so all of the requirements are exactly the same as that Python module. Head on over there and check that you have all of the prerequistes to run the Bitio library. If that's all sorted out, then `node-red-contrib-bitio-wrapper` should work fine too. If not, let me know by posting an issue.

## Caveats

As this module only wraps the Bitio Python library, and doesn't directly communicate with the Microbit, bi-directional communication is not currently possible. This may be rectified in the future, but for now, this module will only allow you to use the Microbit as an output device, you can't use the buttons or pins in your node-red flows.