const fs = require('node:fs');
const path = require('node:path');
const{REST, Routes} = require('discord.js');
const{clientId, guildId, token} = require('./config.json');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log("커맨드폴더 : "+commandFolders) //유틸리티
for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file=>file.endsWith('.js'));
    console.log("커맨드패스 : " + commandsPath)
    console.log("커맨드파일s : " + commandFiles)
    
    
    commandFiles.map(file => {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
    
        console.log("deploy-commands file command name : ", command?.data?.name);
        commands.push(command.data.toJSON());
    });
}


const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(data => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);
