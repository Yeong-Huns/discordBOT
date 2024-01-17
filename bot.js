const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
/*"token" : "MTE5NDE2NTk1NDA0MTYxMDM0Mg.GXYYDt.FVvvhLUY7PAkwn0YRRhIERnxJeB6rM8dyUFknA",*/
// 클라이언트 instance 생성
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
//path.join() : 명령어 디렉토리로의 경로를 구성
const commandFolders = fs.readdirSync(foldersPath);
console.log('폴더패스'+foldersPath)
console.log("커맨드폴더 : " + commandFolders);
//fs.readdirSync() : 해당 디렉토리의 경로를 읽고 현재 ['utility']와 같은 모든 폴더 이름 반환.
for(const folder of commandFolders){
    console.log('폴더'+folder);
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file=>file.endsWith('.js'));
    console.log('커맨드파일: '+commandFiles);
    //fs.readdirSync() : 다시 사용하여 ['ping.js', 'server.js', 'user.js']와 같은 파일 이름 배열 반환.
    //filter 를 사용하여 .js 로 끝나지 않는 파일명을 배열에서 삭제.
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        //console.log(command)
        //컬렉션에 새 항목 설정, 키는 명령어 이름, 값은 내보낸 모듈
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }else{
            console.log(`[오류] ${filePath}에 존재하는 명령어는 data값이나 execute값이 필요합니다!`);
        }
        //불러오는 commandFile이 data값이나 execute 속성이 있는지 확인한다.
        //이는 빈 파일, 미완성된 파일, 또는 잘못된 명령어로 인한 오류파일을 불러와서 발생하는 오류를 방지하는데 
        //도움이된다.
    }
}
console.log(client.commands.get('test'))
//console.log(client.commands);
///
// client가 준비되면 이 코드를 한번(once)실행
// 타입스크립트 개발자에게 `client: Client<boolean>` 와 `readyClient: Client<true>` 차이는 중요하다.
// 일부 속성값을 null이 아니게 만들기 때문
client.once(Events.ClientReady, readyClient => {
	console.log(`준비완료! ${readyClient.user.tag} 로그인!`);
});
// "/"상호작용이 일어날때 콘솔로 알려주는 이벤트 리스너.
 
client.on(Events.InteractionCreate, async interaction => {
	//console.log(interaction)
    console.log(interaction.commandName);
    if (!interaction.isChatInputCommand()) return;
	
    const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);