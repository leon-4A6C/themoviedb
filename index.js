const EasyApi = require("easy-api-wrapper");

// creates an Tmdb class
class Tmdb extends EasyApi {
  constructor(apiKey) {
    super({apiKey: apiKey, baseUrl: "api.themoviedb.org", basePath: "/3", endPoints: require("./endPoints.json")});
  }
}

module.exports = Tmdb;
