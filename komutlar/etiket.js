const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('etiket')
    .setDescription('Etiket rolü almak/kaldırmak için bir buton oluşturur')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        content: 'Bu komutu kullanmak için `Kanalları Yönet` iznine sahip olmalısınız!',
        ephemeral: true
      });
    }
    const mentionRoleId = db.get(`mention_role_${interaction.guild.id}`);
    
    if (!mentionRoleId) {
      return interaction.reply({
        content: 'Etiket rolü henüz ayarlanmamış! Önce `/etiket-rol` komutunu kullanın.',
        ephemeral: true
      });
    }
    
    const role = interaction.guild.roles.cache.get(mentionRoleId);
    
    if (!role) {
      return interaction.reply({
        content: 'Ayarlanan etiket rolü bulunamadı! Rol silinmiş olabilir.',
        ephemeral: true
      });
    }
    
    // Create embed
    const embed = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle('Etiket Rolü')
      .setDescription(`Valorant oda bildirimleri almak için aşağıdaki butona tıklayarak ${role} rolünü alabilir veya kaldırabilirsiniz.`)
      .setFooter({ text: 'Butona tıklayarak rolü alabilir veya kaldırabilirsiniz.' })
      .setTimestamp();
    
    // Create button
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('toggle_mention_role')
          .setLabel(`${role.name} Rolünü Al/Kaldır`)
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🔔')
      );
    
    // Confirm to user with ephemeral message
    await interaction.reply({
      content: 'Tamamdır!',
      ephemeral: true
    });
    
    // Send the embed with button
    await interaction.channel.send({
      embeds: [embed],
      components: [row]
    });
  },
};