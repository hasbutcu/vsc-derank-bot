const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('etiket-rol')
    .setDescription('Oda oluşturulduğunda etiketlenecek rolü ayarlar')
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Etiketlenecek rol')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için `Kanalları Yönet` iznine sahip olmalısınız!',
        ephemeral: true
      });
    }
    const role = interaction.options.getRole('rol');
    
    // Save role to database
    db.set(`mention_role_${interaction.guild.id}`, role.id);
    
    await interaction.reply({
      content: `Etiket rolü başarıyla ${role} olarak ayarlandı!`,
      ephemeral: true
    });
  },
};