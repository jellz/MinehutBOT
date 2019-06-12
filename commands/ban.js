const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: You must mention who you want to ban.');
        let user;
        if (msg.mentions.users.size > 0) {
            user = msg.mentions.users.first();
        } else user = client.users.get(args[0]);
        if (!user) return msg.channel.send(':x: Invalid user!');
        const member = (await msg.guild.fetchMembers()).memebrs.get(user.id);
        if (client.checkPerms(msg, member) == false) return msg.channel.send(':x: Cannot punish this user as they are a staff!');
        const reason = args.slice(1).join(' ');
        if (!reason) return msg.channel.send(`:x: You must give a reason for why you want to ban ${user.tag}.`);
        const numData = await client.db.table('numData').get('punishments').run();
        const id = numData.number;
        const datepunished = new Date();
        const num2insert = numData.number+1;
        client.db.table('punishments').insert({ id: id, punished: { name: user.tag, id: user.id }, moderator: { name: msg.author.tag, id: msg.author.id }, reason: reason, type: 'BAN', date: datepunished, active: true }).run();
        client.db.table('numData').get('punishments').update({ number: num2insert }).run();
        const embed = new Discord.RichEmbed()
        .setDescription('You have been permanently banned from Minehut!')
        .addField('ID', id, true)
        .addField('Moderator', msg.author.tag, true)
        .addField('Reason', reason, true)
        .setColor('#FF0000')
        .setFooter(`Punished: ${datepunished}`);
        user.send(embed).then(() => {
            msg.guild.ban(user.id, { reason: reason });
            msg.channel.send(`:ok_hand: banned ${user.tag} (\`${reason}\`)`);  
        });      
    },
    meta: {
        aliases: ['ban'],
        description: 'Bans a user for a specified reason',
        permlvl: 2,
        usage: ''              
    }
}