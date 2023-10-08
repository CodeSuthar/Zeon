const { ActivityType } = require("discord.js");
const isPortReachable = require("is-port-reachable");

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
        let statuses = [ `With Version ${require(`${process.cwd()}/package.json`).version}`, `With 94 Commands`, `In ${scount} Guilds!`, `With ${mcount} Users!`, 'In Beta'];
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

        const { GetChoicesCommand } = require("../../Handler/Bot-Function-Extended/Utils.js")

        client.helpArray = GetChoicesCommand();
    }
}