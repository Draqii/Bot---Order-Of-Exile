const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
import onReady from "./listeners/onReady";
import onInteractionCreate from "./listeners/onInteractionCreate";
import 'dotenv/config'

const retrieveToken = () => {
    console.log("Retrieving Token...")
    return process.env.token; 
}

const createClient = () => new Client({
    intents: []
});

const login = (client: typeof Client) => {
    const token = retrieveToken()
    console.log("Logging In...")
    client.login(token);
}

const includeCommands = (client: any) => {
    const commandsPath = path.join(__dirname, 'commands');
    console.log(commandsPath)

    const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));
    for (const file of commandFiles) {
        console.log(file)
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
    }
}

const client = createClient()

client.commands = new Collection();

includeCommands(client)

onReady(client)

onInteractionCreate(client)

login(client)