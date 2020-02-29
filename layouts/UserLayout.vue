<template>
  <div>
    <header id="header">
      <b-navbar type="light" variant="white">
        <div class="container">
          <b-navbar-brand to="/" class="site-logo mr-auto">
            <img :src="$store.state.profile.website.Logo" alt="More Patient">
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
export default {
  data () {
    return {
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
    this.$Firebase('analytics')
  },
  methods: {
    ChangeLanguage (_Language) {
      this.$store.commit('SetLang', _Language)
      this.$i18n.locale = this.$store.state.language
    }
  }
}
</script>
