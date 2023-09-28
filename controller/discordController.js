const { Client, IntentsBitField, ApplicationCommandOptionType } = require('discord.js');
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers,IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv').config();


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
                name: 'job-title',
                description: 'enter the job title ex: frontend dev in baghdad, Iraq',
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
                name: 'date-posted',
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


// when user use command, here is the response
client.on('interactionCreate', interaction => {
    if(!interaction.isChatInputCommand()) return

    if(interaction.commandName === 'ping') {
        interaction.reply('pong!');
    } else if(interaction.commandName === 'search') {
        console.log(interaction.options.data);
        interaction.reply('under construction');
    }

});


client.login(token);


module.exports = {
    client
}