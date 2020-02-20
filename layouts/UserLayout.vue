<template>
  <div>
    <header id="header">
      <b-navbar type="light" variant="white">
        <div class="container">
          <b-navbar-brand to="/" class="site-logo mr-auto">
            <img v-lazy="$store.state.profile.logo" alt="More Patient">
            <h1 class="d-inline ml-2">
              More Patient.
            </h1>
          </b-navbar-brand>
        </div>
      </b-navbar>
      <b-navbar toggleable="md" type="dark" variant="dark">
        <div class="container">
          <b-navbar-toggle target="nav-collapse" />
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item
                v-for="(value,index) in $store.state.profile.menu"
                :key="index"
                class="mr-lg-3"
                :to="value.Url"
                :class="{ 'active': value.Url === $route.path }"
              >
                {{ value.Name[$store.state.language] }}
              </b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto d-none d-md-flex">
              <b-nav-item
                v-for="(value,index) in Social"
                :key="index"
                right
                :href="value.link"
                target="_blank"
              >
                <i class="fa" :class="'fa-' + value.icon" />
              </b-nav-item>
              <b-nav-item-dropdown class="rounded-0" text="Lang" right>
                <template slot="button-content">
                  <i class="fa fa-globe" aria-hidden="true" />
                </template>
                <b-dropdown-item v-for="(data,index) in $store.state.locales" :key="index" @click="ChangeLanguage(data)">
                  {{ $t("Language." + data) }}
                </b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </div>
      </b-navbar>
    </header>
    <nuxt />
    <footer id="footer" class="text-secondary py-3 text-center border-top">
      Copyright © {{ $store.state.profile.website.Year }} {{ $store.state.profile.website.Title[$store.state.language] }} All rights reserved. Designed by {{ $store.state.profile.website.Designer[$store.state.language] }}
    </footer>
  </div>
</template>

<script>
import { Firestore } from '@/plugins/firebase'
import '@/assets/css/global.css'
import '@/assets/css/user.css'
import 'font-awesome/css/font-awesome.css'

export default {
  fetch () {
    // The fetch method is used to fill the store before rendering the page
  },
  async asyncData () {
    const WebConfig = []
    const Menu = []
    await Firestore.collection('Menu').where('Open', '==', true).orderBy('No', 'asc').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        WebConfig.push(doc.data())
        console.log(doc.data())
      })
    })
    await Firestore.collection('Config').doc('Website').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Menu.push(doc.data())
        console.log(doc.data())
      })
    })
    return {
      WebConfig,
      Menu
    }
  },
  data () {
    return {
      WebConfig: [],
      Menu: [],
      Social: {
        mail: {
          icon: 'envelope',
          link: 'mailto:mailermpwei@gmail.com'
        },
        github: {
          icon: 'github',
          link: '//github.com/mpwei'
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.Init().then(() => {
        this.$nuxt.$loading.finish()
      }).catch(() => {
        this.$nuxt.$loading.finish()
      })
    })
  },
  methods: {
    Init () {
      return Promise.all([
        // this.GetWebConfig(),
        // this.GetMenu(),
        this.GetLogo()
      ])
    },
    GetWebConfig () {
      return this.WebConfig.forEach((_Response) => {
        this.$store.commit('SetWebConfig', _Response)
      }).catch((e) => {
        console.error(e)
      })
    },
    GetMenu () {
      return this.Menu.forEach((_Response) => {
        this.$store.commit('SetMenu', _Response)
      }).catch((e) => {
        console.error(e)
      })
    },
    GetLogo () {
      return this.$Firebase('storage').ref().child('images/logo_icon.png').getDownloadURL().then((_URL) => {
        this.$store.commit('SetLogo', _URL)
      }).catch((e) => {
        console.error(e)
      })
    },
    ChangeLanguage (_Language) {
      this.$store.commit('SetLang', _Language)
      this.$i18n.locale = this.$store.state.language
    }
  }
}
</script>
