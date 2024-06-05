const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const buttonPagination = require('../../utils/buttonPagination');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upcomingmatches')
		.setDescription('Displays upcoming match information')
		.addStringOption(option =>
			option.setName('game')
				.setDescription('The game you wish to view')
				.setRequired(true)
				.addChoices(
					{ name: 'Valorant', value: 'valorant' },
					{ name: 'Counter-Strike 2', value: 'cs2' },
					{ name: 'Overwatch', value: 'overwatch' },
				))
		.addStringOption(option =>
			option.setName('teamname')
				.setDescription('The name of the team you wish to view, or leave blank for all matches')),
	async execute(interaction) {
		const game = interaction.options.getString('game');
		const teamName = interaction.options.getString('teamname');

		switch (game) {
			case 'valorant':
				let valService = module.parent.valorantService;
				let embedList = valService.getUpcomingMatchesEmbed(teamName);
				await buttonPagination(interaction, embedList);	
				break;
			default:
				interaction.reply("That game hasn't been implemented yet!")
				break;
		}
	},
};