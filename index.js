const https = require('https');

class TheMovieDatabase {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "api.themoviedb.org";
    this.basePath = "/3";
    this.endPath = "?api_key="+this.apiKey;
    this.endPoints = require("./endPoints.json");
    this._setup();
  }

  _setup() {
    // function to recursively add functions to the endPoints
    const map = (part) => {
      let res = {};
      for (let parent in part) {
        if (!part[parent].path) {
          res[parent] = map(part[parent]);
        } else {
          res[parent] = (options = {}, param = {}) => {
            return this._request(part[parent].path, options, param, part[parent].method);
          }
        }
      }
      return res;
    }

    const maped = map(this.endPoints);

    for (var part in maped) {
      this[part] = maped[part]; // add the functions to this
    }

  }

  // options can look like this
  // {page: 2}
  _genOptions(options) {
    let res = "";
    for (var opt in options) {
      res += "&"+opt+"="+options[opt];
    }
    return res;
  }

  _parsePathParam(path, param) {
    const reg = /{(.*?)}/g; // get the stuff between the {}
    const arr = path.match(reg) || []; // array with the results of the regexp
    for (var i = 0; i < arr.length; i++) {
      let par = param[arr[i].substr(1, arr[i].length-2)];
      if (par) {
        path = path.replace(arr[i], par);
      } else {
        path = path.replace(arr[i], "");
      }
    }

    path = path.replace(/\/\/+/g, "/"); // remove double slashes
    return path;
  }

  _request(path, options, param, method) {
    return new Promise((resolve, reject) => {

      const httpsOptions = {
        hostname: this.baseUrl,
        port: 443,
        path: this.basePath + this._parsePathParam(path, param) + this.endPath + this._genOptions(options),
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
}

module.exports = TMDB;
