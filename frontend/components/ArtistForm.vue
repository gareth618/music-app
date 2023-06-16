<script>
export default {
  props: ['initData', 'artistNames'],
  emits: ['update'],
  data() {
    return {
      name: this.initData == null ? '' : this.initData.name,
      photoUrl: this.initData?.photoUrl == null ? '' : this.initData.photoUrl,
      members: this.initData?.members == null ? [] : this.initData.members,
      activityStart: this.initData == null ? '' : this.initData.activity.start,
      activityEnd: this.initData?.activity.end == null ? '' : this.initData.activity.end,
      currentYear: new Date().getFullYear(),
      currentMember: ''
    };
  },
  computed: {
    availableArtists() {
      return this.artistNames.filter(artist => artist !== this.name && !this.members.includes(artist));
    },
    error() {
      if (this.name === '') return 'name not specified';
      if (isNaN(parseInt(this.activityStart))) return 'activity start year not a number';
      const activityStart = parseInt(this.activityStart);
      if (!(1993 <= activityStart && activityStart <= this.currentYear)) return 'wrong activity start year';
      if (this.activityEnd !== '') {
        if (isNaN(parseInt(this.activityEnd))) return 'activity end year not a number';
        const activityEnd = parseInt(this.activityEnd);
        if (!(1993 <= activityEnd && activityEnd <= this.currentYear)) return 'wrong activity end year';
        if (activityStart > activityEnd) return 'activity start year is greater than activity end year';
      }
      return '';
    }
  },
  methods: {
    addMember(newMember) {
      this.members.push(newMember);
      this.currentMember = '';
    },
    removeMember(oldMember) {
      this.members = this.members.filter(member => member !== oldMember);
      this.currentMember = '';
    },
    async sendArtist() {
      const artist = {
        name: this.name,
        ...(this.photoUrl === '' ? { } : { photoUrl: this.photoUrl }),
        ...(this.members.length === 0 ? { } : { members: this.members }),
        activity: {
          start: parseInt(this.activityStart),
          ...(this.activityEnd === '' ? { } : { end: parseInt(this.activityEnd) })
        }
      };
      const response = await fetch('http://localhost:8000/rest/artists', {
        method: this.initData == null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artist)
      });
      alert(await response.text());
      if (this.initData == null && response.status === 201) {
        this.name = '';
        this.photoUrl = '';
        this.members = [];
        this.activityStart = '';
        this.activityEnd = '';
        this.currentMember = '';
        this.$emit('update');
      } else if (this.initData != null && response.status === 200) {
        this.currentMember = '';
        this.$emit('update');
      }
    },
    async deleteArtist() {
      const response = await fetch(`http://localhost:8000/rest/artists/${this.name.replaceAll(' ', '+')}`, { method: 'DELETE' });
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
      <h3>members <span>(if band)</span></h3>
      <div v-for="member of members" :key="member">
        <input :value="member" disabled />
        <button class="admin-delete" @click="removeMember(member)">
          remove
          <Icon :icon="['fas', 'circle-xmark']" />
        </button>
      </div>
      <div v-if="availableArtists.length > 0">
        <select v-model="currentMember">
          <option value="" disabled>select member</option>
          <option v-for="artist of availableArtists">{{ artist }}</option>
        </select>
        <button class="admin-create" @click="addMember(currentMember)" :title="currentMember === '' ? 'no member to add' : ''" :disabled="currentMember === ''">
          add
          <Icon :icon="['fas', 'circle-check']" />
        </button>
      </div>
    </section>
    <section>
      <h3>activity</h3>
      <input type="number" :min="1993" :max="currentYear" v-model.trim="activityStart" placeholder="start year" />
      <input type="number" :min="1993" :max="currentYear" v-model.trim="activityEnd" placeholder="end year (leave empty if still active)" />
    </section>
    <section class="buttons">
      <button :class="`admin-${initData == null ? 'create' : 'update'}`" @click="sendArtist" :title="error" :disabled="error !== ''">
        {{ initData == null ? 'create' : 'update' }}
        <Icon :icon="['fas', initData == null ? 'cloud-arrow-up' : 'arrows-rotate']" />
      </button>
      <button class="admin-delete" v-if="initData != null" @click="deleteArtist">
        delete
        <Icon :icon="['fas', 'trash']" />
      </button>
    </section>
  </form>
</template>
