<script>
export default {
  data() {
    return {
      songs: null,
      artistNames: null,
      albumNames: null
    };
  },
  async mounted() {
    await this.fetchSongs();
    this.artistNames = (await (await fetch('http://localhost:8000/rest/artists')).json()).map(({ name }) => name);
    this.albumNames = (await (await fetch('http://localhost:8000/rest/albums')).json()).map(({ name }) => name);
  },
  methods: {
    async fetchSongs() {
      this.songs = await (await fetch('http://localhost:8000/rest/songs')).json();
    }
  }
};
</script>

<template>
  <Head>
    <Title>admin panel | songs</Title>
  </Head>
  <h1 class="admin-title">songs</h1>
  <div v-if="songs != null && artistNames != null && albumNames != null">
    <section class="admin-section">
      <h2>create song</h2>
      <SongForm class="create-form" :artistNames="artistNames" :albumNames="albumNames" @update="fetchSongs" />
    </section>
    <section class="admin-section">
      <h2>current songs</h2>
      <TransitionGroup tag="div">
        <SongForm v-for="song of songs" :initData="song" :key="song.name" :artistNames="artistNames" :albumNames="albumNames" @update="fetchSongs" />
      </TransitionGroup>
    </section>
  </div>
  <p class="admin-loading" v-else>loading songs, artists and albums…</p>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all .5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  translate: 50px;
}
</style>
