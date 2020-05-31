const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const req = require("request");
const prefix = config.prefix;
var cron = require("cron");

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Updating COVID-19 Statistics`,{type:`WATCHING`}, (`ONLINE`));
  function getToday(){
    let today = new Date();
    let months = [`January`,`February`,`March`,`April`,`May`,`June`,`July`,`August`,`September`,`October`,`November`,`December`];
    let suffix = [`st`,`nd`,`rd`];
    return `Date: ${months[today.getMonth()]} ${today.getDate()}${suffix[today.getDate()] || `th`}`;
  }
  console.log(getToday());
});

client.on('message', async message => {
  let messageArray = message.content.split(/\s+/g);
  let args = messageArray.slice(1);

	msg = message.content.toLowerCase();

	if (msg.startsWith(prefix + "stats")) {
		if (message.author.bot) return;
		if (!args[0]) return whatc();
        if (args[0] == "world" || args[0] == "global" || args[0] == "worldwide") {
          const url = `https://corona.lmao.ninja/v2/all`;
          req(url, function(err, response, body) {
          if(err) return msg.reply("err");
          body = JSON.parse(body);
          const embed = new Discord.MessageEmbed()
          .setColor('#f0fc03')
          .setTitle(`Coronavirus Statistics - Worldwide`)
          .addField(`Total Cases: `,`**${body.cases}**`, true)
          .addField(`Today Cases: `,`**${body.todayCases}**`, true)
          .addField(`Total Deaths: `,`**${body.deaths}**`, true)
          .addField(`Today Deaths: `, `**${body.todayDeaths}**`, true)
          .addField(`Recovered: `,`**${body.recovered}**`, true)
          .addField(`Active: `,`**${body.active}**`, true)
          .addField(`Critical: `,`**${body.critical}**`, true)
          .addField(`Cases/Million: `,`**${body.casesPerOneMillion}**`, true)
          .addField(`Deaths/Million: `,`**${body.deathsPerOneMillion}**`, true)
          .setFooter(`COVID-19 Statistics by TheLT#7876`, 'https://cdn.discordapp.com/avatars/716596680979382285/7782dc40a15d03f9aceb99711c4a2a75.png');
          message.channel.send(embed);
        },);
        } else {
          const url = `https://corona.lmao.ninja/v2/countries/${args[0]}`;
          req(url, function(err, response, body) {
          if(err) return msg.reply("err");
          body = JSON.parse(body);
          if (body.message == "Country not found or doesn't have any cases") return notfound();
          const embed = new Discord.MessageEmbed()
          .setColor('#f0fc03')
          .setTitle(`Coronavirus Statistics - ${body.country}`)
          .addField(`Total Cases: `,`**${body.cases}**`, true)
          .addField(`Today Cases: `,`**${body.todayCases}**`, true)
          .addField(`Total Deaths: `,`**${body.deaths}**`, true)
          .addField(`Today Deaths: `, `**${body.todayDeaths}**`, true)
          .addField(`Recovered: `,`**${body.recovered}**`, true)
          .addField(`Active: `,`**${body.active}**`, true)
          .addField(`Critical: `,`**${body.critical}**`, true)
          .addField(`Cases/Million: `,`**${body.casesPerOneMillion}**`, true)
          .addField(`Deaths/Million: `,`**${body.deathsPerOneMillion}**`, true)
          .setFooter(`COVID-19 Statistics by TheLT#7876`, 'https://cdn.discordapp.com/avatars/716596680979382285/7782dc40a15d03f9aceb99711c4a2a75.png');
          message.channel.send(embed);
        },);
        }

        function whatc() {
            const embed = new Discord.MessageEmbed()
            .setColor('#f0fc03')
            .setDescription('Please enter a **country** name to check its statistics!')
            .setFooter(`COVID-19 Statistics by TheLT#7876`, 'https://cdn.discordapp.com/avatars/716596680979382285/7782dc40a15d03f9aceb99711c4a2a75.png');
            message.channel.send(embed);
        }

        function notfound() {
            const embed = new Discord.MessageEmbed()
            .setColor('#f0fc03')
            .setDescription('Country not found! Check your typing again!')
            .setFooter(`COVID-19 Statistics by TheLT#7876`, 'https://cdn.discordapp.com/avatars/716596680979382285/7782dc40a15d03f9aceb99711c4a2a75.png');
            message.channel.send(embed);
        }
	}
});

let scheduledMessage = new cron.CronJob('10 30 18 * * *', () => {
  let channel = client.channels.cache.get('692030990129823845');
  const url = `https://corona.lmao.ninja/v2/countries/vietnam`;
  req(url, function(err, response, body) {
    if(err) return msg.reply("err");
    body = JSON.parse(body);
    const url2 = `https://corona.lmao.ninja/v2/all`;
    req(url2, function(err, response, body2) {
      if(err) return msg.reply("err");
      body2 = JSON.parse(body2);
      const cembed = new Discord.MessageEmbed()
      .setColor('')
      .setTitle('Coronavirus Statistics Vietnam/Global')
      .addFields(
          { name: 'Số ca nhiễm/Cases:', value: `**${body.cases}**/**${body2.cases}**`},
          { name: 'Đang điều trị/Active:', value: `**${body.active}**/**${body2.active}**`},
          { name: 'Khỏi/Recovered:', value: `**${body.recovered}**/**${body2.recovered}**`},
          { name: 'Tử vong/Deaths:', value: `**${body.deaths}**/**${body2.deaths}**`},
      )
      .setFooter(`COVID-19 Statistics by TheLT#7876`, 'https://cdn.discordapp.com/avatars/716596680979382285/7782dc40a15d03f9aceb99711c4a2a75.png');
      channel.send(cembed);
  },);
  },);

});

// When you want to start it, use:
scheduledMessage.start()

client.login(config.token);
