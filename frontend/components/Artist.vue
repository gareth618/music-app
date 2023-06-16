<script>
export default {
  props: ['data', 'selectedSongs'],
  data() {
    return {
      albums: null
    };
  },
  methods: {
    async fetchAlbums() {
      this.albums = await (await fetch(`http://localhost:8000/rest/artists/${this.data.name.replaceAll(' ', '+')}/albums`)).json();
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
        <p v-if="data.members != null"><strong>members:</strong> {{ data.members.join(', ') }}</p>
        <p><strong>years active:</strong> {{ data.activity.start }} – {{ data.activity.end == null ? 'present' : data.activity.end }}</p>
      </div>
    </section>
    <button v-if="albums == null" @click="fetchAlbums">load albums</button>
    <button v-else @click="albums = null">hide albums</button>
    <Album v-if="albums != null" v-for="album of albums" :data="album" :selectedSongs="selectedSongs" />
  </article>
</template>
