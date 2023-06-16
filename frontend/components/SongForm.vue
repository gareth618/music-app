<script>
export default {
  props: ['initData', 'artistNames', 'albumNames'],
  emits: ['update'],
  data() {
    return {
      name: this.initData == null ? '' : this.initData.name,
      album: this.initData == null ? '' : this.initData.album,
      featuredArtists: this.initData?.featuredArtists == null ? [] : this.initData.featuredArtists,
      currentFeaturedArtist: ''
    };
  },
  computed: {
    availableArtists() {
      return this.artistNames.filter(artist => !this.featuredArtists.includes(artist));
    },
    error() {
      if (this.name === '') return 'name not specified';
      if (this.album === '') return 'album not specified';
      return '';
    }
  },
  methods: {
    addFeaturedArtist(newFeaturedArtist) {
      this.featuredArtists.push(newFeaturedArtist);
      this.currentFeaturedArtist = '';
    },
    removeFeaturedArtist(oldFeaturedArtist) {
      this.featuredArtists = this.featuredArtists.filter(artist => artist !== oldFeaturedArtist);
      this.currentFeaturedArtist = '';
    },
    async sendSong() {
      const song = {
        name: this.name,
        album: this.album,
        ...(this.featuredArtists.length === 0 ? { } : { featuredArtists: this.featuredArtists })
      };
      const response = await fetch('http://localhost:8000/rest/songs', {
        method: this.initData == null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
      });
      alert(await response.text());
      if (this.initData == null && response.status === 201) {
        this.name = '';
        this.album = '';
        this.featuredArtists = [];
        this.currentFeaturedArtist = '';
        this.$emit('update');
      } else if (this.initData != null && response.status === 200) {
        this.currentFeaturedArtist = '';
        this.$emit('update');
      }
    },
    async deleteSong() {
      const response = await fetch(`http://localhost:8000/rest/songs/${this.name.replaceAll(' ', '+')}`, { method: 'DELETE' });
      alert(await response.text());
      if (response.status === 200) {
        this.$emit('update');
      }
    }
  }
};
</script>

<template>
  <form class="crud-form" @submit.prevent>
    <section>
      <input v-model.trim="name" placeholder="name" />
      <select v-model="album">
        <option value="" disabled>select album</option>
        <option v-for="album of albumNames">{{ album }}</option>
      </select>
    </section>
    <section class="list">
      <h3>featured artists</h3>
      <div v-for="artist of featuredArtists" :key="artist">
        <input :value="artist" disabled />
        <button class="admin-delete" @click="removeFeaturedArtist(artist)">
          remove
          <Icon :icon="['fas', 'circle-xmark']" />
        </button>
      </div>
      <div v-if="availableArtists.length > 0">
        <select v-model="currentFeaturedArtist">
          <option value="" disabled>select featured artist</option>
          <option v-for="artist of availableArtists">{{ artist }}</option>
        </select>
        <button class="admin-create" @click="addFeaturedArtist(currentFeaturedArtist)" :title="currentFeaturedArtist === '' ? 'no featured artist to add' : ''" :disabled="currentFeaturedArtist === ''">
          add
          <Icon :icon="['fas', 'circle-check']" />
        </button>
      </div>
    </section>
    <section class="buttons">
      <button :class="`admin-${initData == null ? 'create' : 'update'}`" @click="sendSong" :title="error" :disabled="error !== ''">
        {{ initData == null ? 'create' : 'update' }}
        <Icon :icon="['fas', initData == null ? 'cloud-arrow-up' : 'arrows-rotate']" />
      </button>
      <button class="admin-delete" v-if="initData != null" @click="deleteSong">
        delete
        <Icon :icon="['fas', 'trash']" />
      </button>
    </section>
  </form>
</template>
