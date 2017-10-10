const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// ENDPOINTS

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then( projects => response.status(200).json(projects) )
    .catch( error => response.status(500).json({ error }))
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then( palettes => response.status(200).json(palettes))
    .catch( error => response.status(500).json({ error }))
});
