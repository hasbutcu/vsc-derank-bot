const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bildir-log')
    .setDescription('Bildirim loglarının gönderileceği kanalı ayarlar')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Log kanalı')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için `Kanalları Yönet` iznine sahip olmalısınız!',
        ephemeral: true
      });
    }
    const channel = interaction.options.getChannel('kanal');
    
    // Save channel to database
    db.set(`log_channel_${interaction.guild.id}`, channel.id);
    
    await interaction.reply({
      content: `Log kanalı başarıyla ${channel} olarak ayarlandı!`,
      ephemeral: true
    });
  },
};