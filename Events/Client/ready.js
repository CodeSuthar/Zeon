const { useMainPlayer } = require("discord-player");
const { ActivityType } = require("discord.js");
const isPortReachable = require("is-port-reachable");
const { GetChoicesCommand } = require("../../Utils/Utils.js")

module.exports = {
    name: "ready",
    run: async (client) => {
        console.log(`[ CLIENT ] ${client.user.username} is logged in and ready to listen your commands`);

        let scount = client.guilds.cache.size;
        let mcount = 0; 
        client.guilds.cache.forEach((guild) => {
            mcount += guild.memberCount;
        });

        //Game
        let statuses = [ `With Version ${require(`${process.cwd()}/package.json`).version}`, `With 106 Commands`, `In ${scount} Guilds!`, `With ${mcount} Users!`, 'In Beta'];
        setInterval(function() {
  		    let status = statuses[Math.floor(Math.random()*statuses.length)];
  		    client.user.setActivity(status, { type: ActivityType.Playing });
  	    }, 10000)
        
        //Dashboard
        if (client.config.Dashboard.ShouldRun) {
            if (await isPortReachable(client.config.Dashboard.Port, { host: client.config.Dashboard.ReverseProxy }) === false) {
                require("../../Dashboard/dashboard.js")(client);
            }
        }

        //Loading The Music Extractors
        let Player = await useMainPlayer();
        await Player.extractors.loadDefault();


        client.helpArray = GetChoicesCommand();
    }
}