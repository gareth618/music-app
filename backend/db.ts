import { load } from 'https://deno.land/std@0.180.0/dotenv/mod.ts';
import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER } = await load();
const client = new MongoClient();
await client.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/music?authMechanism=SCRAM-SHA-1`);
const music = client.database('music');
console.info('🍀 connected to atlas');

class DataBase {
  static #withoutId(object) {
    delete object._id;
    return object;
  }
  static async makeArray(result) {
    const array = await result.toArray();
    return array.map(object => this.#withoutId(object));
  }
  static async makeObject(result) {
    const object = await result;
    if (object == null) return null;
    return this.#withoutId(object);
  }
}

class Collection {
  static async include(objectName) {
    return await this.repository.findOne({ name: objectName }) != null;
  }
  static async findAll() {
    return await DataBase.makeArray(this.repository.find().sort({ 'name': 1 }));
  }
  static async findByName(objectName) {
    return await DataBase.makeObject(this.repository.findOne({ name: objectName }));
  }
  static async create(object) {
    return await this.repository.insertOne(object);
  }
  static async update(object) {
    return await this.repository.replaceOne({ name: object.name }, object);
  }
  static async deleteByName(objectName) {
    await this.repository.deleteOne({ name: objectName });
  }
}

class Artists extends Collection {
  static repository = music.collection('artists');
  static async deleteByName(artistName) {
    await super.deleteByName(artistName);
    await Albums.deleteByArtist(artistName);
    await Songs.deleteByArtist(artistName);
    await Artists.deleteByMember(artistName);
  }
  static async deleteByMember(artistName) {
    const artistBands = (await DataBase.makeArray(this.repository.find({ members: { $all: [artistName] } }))).map(({ name }) => name);
    await Promise.all(artistBands.map(band => Artists.deleteByName(band)));
  }
  static async validateMembersOf(artist) {
    for (const member of artist?.members || []) {
      if (!await Artists.include(member)) return false;
    }
    return true;
  }
}

class Albums extends Collection {
  static repository = music.collection('albums');
  static async findBy(year, recordLabel) {
    const conjunction = [];
    if (year != null) conjunction.push({ year: parseInt(year) });
    if (recordLabel != null) conjunction.push({ recordLabel });
    if (conjunction.length === 0) return await Albums.findAll();
    return await DataBase.makeArray(this.repository.find({ $and: conjunction }));
  }
  static async findByArtist(artistName) {
    return await DataBase.makeArray(this.repository.find({ artists: { $all: [artistName] } }));
  }
  static async findNamesByArtist(artistName) {
    return (await Albums.findByArtist(artistName)).map(({ name }) => name);
  }
  static async deleteByArtist(artistName) {
    await this.repository.delete({ artists: { $all: [artistName] } });
  }
  static async validateArtistsOf(album) {
    for (const artist of album.artists) {
      if (!await Artists.include(artist)) return false;
    }
    return true;
  }
}

class Songs extends Collection {
  static repository = music.collection('songs');
  static async findByArtist(artistName) {
    const artistAlbums = await Albums.findNamesByArtist(artistName);
    return await DataBase.makeArray(this.repository.find({ album: { $in: artistAlbums } }));
  }
  static async findByAlbum(albumName) {
    return await DataBase.makeArray(this.repository.find({ album: albumName }));
  }
  static async deleteByArtist(artistName) {
    const artistAlbums = await Albums.findNamesByArtist(artistName);
    await this.repository.delete({ album: { $in: artistAlbums } });
    await this.repository.delete({ featuredArtists: { $all: [artistName] } });
  }
  static async deleteByAlbum(albumName) {
    await this.repository.delete({ album: albumName });
  }
  static async validateFeaturedArtistsOf(song) {
    for (const artist of song?.featuredArtists || []) {
      if (!await Artists.include(artist)) return false;
    }
    return true;
  }
}

export { Artists, Albums, Songs };
