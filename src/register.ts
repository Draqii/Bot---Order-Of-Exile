const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
import 'dotenv/config'

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

const retrieveToken = () => {
	console.log("Retrieving Token...")
	return process.env.token;
}

for (const file of commandFolders) {
	const command = require(path.join(commandsPath, file));
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}

}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(retrieveToken());

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.application_id, process.env.guild),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();