<script>
export default {
  data() {
    return {
      albums: null,
      artistNames: null
    };
  },
  async mounted() {
    await this.fetchAlbums();
    this.artistNames = (await (await fetch('http://localhost:8000/rest/artists')).json()).map(({ name }) => name);
  },
  methods: {
    async fetchAlbums() {
      this.albums = await (await fetch('http://localhost:8000/rest/albums')).json();
    }
  }
};
</script>

<template>
  <Head>
    <Title>admin panel | albums</Title>
  </Head>
  <h1 class="admin-title">albums</h1>
  <div v-if="albums != null && artistNames != null">
    <section class="admin-section">
      <h2>create album</h2>
      <AlbumForm class="create-form" :artistNames="artistNames" @update="fetchAlbums" />
    </section>
    <section class="admin-section">
      <h2>current albums</h2>
      <TransitionGroup tag="div">
        <AlbumForm v-for="album of albums" :initData="album" :key="album.name" :artistNames="artistNames" @update="fetchAlbums" />
      </TransitionGroup>
    </section>
  </div>
  <p class="admin-loading" v-else>loading albums and artists…</p>
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
