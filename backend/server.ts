import { Application, Router } from 'https://deno.land/x/oak@v12.1.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import { Artists, Albums, Songs } from './db.ts';

class Parser {
  static getPathParam(context, name) {
    return context.params[name].replaceAll('+', ' ');
  }
  static getQueryParam(context, name) {
    return context.request.url.searchParams.get(name)?.replaceAll('+', ' ');
  }
  static async getBody(context) {
    return await context.request.body({ type: 'json' }).value;
  }
}

const router = new Router();

router.get('/rest/artists', async context => {
  context.response.body = await Artists.findAll();
});

router.get('/rest/artists/:artistName', async context => {
  const artistName = Parser.getPathParam(context, 'artistName');
  if (await Artists.include(artistName)) {
    context.response.body = await Artists.findByName(artistName);
  } else {
    context.response.status = 404;
    context.response.body = 'artist not found';
  }
});

router.get('/rest/artists/:artistName/albums', async context => {
  const artistName = Parser.getPathParam(context, 'artistName');
  if (await Artists.include(artistName)) {
    context.response.body = await Albums.findByArtist(artistName);
  } else {
    context.response.status = 404;
    context.response.body = 'artist not found';
  }
});

router.get('/rest/artists/:artistName/songs', async context => {
  const artistName = Parser.getPathParam(context, 'artistName');
  if (await Artists.include(artistName)) {
    context.response.body = await Songs.findByArtist(artistName);
  } else {
    context.response.status = 404;
    context.response.body = 'artist not found';
  }
});

router.post('/rest/artists', async context => {
  const artist = await Parser.getBody(context);
  if (await Artists.include(artist.name)) {
    context.response.status = 409;
    context.response.body = 'artist already exists';
  } else if (!await Artists.validateMembersOf(artist)) {
    context.response.status = 409;
    context.response.body = 'member does not exist';
  } else {
    await Artists.create(artist);
    context.response.status = 201;
    context.response.body = 'artist created';
  }
});

router.put('/rest/artists', async context => {
  const artist = await Parser.getBody(context);
  if (!await Artists.validateMembersOf(artist)) {
    context.response.status = 409;
    context.response.body = 'member does not exist';
  } else {
    await Artists.update(artist);
    context.response.status = 200;
    context.response.body = 'artist updated';
  }
});

router.delete('/rest/artists/:artistName', async context => {
  const artistName = Parser.getPathParam(context, 'artistName');
  if (await Artists.include(artistName)) {
    await Artists.deleteByName(artistName);
    context.response.status = 200;
    context.response.body = 'artist deleted';
  } else {
    context.response.status = 404;
    context.response.body = 'artist not found';
  }
});

router.get('/rest/albums', async context => {
  const year = Parser.getQueryParam(context, 'year');
  const recordLabel = Parser.getQueryParam(context, 'recordLabel');
  context.response.body = await Albums.findBy(year, recordLabel);
});

router.get('/rest/albums/:albumName', async context => {
  const albumName = Parser.getPathParam(context, 'albumName');
  if (await Albums.include(albumName)) {
    context.response.body = await Albums.findByName(albumName);
  } else {
    context.response.status = 404;
    context.response.body = 'album not found';
  }
});

router.get('/rest/albums/:albumName/songs', async context => {
  const albumName = Parser.getPathParam(context, 'albumName');
  if (await Albums.include(albumName)) {
    context.response.body = await Songs.findByAlbum(albumName);
  } else {
    context.response.status = 404;
    context.response.body = 'album not found';
  }
});

router.post('/rest/albums', async context => {
  const album = await Parser.getBody(context);
  if (await Albums.include(album.name)) {
    context.response.status = 409;
    context.response.body = 'album already exists';
  } else if (!await Albums.validateArtistsOf(album)) {
    context.response.status = 409;
    context.response.body = 'artist does not exist';
  } else {
    await Albums.create(album);
    context.response.status = 201;
    context.response.body = 'album created';
  }
});

router.put('/rest/albums', async context => {
  const album = await Parser.getBody(context);
  if (!await Albums.validateArtistsOf(album)) {
    context.response.status = 409;
    context.response.body = 'artist does not exist';
  } else {
    await Albums.update(album);
    context.response.status = 200;
    context.response.body = 'album updated';
  }
});

router.delete('/rest/albums/:albumName', async context => {
  const albumName = Parser.getPathParam(context, 'albumName');
  if (await Albums.include(albumName)) {
    await Albums.deleteByName(albumName);
    await Songs.deleteByAlbum(albumName);
    context.response.status = 200;
    context.response.body = 'album deleted';
  } else {
    context.response.status = 404;
    context.response.body = 'album not found';
  }
});

