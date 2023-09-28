const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router/router');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8000;
const { client, params } = require('./controller/discordController');

const app = express();





app.use(cors());
app.use(bodyParser({limit: '10mb'}));
app.use(router);


console.log(params);

app.listen(port, ()=> console.log(`app is working on port ${port}`));
client.login(process.env.TOKEN);