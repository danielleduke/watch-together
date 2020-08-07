var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

router.post('/', slackEvents.requestListener());

slackEvents.on('message', (event)=>{
  console.log(`Received event: \n\n${JSON.stringify(event, null, 4)}\n\n`);
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
  base('theMessages').create([
    {
      "fields": {
        "SlackTS": event.ts,
        "Text": event.text,
        "User": event.user
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    var myMessage= "the record IDs are: "
    records.forEach(function (record) {
      console.log(record.getId());
      myMessage +=`${record.getId()}, `;
    });
})
})

slackEvents.on('reaction_added', (event)=>{
  console.log(`Received event: \n\n${JSON.stringify(event, null, 4)}\n\n`);
})

module.exports = router;
