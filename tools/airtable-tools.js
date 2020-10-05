var Airtable = require('airtable');
const findByValue = async function(value, field){
  console.log(`********${field}=${value}********`);
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
  var results = [];
  const airtableResponse = await base('People Master').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    filterByFormula: `${field}="${value}"`,
    view: "Grid view",
})
.eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      results.push(record);
        console.log('Retrieved', JSON.stringify(record,null,4));
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});

return results
}

const createTitleRecord = async function (slackPayload, OMDBresponse){
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
  const airtableResponse = await base('Titles').create(
      {
          "Title": OMDBresponse.data.Title,
          // "Actors": [
          //   // "recPVLxlIn3mn5phd",
          //   // "recR1LjzKyp43XAiI",
          //   // "recRrizsR8qwkIsXO",
          //   // "recPtg0W4uNRHl5DY"
          // ],
          // "Genre": [
          //   "Comedy",
          //   "Fantasy",
          //   "Sci-Fi"
          // ],
          "Plot": OMDBresponse.data.Plot,
          "Poster": [
            {
              "url": OMDBresponse.data.Poster,
            }
          ],
          "Runtime": OMDBresponse.data.Runtime,
          // "Type": [
          //   OMDBresponse.data.Type,
          // ],
          // "Director": [
          //   "recmjyLxvKmVFVip7"
          // ],
          // "Writer": [
          //   "recmjyLxvKmVFVip7"
          // ],
          "Year": OMDBresponse.data.Year,
      }
    );
  console.log(JSON.stringify(airtableResponse,null,4));
  return airtableResponse
}


const updateTitleRecord = async function (slackPayload, OMDBresponse){
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
  const airtableResponse = await base('Titles').create(
      {
          "Title": OMDBresponse.data.Title,
          // "Actors": [
          //   // "recPVLxlIn3mn5phd",
          //   // "recR1LjzKyp43XAiI",
          //   // "recRrizsR8qwkIsXO",
          //   // "recPtg0W4uNRHl5DY"
          // ],
          // "Genre": [
          //   "Comedy",
          //   "Fantasy",
          //   "Sci-Fi"
          // ],
          "Plot": OMDBresponse.data.Plot,
          "Poster": [
            {
              "url": OMDBresponse.data.Poster,
            }
          ],
          "Runtime": OMDBresponse.data.Runtime,
          // "Type": [
          //   OMDBresponse.data.Type,
          // ],
          // "Director": [
          //   "recmjyLxvKmVFVip7"
          // ],
          // "Writer": [
          //   "recmjyLxvKmVFVip7"
          // ],
          "Year": OMDBresponse.data.Year,
      }
    );
  console.log(JSON.stringify(airtableResponse,null,4));
  return airtableResponse
}

const updatePeopleRecord = async function(personID, titleID){
  var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_WATCHTOGETHER_BASE);
  const airtableResponse = await base('People Master').update({
    "id": personID,
    "fields": {
      "Titles": [
        titleID
      ],
    }
  })
return airtableResponse
}

module.exports.createTitleRecord = createTitleRecord;
module.exports.updateTitleRecord = updateTitleRecord;
module.exports.findByValue = findByValue;
module.exports.updatePeopleRecord = updatePeopleRecord;
