let request = require("request");

function handleWebhook(body, done){
  if(body.status=="STOP"){
    cancelReservation(body, done);
  }else if(body.status=="PAID"){
    sendConfirmation(body, done);
  }else {
    done("error!");
  }
}

function cancelReservation(body, done){
  console.log(`Canceling Reservation: \n ${JSON.stringify(body)}`)
  done("success!")
}

function sendConfirmation(body, done){
  console.log(`Sending Confirmation to ${body.customer.email}`);
  done("success!");
}

module.exports = handleWebhook;
