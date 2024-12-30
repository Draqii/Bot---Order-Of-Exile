import { Client } from "discord.js";

export default (client: Client): void => {
    client.on("ready", async () => {
        const invalidUserOrApplication = !client.user || !client.application
        if (invalidUserOrApplication) return;
        if (client.user) console.log(`${client.user.username} is online`);
    });
};