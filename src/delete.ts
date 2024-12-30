import { REST, Routes } from "discord.js"
import 'dotenv/config'

const rest = new REST().setToken(process.env.token ?? "");

// ...

// for guild-based commands
rest.put(Routes.applicationGuildCommands(process.env.application_id ?? "", process.env.guild ?? ""), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(process.env.application_id ?? ""), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);