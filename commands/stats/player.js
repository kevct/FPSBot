const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player')
		.setDescription('Displays player statistics')
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
			option.setName('playername')
				.setRequired(true)
				.setDescription('The name of the player you wish to view')),
	async execute(interaction) {
		const game = interaction.options.getString('game');
		const playerName = interaction.options.getString('playername');

		switch (game) {
			case 'valorant':
				let valService = module.parent.valorantService;
				let embed = await valService.getPlayerEmbed(playerName);
				await interaction.reply({ embeds: [embed] });
				break;
			default:
				interaction.reply("That game doesn't hasn't been implemented yet!")
				break;
		}
	},
};