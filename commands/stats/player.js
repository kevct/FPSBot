const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player')
		.setDescription('Displays player statistics'),
	async execute(interaction) {
		let valService = module.parent.valorantApiService;
		valService.getPlayer(9)
		.then(async player => {
			console.log(player);

			const getPlayerNameAndNickname = (name, user) => {
				let result = '';
				let nameArr = name.split(' ');
				for (i = 0; i < nameArr.length; i++) {
					if (i == nameArr.length - 1) {
						result += `"${user}" `;
					}
					result += `${nameArr[i]} ` ;
				}
				return result.trim();
			}
	
			const embed = new EmbedBuilder()
				.setColor(0xBD3944)
				.setTitle(getPlayerNameAndNickname(player.info.name, player.info.user))
				.setURL(player.info.url)
				.setAuthor({ name: 'vlr.gg', iconURL: valService.logoUrl, url: valService.siteUrl })
				.setDescription('Some description here')
				.setThumbnail(player.info.img)
				.addFields(
					{ name: 'Regular field title', value: 'Some value here' },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Inline field title', value: 'Some value here', inline: true },
					{ name: 'Inline field title', value: 'Some value here', inline: true },
				)
				.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	
			await interaction.reply({ embeds: [embed] });
		});
	},
};