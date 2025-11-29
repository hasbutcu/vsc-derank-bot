const { ChannelType } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // Check for custom voice channels
    const channelId = oldState.channelId || newState.channelId;
    if (!channelId) return;
    
    const channel = oldState.guild.channels.cache.get(channelId);
    if (!channel) return;
    
    // Check if this is one of our Valorant team channels
    if (channel.parent && channel.parent.name.startsWith('Kod: ')) {
      const code = channel.parent.name.replace('Kod: ', '');
      const yazicode = code.toLowerCase();
      
      // If everyone left the channel
      if (oldState.channelId === channelId && newState.channelId !== channelId) {
        // Check if channel is empty
        if (channel.members.size === 0) {
          try {
            // Find the associated text channel
            const textChannel = channel.parent.children.cache.find(ch => 
              ch.type === ChannelType.GuildText && ch.name === `kod-${yazicode}`
            );
            
            // Delete the category and all channels in it
            if (textChannel) await textChannel.delete();
            await channel.delete();
            await channel.parent.delete();
            
            console.log(`Deleted empty Valorant team channel with code: ${code}`);
          } catch (error) {
            console.error(`Error deleting empty Valorant team channel: ${error}`);
          }
        }
      }
    }
  },
};