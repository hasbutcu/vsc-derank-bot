const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bildir')
    .setDescription('Belirtilen kullanıcıyı bildirir')
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Bildirilecek kullanıcı')
        .setRequired(true)),
    
  async execute(interaction) {
    const user = interaction.options.getUser('kullanici');
    const logChannelId = db.get(`log_channel_${interaction.guild.id}`);
    
    if (!logChannelId) {
      return interaction.reply({
        content: 'Log kanalı henüz ayarlanmamış! Önce `/bildir-log` komutunu kullanın.',
        ephemeral: true
      });
    }
    
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    
    if (!logChannel) {
      return interaction.reply({
        content: 'Log kanalı bulunamadı! Kanal silinmiş olabilir.',
        ephemeral: true
      });
    }
    
    // Send log message
    await logChannel.send({
      content: `🔔 **Bildirim**\n${interaction.user} tarafından ${user} bildirildi.\nKanal: ${interaction.channel}`
    });
    
    await interaction.reply({
      content: `${user} başarıyla bildirildi!`,
      ephemeral: true
    });
  },
};