const { SlashCommandBuilder, ChannelType } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oda')
    .setDescription('6 haneli Valorant takım kodu ile oda oluşturur')
    .addStringOption(option =>
      option.setName('kod')
        .setDescription('6 haneli Valorant takım kodu')
        .setRequired(true)),
    
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const kucukcode = interaction.options.getString('kod');
    const code = kucukcode.toUpperCase();
    
    // Validate code (only letters and numbers, exactly 6 characters)
    if (!code.match(/^[a-zA-Z0-9]{6}$/)) {
      return interaction.editReply({
        content: 'Geçersiz kod! Kod sadece 6 harften ve/veya rakamdan oluşmalıdır.',
        ephemeral: true
      });
    }
    
    try {
      // Get mention role if it exists
      const mentionRoleId = db.get(`mention_role_${interaction.guild.id}`);
      const mentionRole = mentionRoleId 
        ? interaction.guild.roles.cache.get(mentionRoleId) 
        : null;
      
      // Create category
      const category = await interaction.guild.channels.create({
        name: `Kod: ${code}`,
        type: ChannelType.GuildCategory,
        reason: `Valorant oda oluşturuldu: ${code}`
      });
      
      // Create voice channel
      const voiceChannel = await interaction.guild.channels.create({
        name: `Kod: ${code}`,
        type: ChannelType.GuildVoice,
        parent: category,
        reason: `Valorant oda oluşturuldu: ${code}`
      });
      
      // Create text channel
      const textChannel = await interaction.guild.channels.create({
        name: `Kod-${code}`,
        type: ChannelType.GuildText,
        parent: category,
        reason: `Valorant oda oluşturuldu: ${code}`
      });
      
      // Send and pin message in text channel
      const message = await textChannel.send({
        content: mentionRole ? `# Kod: ${code} \n ${mentionRole}` : `# Kod ${code}`
      });
      
      await message.pin();
      
      // Delete the pin notification message
      const messages = await textChannel.messages.fetch({ limit: 10 });
      const pinMessage = messages.find(m => m.type === 6); // Type 6 is CHANNEL_PINNED_MESSAGE
      if (pinMessage) await pinMessage.delete();
      
      await interaction.editReply({
        content: `Oda başarıyla oluşturuldu! Kod: ${code}`,
        ephemeral: true
      });
      
      // Set a timer to check if anyone joined
      setTimeout(async () => {
        // Check if channel still exists
        const channelExists = interaction.guild.channels.cache.get(voiceChannel.id);
        if (!channelExists) return;
        
        // Check if anyone joined
        if (voiceChannel.members.size === 0) {
          try {
            // No one joined, delete everything
            await textChannel.delete();
            await voiceChannel.delete();
            await category.delete();
            console.log(`Deleted unused Valorant team channel with code: ${code}`);
          } catch (error) {
            console.error(`Error deleting unused Valorant team channel: ${error}`);
          }
        }
      }, 15000); // 15 seconds
      
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: 'Oda oluşturulurken bir hata oluştu!',
        ephemeral: true
      });
    }
  },
};