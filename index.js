const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Server index page
app.get('/', function (req, res) {
  res.send('Hello!');
});

// Facebook Webhook
// Used for verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === token) {
    res.status(200).send(req.query['hub.challenge']);
  }
    res.send('No entry');
});

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }
        sendTextMessage(sender, "Message received: " + text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })

app.listen(app.get('port'), function(){
	console.log('running on port', app.get('port'))
})