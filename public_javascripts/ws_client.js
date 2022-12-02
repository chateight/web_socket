const ws = new WebSocket('ws://raspberrypi.local:3002')
 
ws.onopen = e => {
    console.log('Hello M5stack server!')
}

ws.onmessage = e => {
    const mes = document.querySelector("#mes");
	mes.textContent = e.data;

    let tgt_obj = JSON.parse(e.data);

    console.log(tgt_obj);

    let key_array = [];
    let val_array = [];

    for(key in tgt_obj){
	    key_array.push(key);
	    val_array.push(tgt_obj[key]);
    };

    //
    // to generate graph
    //
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
        labels: key_array,	
        datasets: [{
            label: 'temperature',
            fill: false,
            backgroundColor: '#0000ff', 
            borderColor: '#0000ff', 
            data:val_array,
            borderWidth: 2
        }]
        },
        options: {
            scales: {
                yAxes:  [{
                ticks: {
                suggestedMax: 40,
                suggestedMin: 0,
                stepSize: 5,
            }
        }]
      }
    }
  });

console.log('received data:%s',e.data)
    console.log(e)
}

ws.onerror = e => {
    console.log('fail to connect:${e.data}')
    console.log(e)
}

document.getElementById('send_server').addEventListener('click', () => {
    ws.send('call back from the button')
})
