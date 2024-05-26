class ValorantApiService {
    constructor(apiLink) {
        this._apiLink = apiLink;
        this._logoUrl = "https://www.vlr.gg/img/vlr/logo_header.png";
        this._siteUrl = "https://www.vlr.gg/";
    }

    get players() {
        return this._players;
    }

    get numPlayers() {
        return this._numPlayers;
    }

    get teams() {
        return this._teams;
    }

    get numTeams() {
        return this._numTeams;
    }

    get logoUrl() {
        return this._logoUrl;
    }

    get siteUrl() {
        return this._siteUrl;
    }

    get apiLink() {
        return this._apiLink;
    }

    init() {
        //Load player info
        fetch(this.apiLink + `/players?limit=all`)
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                // Parse the JSON from the response
                return response.json();
            })
            .then(data => {
                // Process the data
                this._players = data.data;
                this._numPlayers = data.size;
                console.log(`Loaded ${this.numPlayers} Valorant players.`);
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error);
            });

        //Load team info
        fetch(this.apiLink + `/teams?limit=all`)
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                // Parse the JSON from the response
                return response.json();
            })
            .then(data => {
                // Process the data
                this._teams = data.data;
                this._numTeams = data.size;
                console.log(`Loaded ${this.numTeams} Valorant teams.`);
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    getPlayer(id) {
        //Load player info
        return fetch(this._apiLink + `/players/${id}`)
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                // Parse the JSON from the response
                return response.json();
            })
            .then(data => {
                // Process the data
                return data.data
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    getTeam(id) {
        //Load team info
        return fetch(this._apiLink + `/teams/${id}`)
            .then(response => {
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                // Parse the JSON from the response
                return response.json();
            })
            .then(data => {
                // Process the data
                return data.data
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}

module.exports = ValorantApiService;