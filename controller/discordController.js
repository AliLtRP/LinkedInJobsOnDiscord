const { Client, IntentsBitField, ApplicationCommandOptionType } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers,IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv').config();
const { searchJob } = require('./apiController');
const { RateLimiter } = require('discord.js-rate-limiter');


// auth
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

/**
 * command and slash commands 
 */
const command = [
    {
      name: 'ping',
      description: 'Replies with Pong!',
    },
    {
        name: 'search',
        description: 'search for latest jobs',
        
        // additional with the command
        options: [
            {
                name: 'query',
                description: 'enter the job title ex: front end web developer in iraq',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'country',
                description: 'jobs in which country ex: us, iq',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'date_posted',
                description: 'all, today, 3days, week, month',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ],
    }
];


const rest = new REST({version: '10'}).setToken(token);


// registoration 
let registoration = async()=> {
    try {
        await rest.put(Routes.applicationCommands(clientId), { body: command });
    } catch (err) {
        console.log(err);
    }
}

registoration();


client.on('ready', ()=>{
    console.log(`Logged in as ${client.user.tag}!`);
});

let  rate = new RateLimiter(1, 60*60*1000);

// when user use command, here is the response
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()) return

    if(interaction.commandName === 'ping') {
        interaction.reply('pong!');
    } else if(interaction.commandName === 'search') {

        // rate limiter passed on the user id
        let limited = rate.take(interaction.user.id);

        // if the user use his request
        if(limited) {
            interaction.reply({
                content: "too much requests",
                ephemeral: false
            });

            return;
        }


        // get the params from user input
        const options = interaction.options.data;

        // take the options from the user message
        let params = {};

        options.map((v,i) => {
            return params[v.name] = v.value  
        });


        try{
            const reply = await searchJob(params)
                .then(res => {
                    interaction.reply({
                        content: res,
                        ephemeral: false
                    });
                })


        } catch(err) {
            console.log(err);
        }
        
    }

});


module.exports = {
    client,
}