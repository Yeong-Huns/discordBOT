let {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('입장한 유저 정보를 제공합니다.'),
    async execute(interaction){
        await interaction.reply(`${interaction.user.username}님의 요청 : ${interaction.member.joinedAt}.`);
    }
};