router.get('/rest/songs', async context => {
  context.response.body = await Songs.findAll();
});

router.get('/rest/songs/:songName', async context => {
  const songName = Parser.getPathParam(context, 'songName');
  if (await Songs.include(songName)) {
    context.response.body = await Songs.findByName(songName);
  } else {
    context.response.status = 404;
    context.response.body = 'song not found';
  }
});

router.post('/rest/songs', async context => {
  const song = await Parser.getBody(context);
  if (await Songs.include(song.name)) {
    context.response.status = 409;
    context.response.body = 'song already exists';
  } else if (!await Albums.include(song.album)) {
    context.response.status = 409;
    context.response.body = 'album does not exist';
  } else if (!await Songs.validateFeaturedArtistsOf(song)) {
    context.response.status = 409;
    context.response.body = 'artist does not exist';
  } else {
    await Songs.create(song);
    context.response.status = 201;
    context.response.body = 'song created';
  }
});

router.put('/rest/songs', async context => {
  const song = await Parser.getBody(context);
  if (!await Songs.include(song.name)) {
    context.response.status = 409;
    context.response.body = 'album does not exist';
  } else if (!await Songs.validateFeaturedArtistsOf(song)) {
    context.response.status = 409;
    context.response.body = 'artist does not exist';
  } else {
    await Songs.update(song);
    context.response.status = 200;
    context.response.body = 'song updated';
  }
});

router.delete('/rest/songs/:songName', async context => {
  const songName = Parser.getPathParam(context, 'songName');
  if (await Songs.include(songName)) {
    await Songs.deleteByName(songName);
    context.response.status = 200;
    context.response.body = 'song deleted';
  } else {
    context.response.status = 404;
    context.response.body = 'song not found';
  }
});

async function search(keywords) {
  const count = (string, pattern) => (string.toLowerCase().match(new RegExp(pattern, 'g')) || []).length;
  const withoutScore = object => { delete object.score; return object; };

  let artists = await Artists.findAll();
  for (const artist of artists) {
    artist.score = 0;
    for (const keyword of keywords) {
      artist.score += count(artist.name, keyword);
      for (const member of artist.members || []) {
        artist.score += count(member, keyword);
      }
    }
  }
  artists.sort((artist1, artist2) => artist1.score - artist2.score);
  artists = artists.filter(artist => artist.score > 0).slice(0, 10).map(artist => withoutScore(artist));

  let albums = await Albums.findAll();
  for (const album of albums) {
    album.score = 0;
    for (const keyword of keywords) {
      album.score += count(album.name, keyword);
      for (const artist of album.artists) {
        album.score += count(artist, keyword);
      }
      if (album.recordLabel != null) {
        album.score += count(album.recordLabel, keyword);
      }
    }
  }
  albums.sort((album1, album2) => album1.score - album2.score);
  albums = albums.filter(album => album.score > 0).slice(0, 10).map(album => withoutScore(album));

  let songs = await Songs.findAll();
  for (const song of songs) {
    song.score = 0;
    for (const keyword of keywords) {
      song.score += count(song.name, keyword);
      song.score += count(song.album, keyword);
      for (const featuredArtist of song.featuredArtists || []) {
        song.score += count(featuredArtist, keyword);
      }
    }
  }
  songs.sort((song1, song2) => song1.score - song2.score);
  songs = songs.filter(song => song.score > 0).slice(0, 10).map(song => withoutScore(song));
  return { artists, albums, songs };
}

router.put('/search', async context => {
  const keywords = await Parser.getBody(context);
  context.response.status = 200;
  context.response.body = await search(keywords);
});

router.put('/feed', async context => {
  const songNames = await Parser.getBody(context);
  const keywords = [];
  for (const songName of songNames) {
    const song = await Songs.findByName(songName);
    keywords.push(song.name);
    keywords.push(song.album);
    const album = await Albums.findByName(song.album);
    for (const artist of album.artists) {
      keywords.push(artist);
    }
  }
  context.response.status = 200;
  context.response.body = (await search(keywords.map(keyword => keyword.toLowerCase()))).songs.slice(0, 5);
});

const app = new Application();
app.use(oakCors({ origin: 'http://localhost:3000' }));
app.use(router.routes());
app.use(router.allowedMethods());
console.info('📡 started server at http://localhost:8000/');
await app.listen({ port: 8000 });
