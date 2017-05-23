let request = require("request");

const clientId= "6bd28423e3a931648a9484f930b214ce3881c712841b787b51b274986ec4bd47";
const clientSecret = "a660efe1e5132dcd07500ec8b73135819f408b6d794bd356004ebaaed3ca54ef";
const oAuthUrl = "https://connect.devicewebmanager.com/oauth/token?client_id=6bd28423e3a931648a9484f930b214ce3881c712841b787b51b274986ec4bd47&client_secret=a660efe1e5132dcd07500ec8b73135819f408b6d794bd356004ebaaed3ca54ef&grant_type=client_credentials";
const lockstateUrl = "https://api.lockstate.com"

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
  getToken((response)=>{
    console.log(response);
    done("success!");
  })
}

function getToken(done){
  request({ url: oAuthUrl, method: "POST"},(error,response,body)=>{
    done(response);
  })
}

module.exports = handleWebhook;
