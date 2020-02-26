const fetch = require("node-fetch");

function post_iot_endpoints() {
  now = new Date().getTime() / 1000  // normally returns milliseconds.  need seconds
  now = Math.round(now)

  // submit 5 different endpoint samples, at the current time.
  for (let endpoint_id = 1234; endpoint_id < 1239; endpoint_id++) {
    payload = {
      'ts': now,
      'endpoint_id': endpoint_id,
      'value': Math.random() * 30 + 5  // samples vary from 5°C - 35°C
    }
    console.log(payload)

    fetch("http://localhost:3000/v1/sample", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "authorization": "Basic cm9iYmllOmJhc2lj"
      },
      "body": payload
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Loop this again in 5 seconds.
  setTimeout( post_iot_endpoints, 5000 );

}

post_iot_endpoints();

