<script>
export default {
  props: ['initData', 'artistNames'],
  emits: ['update'],
  data() {
    return {
      name: this.initData == null ? '' : this.initData.name,
      photoUrl: this.initData?.photoUrl == null ? '' : this.initData.photoUrl,
      artists: this.initData == null ? [] : this.initData.artists,
      year: this.initData == null ? '' : this.initData.year.toString(),
      recordLabel: this.initData?.recordLabel == null ? '' : this.initData.recordLabel,
      currentYear: new Date().getFullYear(),
      currentArtist: ''
    };
  },
  computed: {
    availableArtists() {
      return this.artistNames.filter(artist => !this.artists.includes(artist));
    },
    error() {
      if (this.name === '') return 'name not specified';
      if (this.artists.length === 0) return 'artists not specified';
      if (isNaN(parseInt(this.year))) return 'year not a number';
      const year = parseInt(this.year);
      if (!(1993 <= year && year <= this.currentYear)) return 'wrong year';
      return '';
    }
  },
  methods: {
    addArtist(newArtist) {
      this.artists.push(newArtist);
      this.currentArtist = '';
    },
    removeArtist(oldArtist) {
      this.artists = this.artists.filter(artist => artist !== oldArtist);
      this.currentArtist = '';
    },
    async sendAlbum() {
      const album = {
        name: this.name,
        ...(this.photoUrl === '' ? { } : { photoUrl: this.photoUrl }),
        artists: this.artists,
        year: parseInt(this.year),
        ...(this.recordLabel === '' ? { } : { recordLabel: this.recordLabel })
      };
      const response = await fetch('http://localhost:8000/rest/albums', {
        method: this.initData == null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(album)
      });
      alert(await response.text());
      if (this.initData == null && response.status === 201) {
        this.name = '';
        this.photoUrl = '';
        this.artists = [];
        this.year = '';
        this.recordLabel = '';
        this.currentArtist = '';
        this.$emit('update');
      } else if (this.initData != null && response.status === 200) {
        this.currentArtist = '';
        this.$emit('update');
      }
    },
    async deleteAlbum() {
      const response = await fetch(`http://localhost:8000/rest/albums/${this.name.replaceAll(' ', '+')}`, { method: 'DELETE' });
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
    <section class="front">
      <div v-if="photoUrl === ''" class="no-photo">no photo</div>
      <img v-else :src="photoUrl" />
      <input v-model.trim="name" placeholder="name" />
      <input v-model.trim="photoUrl" placeholder="photo url (optional)" />
    </section>
    <section class="list">
      <h3>artists</h3>
      <div v-for="artist of artists" :key="artist">
        <input :value="artist" disabled />
        <button class="admin-delete" @click="removeArtist(artist)">
          remove
          <Icon :icon="['fas', 'circle-xmark']" />
        </button>
      </div>
      <div v-if="availableArtists.length > 0">
        <select v-model="currentArtist">
          <option value="" disabled>select artist</option>
          <option v-for="artist of availableArtists">{{ artist }}</option>
        </select>
        <button class="admin-create" @click="addArtist(currentArtist)" :title="currentArtist === '' ? 'no artist to add' : ''" :disabled="currentArtist === ''">
          add
          <Icon :icon="['fas', 'circle-check']" />
        </button>
      </div>
    </section>
    <section>
      <input type="number" :min="1993" :max="currentYear" v-model.trim="year" placeholder="year" />
      <input v-model.trim="recordLabel" placeholder="record label (if any)" />
    </section>
    <section class="buttons">
      <button :class="`admin-${initData == null ? 'create' : 'update'}`" @click="sendAlbum" :title="error" :disabled="error !== ''">
        {{ initData == null ? 'create' : 'update' }}
        <Icon :icon="['fas', initData == null ? 'cloud-arrow-up' : 'arrows-rotate']" />
      </button>
      <button class="admin-delete" v-if="initData != null" @click="deleteAlbum">
        delete
        <Icon :icon="['fas', 'trash']" />
      </button>
    </section>
  </form>
</template>
