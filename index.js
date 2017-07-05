const https = require('https');

class TMDB {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "api.themoviedb.org";
    this.basePath = "/3";
    this.endPath = "?api_key="+this.apiKey;
    this.__setup();
  }

  // generates all the methods
  __setup() {
    const endPoints = require("./endPoints.json");
    for (var parent in endPoints) {
      this[parent] = {};
      for (var child in endPoints[parent]) {
        this[parent][child] = (options = {}, param = {}) => {
          console.log(this.__pathParam(endPoints[parent][child].path, param));
          return this.__get(endPoints[parent][child].path, options);
        };
      }
    }
  }

  // options can look like this
  // {page: 2}
  __genOptions(options) {
    let res = "";
    for (var opt in options) {
      res += "&"+opt+"="+options[opt];
    }
    return res;
  }
  __parsePathParam(endPointPath, param) {
    const reg = /{([^>]*)}/g; // get the stuff between the {}
    const res = reg.exec(endPointPath);
    console.log(res);
    if (!res) {
      return endPointPath;
    }
    let replaceWith = param[res[1]];
    if (!param || !replaceWith) {
      replaceWith = "";
    }
    endPointPath = endPointPath.replace(reg, replaceWith);
    endPointPath = endPointPath.replace(/\/\/+/g, "/"); // remove double slashes

    return endPointPath;
  }

  __request(path, options, method) {
    return new Promise((resolve, reject) => {
      const httpsOptions = {
        hostname: this.baseUrl,
        port: 443,
        path: this.basePath + path + this.endPath + this.__genOptions(options),
        method: method
      };

      const req = https.request(httpsOptions, (res) => {
        let chunk = "";
        res.on('data', (d) => {
          chunk += d;
        });
        res.on("end", () => {
          resolve(JSON.parse(chunk));
        });
      });

      req.on('error', (e) => {
        reject(e);
      });
      req.end();
    });
  }
  __get(path, options = {}) {
    return this.__request(path, options, "GET");
  }
  __post(path, options = {}) {
    return this.__request(path, options, "POST");
  }
}

const tmdb = new TMDB("81485988d49a76332eea5e3a5297d342");
// tmdb.movie.videos(null, {movie_id: "297762"}).then((data) => {
//   console.log(data);
// }).catch(e => {
//   console.log(e);
// });

console.log(tmdb.__parsePathParam("/movie/{movie_id}/videos/{dinges}", {movie_id: 297762, dinges: "bla"}));

module.exports = TMDB;
