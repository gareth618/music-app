<script>
export default {
  data() {
    return {
      searchInput: '',
      artists: [],
      albums: [],
      songs: [],
      selectedSongs: [],
      recommendedSongs: [],
      interval: ''
    };
  },
  computed: {
    keywords() {
      return this.searchInput.toLowerCase().replace(/, */g, ',').split(',').filter(keyword => keyword !== '');
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.selectedSongs = JSON.parse(localStorage.getItem('selected') || []);
    }, 1000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    async search() {
      const response = await fetch('http://localhost:8000/search', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.keywords)
      });
      const results = await response.json();
      this.artists = results.artists;
      this.albums = results.albums;
      this.songs = results.songs;
    },
    async feed() {
      const response = await fetch('http://localhost:8000/feed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.selectedSongs)
      });
      this.recommendedSongs = await response.json();
    },
    unselectSong(oldSong) {
      let newSelectedSongs = [...this.selectedSongs];
      newSelectedSongs = newSelectedSongs.filter(song => song !== oldSong);
      localStorage.setItem('selected', JSON.stringify(newSelectedSongs));
    }
  }
};
</script>

<template>
  <Head>
    <Title>music wizard</Title>
  </Head>
  <h1 class="admin-title">music wizard ✨</h1>
  <ul class="home-list">
    <li><Icon class="fa-fw" :icon="['fas', 'eye']" /> search for music</li>
    <li><Icon class="fa-fw" :icon="['fas', 'cart-shopping']" /> select at least 3 songs</li>
    <li><Icon class="fa-fw" :icon="['fas', 'star']" /> get 5 song recommendations</li>
  </ul>
  <section class="admin-section">
    <h2>find music</h2>
    <form class="crud-form search-form" @submit.prevent>
      <input v-model.trim="searchInput" placeholder="keywords…" />
      <button @click="search" :title="keywords.length === 0 ? 'no keywords provided' : ''" :disabled="keywords.length === 0">
        search
        <Icon :icon="['fas', 'magnifying-glass']" />
      </button>
    </form>
  </section>
  <section class="home-section" v-if="artists.length > 0">
    <h2><Icon class="fa-fw" :icon="['fas', 'microphone-lines']" /> artists</h2>
    <Artist v-for="artist of artists" :key="artist.name" :data="artist" :selectedSongs="selectedSongs" />
  </section>
  <section class="home-section" v-if="albums.length > 0">
    <h2><Icon class="fa-fw" :icon="['fas', 'compact-disc']" /> albums</h2>
    <Album v-for="album of albums" :key="album.name" :data="album" :selectedSongs="selectedSongs" />
  </section>
  <section class="home-section" v-if="songs.length > 0">
    <h2><Icon class="fa-fw" :icon="['fas', 'music']" /> songs</h2>
    <Song v-for="song of songs" :key="song.name" :data="song" :selectedSongs="selectedSongs" />
  </section>
  <section class="admin-section">
    <h2>selected songs</h2>
    <form class="crud-form feed-form" @submit.prevent>
      <section class="list">
        <div v-for="song of selectedSongs" :key="song">
          <input :value="song" disabled />
          <button class="admin-delete" @click="unselectSong(song)">remove <Icon :icon="['fas', 'circle-xmark']" /></button>
        </div>
      </section>
      <button @click="feed" :title="selectedSongs.length < 3 ? 'you must select at least 3 songs' : ''" :disabled="selectedSongs.length < 3">i'm feeling lucky</button>
    </form>
  </section>
  <section class="admin-section">
    <h2>recommended songs</h2>
    <main class="home-recommended">
      <Song v-for="song of recommendedSongs" :key="song.name" :data="song" />
    </main>
  </section>
</template>

<style scoped>
.search-form {
  flex-direction: row;
}

.search-form input {
  width: 100%;
}

.search-form button {
  white-space: nowrap;
}

.feed-form {
  align-items: center;
}

.feed-form section {
  width: 100%;
}
</style>
