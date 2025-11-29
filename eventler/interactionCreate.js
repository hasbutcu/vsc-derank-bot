module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Handle chat input command interactions
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true });
        }
      }
    }
    
    // Handle button interactions
    else if (interaction.isButton()) {
      if (interaction.customId === 'toggle_mention_role') {
        const db = require('croxydb');
        const { GuildMember, EmbedBuilder } = require('discord.js');
        
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
            content: 'Etiket rolü bulunamadı! Rol silinmiş olabilir.', 
            ephemeral: true 
          });
        }
        
        const member = interaction.member;
        
        if (member.roles.cache.has(role.id)) {
          // Remove role
          await member.roles.remove(role);
          return interaction.reply({ 
            content: `${role.name} rolü başarıyla kaldırıldı!`, 
            ephemeral: true 
          });
        } else {
          // Add role
          await member.roles.add(role);
          return interaction.reply({ 
            content: `${role.name} rolü başarıyla verildi!`, 
            ephemeral: true 
          });
        }
      }
    }
  },
};