let {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('서버 정보를 제공합니다.'),
    async execute(interaction){
        //interaction.guild 오브젝트는 커맨드가 실행된 Guild에 대한 정보를 제공한다.
        await interaction.reply(`서버이름: ${interaction.guild.name}, 멤버 수: ${interaction.guild.memberCount}`);
    }
};