<script>
export default {
  data() {
    return {
      artists: null
    };
  },
  computed: {
    artistNames() {
      return this.artists.map(({ name }) => name);
    }
  },
  async mounted() {
    await this.fetchArtists();
  },
  methods: {
    async fetchArtists() {
      this.artists = await (await fetch('http://localhost:8000/rest/artists')).json();
    }
  }
};
</script>

<template>
  <Head>
    <Title>admin panel | artists</Title>
  </Head>
  <h1 class="admin-title">artists</h1>
  <div v-if="artists != null">
    <section class="admin-section">
      <h2>create artist</h2>
      <ArtistForm class="create-form" :artistNames="artistNames" @update="fetchArtists" />
    </section>
    <section class="admin-section">
      <h2>current artists</h2>
      <TransitionGroup tag="div">
        <ArtistForm v-for="artist of artists" :initData="artist" :key="artist.name" :artistNames="artistNames" @update="fetchArtists" />
      </TransitionGroup>
    </section>
  </div>
  <p class="admin-loading" v-else>loading artists…</p>
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
