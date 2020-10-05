var express = require('express');
var router = express.Router();
var axios = require('axios');
var Airtable = require('airtable');
const slackTools = require ('../tools/slack-tools');
const { WebClient } = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_BOT_TOKEN);
const airtableTools = require ('../tools/airtable-tools');
const slackInteractions = require ('./slack-interactions');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Slacks Tests Go Here' });
});


router.post('/watch', async function(req, res, next){
    try {
      console.log(JSON.stringify(req.body,null,4));
      const OMDBresponse = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURI(req.body.text)}`);
      console.log(OMDBresponse);
      const airtableResponse = await airtableTools.createTitleRecord(req.body, OMDBresponse);
      // res.send(`got a slash request: ${JSON.stringify(response.data,null,4)}`)
      res.json({
	       "blocks": [
		         {
          			"type": "image",
          			"title": {
          				"type": "plain_text",
          				"text": OMDBresponse.data.Title,
          				"emoji": true
          			},
          			"image_url": OMDBresponse.data.Poster,
          			"alt_text": `${OMDBresponse.data.Title} Poster`,
		         },
		         {
			          "type": "divider"
		         },
          		{
          			"type": "section",
          			"text": {
          				"type": "mrkdwn",
          				"text": `The ${OMDBresponse.data.Type} you requested is ${OMDBresponse.data.Title}. \n\n*Plot Summary*\n${OMDBresponse.data.Plot}`
          			       }
		           },
              {
          			"type": "actions",
          			"elements": [
          				{
          					"type": "button",
          					"text": {
          						"type": "plain_text",
          						"text": "I've watched this!",
          						"emoji": true
          					},
          					"value": airtableResponse.id,
                    "action_id": "user_watched"
          				  }
          			             ]
              }
	                 ]
})
    } catch (error) {
      console.error(error);
      res.send(`got a failed slash request: ${JSON.stringify(req.body,null,4)}`)
    }
})

router.post('/interactions', slackInteractions);

router.get('/word/:myword', function(req, res, next) {
  slackTools.sendMyMessage(req.params.myword);
  console.log(`the word is ${req.params.myword}`);
  //send that word to slack
  res.render('index', { title: `Word=${req.params.myword}` });
});

router.get('/channels', async function(req, res, next){
  console.log("searching for channels");
  const result = await web.conversations.list({});
  res.json(result);
})

router.get('/emojis', async function(req, res, next){
  console.log("searching for custom emojis");
  const result = await web.emoji.list({});
  res.json(result);
})

module.exports = router;



// var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
// base('Titles').create([
//   {
//     "fields": {
//       "Title": response.data.Title,
//       "Year": response.data.Year;
//       "Poster": response.data.Poster,
//       "Type": response.data.Type,
//       "Genre": response.data.Genre;
//       "Plot": response.data.Plot;
//       "Runtime": response.data.Runtime;
//       "Actors": response.data.Actors;
//       "Director": response.data.Director;
//       "Writer": response.data.Writer;
//     }
