# themoviedb
an api wrapper for the movie database

## installation
```bash
$ npm install themoviedatabase --save
```

## example
```javascript
const TheMovieDatabase = require("themoviedatabase");
const tmdb = new TheMovieDatabase("your api key");

Promise.all([
  tmdb.jobs(),
  tmdb.movies.videos(null, {movie_id: 297762})
]).then(stuff => {
  console.log(stuff);
});

tmdb.search.movies({query: "batman", year: 2007}).then(movies => {
  console.log(movies);
});
```

## notes

* It only has the "GET" methods for now.
