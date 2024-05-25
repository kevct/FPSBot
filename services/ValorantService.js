const { EmbedBuilder } = require('discord.js');

class ValorantService {
    constructor(valorantApiService) {
        this._valorantApiService = valorantApiService;
    }

    get valorantApiService() {
        return this._valorantApiService;
    }


    getPlayerEmbed(playerName) {
        let player = this.valorantApiService.players.find(p => p.name.toLowerCase().replace(' ', '') == playerName.toLowerCase().replace(' ', ''));
        if (!player) {
            return new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Valorant player not found!')
                .setDescription(`Could not find "${playerName}". Please check your spelling and try again.`);
        }

        return this.valorantApiService.getPlayer(player.id)
            .then(player => {
                console.log(player);

                const getPlayerNameAndNickname = (name, user) => {
                    let result = '';
                    let nameArr = name.split(' ');
                    for (let i = 0; i < nameArr.length; i++) {
                        if (i == nameArr.length - 1) {
                            result += `"${user}" `;
                        }
                        result += `${nameArr[i]} `;
                    }
                    return result.trim();
                }

                return new EmbedBuilder()
                    .setColor(0xBD3944)
                    .setTitle(getPlayerNameAndNickname(player.info.name, player.info.user))
                    .setURL(player.info.url)
                    .setAuthor({ name: 'vlr.gg', iconURL: this.valorantApiService.logoUrl, url: this.valorantApiService.siteUrl })
                    .setThumbnail(player.info.img)
                    .addFields(
                        { name: 'Country', value: `\:flag_${player.info.flag}:`, inline: true },
                        { name: 'Team', value: `${player.team.name} (${player.team.joined})`, inline: true },
                        { name: '** **', value: '** **' },
                        { name: 'Twitter', value: `[${player.socials.twitter}](${player.socials.twitter_url})`, inline: true },
                        { name: 'Twitch', value: `[${player.socials.twitch}](${player.socials.twitch_url})`, inline: true }
                    );
            })
    }
}

module.exports = ValorantService;