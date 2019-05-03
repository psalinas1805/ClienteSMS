var SerialPort = require('serialport');
var port = new SerialPort('COM8', function(err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

port.on("open", onOpen);
port.on('error', onError);
port.on('data', onDataReceived);

function onOpen(error) {
    if (!error) {
        console.log('Port open sucessfully');


        if (port.isOpen) {
            //send(port, "+56988280593", "prueba 1");
            enviarMensaje();
            //}, 2000);

        }
    }
}

function onDataReceived(data) {
    console.log("Received data: " + data);
}

function onError(error) {
    console.log(error);
}

function onClose(error) {
    console.log('Closing connection');
    console.log(error);
}

function send(serial, toAddress, message) {

    console.log(`Enviando mensaje ${message}`);
    serial.write('AT+CMGF=1');
    serial.write('\r');
    serial.write("AT+CMGS=\"");
    serial.write(toAddress);
    serial.write('"');
    serial.write('\r');
    serial.write(message);
    serial.write(String.fromCharCode(26));
    serial.write(String.fromCharCode(26));
    serial.write('\r');
}

function read(serial) {
    serial.write("AT + CMGF =1");
    serial.write('\r');
    serial.write("AT+CPMS=\"SM\"");
    serial.write('\r');
    serial.write("AT+CMGL=\"ALL\"");
    serial.write('\r');
}

port.write('main screen turn on', function(err) {
    if (err) {
        return console.log('Error on write: ', err.message);
    }


});

function enviarMensaje() {
    //setTimeout(() => {
    /*send(port, "+56990232413", "prueba 1");
    read(port);
    setTimeout(() => {
        send(port, "+56931258857", "prueba 1");
        read(port);
    }, 1000);*/
    setTimeout(() => {
        send(port, "+56988280593", "prueba 1");
        read(port);
    }, 1000);


    send(port, "+56990232413", "prueba 2");
    read(port);
    send(port, "+56931258857", "prueba 2");
    read(port);
    send(port, "+56988280593", "prueba 2");
    read(port);
    send(port, "+56990232413", "prueba 3");
    read(port);
    send(port, "+56931258857", "prueba 3");
    read(port);
    send(port, "+56988280593", "prueba 3");
    read(port);
    send(port, "+56990232413", "prueba 4");
    read(port);
    send(port, "+56931258857", "prueba 4");
    read(port);
    send(port, "+56988280593", "prueba 4");
    read(port);
}