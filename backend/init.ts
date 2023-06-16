import { load } from 'https://deno.land/std@0.180.0/dotenv/mod.ts';
import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER } = await load();
const client = new MongoClient();
await client.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/music?authMechanism=SCRAM-SHA-1`);
const db = client.database('music');
console.info('🍀 connected to atlas');

const artists = db.collection('artists');
const insertedArtists = await artists.insertMany([
  {
    name: 'Kazi Ploae',
    photoUrl: 'https://images.genius.com/fbc1526fc56c83a71f415f5fd0cd5ff1.496x496x1.jpg',
    activity: {
      start: 2002
    }
  }
]);
console.info('🎤 inserted following artists:', insertedArtists.insertedIds);

const albums = db.collection('albums');
const insertedAlbums = await albums.insertMany([
  {
    name: 'Gorgone',
    photoUrl: 'http://images.genius.com/b21c07553643918ab58bd095b34932b4.600x600x1.jpg',
    artists: ['Kazi Ploae'],
    year: 2007,
    recordLabel: 'Hades Records'
  }
]);
console.info('💿 inserted following albums:', insertedAlbums.insertedIds);

const songs = db.collection('songs');
const insertedSongs = await songs.insertMany([
  {
    name: 'Zenit',
    album: 'Gorgone'
  }
]);
console.info('🎧 inserted following songs:', insertedSongs.insertedIds);
