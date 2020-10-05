var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);
var stillRegex = /(\.cr2|\.jpg|\.jpeg|\.png|\.gif)$/i;

router.post('/', slackEvents.requestListener());

slackEvents.on('message', (event)=>{
  console.log(`Received event: \n\n${JSON.stringify(event, null, 4)}\n\n`);
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
  if (event.subtype=="file_share"&&stillRegex.test(event.files[0].name)) {
    console.log("got an image and here's the markdown");
      var urlElements = event.files[0].permalink_public.split("-");
      var pubSecret = urlElements[(urlElements.length-1)];
      console.log(`![${event.files[0].title}](${event.files[0].url_private}?pub_secret=${pubSecret})`);
  }
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
