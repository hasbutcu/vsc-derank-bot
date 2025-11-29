const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { clientId, guildId, token } = require('../config.json');
const { oxypack } = require('oxypack');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);
    

    const activities = [
      { name: 'discord.gg/vsc', type: 'listening', status: 'idle' },
      { name: 'derank ❤️ vsc', type: 'playing', status: 'idle' },
      { name: '/oda <kod>', type: 'watching', status: 'idle' },
      { name: 'oxy 💝 derank', type: 'streaming', url: 'https://twitch.tv/morcikolata', status: 'idle' }
    ];
    oxypack(client, activities, 60000, true);

    try {
      const commands = [];
      const commandsPath = path.join(__dirname, '..', 'komutlar');
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
      }

      const rest = new REST({ version: '10' }).setToken(token);

      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      
      // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(clientId), // Global komutlar için
      { body: commands },
    
    );

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  },
};