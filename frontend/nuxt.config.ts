export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates&display=swap',
          rel: 'stylesheet'
        }
      ]
    }
  },
  css: [
    '@/assets/css/global.css',
    '@/assets/css/admin.css',
    '@/assets/css/crud.css',
    '@/assets/css/home.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  build: {
    transpile: [
      '@fortawesome/vue-fontawesome',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons'
    ]
  }
});
