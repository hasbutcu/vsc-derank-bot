const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oda-log')
    .setDescription('Oda loglarının gönderileceği kanalı ayarlar')
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
    db.set(`room_log_${interaction.guild.id}`, channel.id);
    
    await interaction.reply({
      content: `Oda log kanalı başarıyla ${channel} olarak ayarlandı!`,
      ephemeral: true
    });
  },
};