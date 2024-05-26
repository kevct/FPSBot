const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('team')
		.setDescription('Displays team information')
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
				.setRequired(true)
				.setDescription('The name of the team you wish to view')),
	async execute(interaction) {
		const game = interaction.options.getString('game');
		const teamName = interaction.options.getString('teamname');

		switch (game) {
			case 'valorant':
				let valService = module.parent.valorantService;
				let embed = await valService.getTeamEmbed(teamName);
				await interaction.reply({ embeds: [embed] });
				break;
			default:
				interaction.reply("That game hasn't been implemented yet!")
				break;
		}
	},
};