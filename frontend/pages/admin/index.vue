<template>
  <Head>
    <Title>admin panel</Title>
  </Head>
  <h1 class="admin-title">admin panel</h1>
  <section class="admin-section">
    <NuxtLink to="/admin/artists"><Icon class="fa-fw" :icon="['fas', 'microphone-lines']" /> artists</NuxtLink>
    <NuxtLink to="/admin/albums"><Icon class="fa-fw" :icon="['fas', 'compact-disc']" /> albums</NuxtLink>
    <NuxtLink to="/admin/songs"><Icon class="fa-fw" :icon="['fas', 'music']" /> songs</NuxtLink>
  </section>
</template>

<style scoped>
a {
  padding: 1rem;
  width: 300px;
  font-size: 2rem;
  font-weight: bold;
  background-image: linear-gradient(to right, #333, transparent);
}

a:where(:hover, :focus-visible) {
  background-color: #111;
}
</style>
