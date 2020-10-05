const airtableTools = require('../tools/airtable-tools.js')

module.exports=async function(req, res, next) {
  console.log(JSON.stringify(JSON.parse(req.body.payload),null,4));
  var thePayload = JSON.parse(req.body.payload)
  if (thePayload.actions) {
    for (var i = 0; i < thePayload.actions.length; i++) {
      if (thePayload.actions[i].action_id=="user_watched") {
        console.log("confirmed that user watched");
        let personResult = await airtableTools.findByValue(thePayload.user.id, "LLDslackID")
        console.log("personResult");
        console.log(JSON.stringify(personResult));
        // add thePayload.actions[i].value to array of movies I've watched
        let updateResult = await airtableTools.updatePeopleRecord(personResult.id, thePayload.actions[i].value)
        console.log("updateResult");
        console.log(JSON.stringify(updateResult));
      }
    }
  }


  res.send('received!')

}
