
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
    duration: 7000,
    continuous: false
  },
  /*
  ** Global CSS
  */
  css: [
    'font-awesome/css/font-awesome.css',
    '~/assets/css/global.css',
    '~/assets/css/user.css',
    '~/assets/css/manage.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/firebase' },
    { src: '~/plugins/SweetAlert2', mode: 'client' },
    { src: '~/plugins/language' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  pwa: {
    workbox: {
      runtimeCaching: [
        {
          // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
          urlPattern: 'https://firebasestorage.googleapis.com/v0/b/mpwei-2889f.appspot.com/.*',
          // Defaults to `networkFirst` if omitted
          // handler: 'networkFirst',
          // Defaults to `GET` if omitted
          // method: 'GET'
        }
      ]
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    'bootstrap-vue/nuxt',
    // '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@ax2/dayjs-module'
    // '@nuxtjs/dotenv'
  ],
  bootstrapVue: {
    components: [
      'BButton',
      'BSpinner',
      'BBadge',
      'BAlert'
    ],
    componentPlugins: [
      'NavbarPlugin'
    ]
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  // axios: {
  // },
  /*
  ** Build configuration
  */
  extractCSS: true,
	build: {
		analyze: true,
		optimization: {
			splitChunks: {
				minSize: 10000,
				maxSize: 150000
			}
		},
		splitChunks: {
			layouts: true,
			pages: true,
			commons: true
		},
		/*
		** You can extend webpack config here
		*/
		extend(config, ctx) {
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
