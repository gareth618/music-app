<script>
export default {
  props: ['data', 'selectedSongs'],
  methods: {
    select() {
      if (this.selectedSongs == null) return;
      if (!this.selectedSongs.includes(this.data.name)) {
        const newSelectedSongs = [...this.selectedSongs];
        newSelectedSongs.push(this.data.name);
        localStorage.setItem('selected', JSON.stringify(newSelectedSongs));
      } else {
        let newSelectedSongs = [...this.selectedSongs];
        newSelectedSongs = newSelectedSongs.filter(song => song !== this.data.name);
        localStorage.setItem('selected', JSON.stringify(newSelectedSongs));
      }
    }
  }
};
</script>

<template>
  <article class="home-entry" :class="{ active: selectedSongs != null, selected: selectedSongs?.includes(data.name) }" @click="select">
    <div>
      <h3>{{ data.name }}</h3>
      <p><strong>album:</strong> {{ data.album }}</p>
      <p v-if="data.featuredArtists != null"><strong>featured artists:</strong> {{ data.featuredArtists.join(', ') }}</p>
    </div>
  </article>
</template>

<style scoped>
.active {
  cursor: pointer;
}

.selected {
  border-color: red;
}
</style>
