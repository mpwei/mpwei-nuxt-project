
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#ffc107',
    failedColor: 'red',
    height: '3px',
    duration: 10000,
    continuous: true
  },
  /*
  ** Global CSS
  */
  css: [
    'font-awesome/css/font-awesome.css',
    'vue2-datepicker/index.css',
    '~/assets/css/global.css',
    '~/assets/css/user.css',
    '~/assets/css/manage.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/firebase' },
    { src: '~/plugins/SweetAlert2' },
    { src: '~/plugins/language' },
    { src: '~/plugins/moment' },
    { src: '~/plugins/Editor', mode: 'client' },
    { src: '~/plugins/Datepicker', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  extractCSS: true,
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
          name: 'PostEdit',
          path: '/manage/posts/edit/:slug',
          component: resolve(__dirname, 'pages/manage/posts/add.vue')
        },
        {
          name: 'PostEditCategory',
          path: '/manage/posts/category/edit/:slug',
          component: resolve(__dirname, 'pages/manage/posts/add_category.vue')
        })
    }
  }
}
