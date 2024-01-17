let {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('테스트메세지를 출력해요.'),
    async execute(interaction){
        await interaction.reply('봇 테스트입니다. 안녕하세요?');
    }
};