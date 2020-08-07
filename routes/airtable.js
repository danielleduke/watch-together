var express = require('express');
var router = express.Router();
var Airtable = require('airtable');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
  base('theMessages').create([
    {
      "fields": {
        "SlackTS": "10:13am",
        "Text": "hello august",
        "User": "bingo"
      }
    },
    {
      "fields": {
        "SlackTS": "12:18pm",
        "Text": "test message2",
        "User": "porky"
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
    res.send(myMessage);
  });

});

module.exports = router;
