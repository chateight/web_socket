const dgram = require('dgram');
const udp_port = 3002;
const client ='0.0.0.0';
const socket = dgram.createSocket('udp4');
socket.bind(udp_port, client);

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 3002 });

let tgt_str_a = [];

wss.on('connection', ws_client => {

  //ws_client.send('good morning');

  socket.on('message', (message, remote) => {
    console.log('' + message);
    //
    // regx process, generate object & convert it to json format
    //
    const hour_sec = /\s[\d]*:[\d]*\s[\d]*/g;
    const temp_str = /\s[\d|.|-]*/g;

    let data_obj = {};
    
    if (tgt_str_a .length >= 5){
        tgt_str_a .shift();
    }
    tgt_str_a .push(String(message));

    tgt_str_a.forEach(function(data ){
	    regx_time = data.match(hour_sec)[0].substr(1);
	    regx_val = data.match(temp_str)[2].substr(1);
	    data_obj[regx_time] = parseFloat(regx_val);
    });

    let tgt_json = JSON.stringify(data_obj);

        ws_client.send('' + tgt_json);
    });

    ws_client.on('message', data => {
        console.log('send data: %s', data);
        ws_client.send('received the data:' + data);
    });
});
