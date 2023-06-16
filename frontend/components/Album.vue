<script>
export default {
  props: ['data', 'selectedSongs'],
  data() {
    return {
      songs: null
    };
  },
  methods: {
    async fetchSongs() {
      this.songs = await (await fetch(`http://localhost:8000/rest/albums/${this.data.name.replaceAll(' ', '+')}/songs`)).json();
    }
  }
};
</script>

<template>
  <article class="home-entry">
    <section>
      <div v-if="data.photoUrl === ''" class="no-photo">no photo</div>
      <img v-else :src="data.photoUrl" />
      <div>
        <h3>{{ data.name }}</h3>
        <p><strong>artists:</strong> {{ data.artists.join(', ') }}</p>
        <p><strong>year:</strong> {{ data.year }}</p>
        <p v-if="data.recordLabel != null"><strong>record label:</strong> {{ data.recordLabel }}</p>
      </div>
    </section>
    <button v-if="songs == null" @click="fetchSongs">load songs</button>
    <button v-else @click="songs = null">hide songs</button>
    <Song v-if="songs != null" v-for="song of songs" :data="song" :selectedSongs="selectedSongs" />
  </article>
</template>
