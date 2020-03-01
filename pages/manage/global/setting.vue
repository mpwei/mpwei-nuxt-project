<template>
  <section id="Setting" class="AdminContent">
    <div class="container">
      <form class="fs-form-sm position-relative" @submit.prevent="SaveData">
        <div v-if="Loading" class="text-center p-5 position-absolute w-100 h-100 ContentLoading">
          <b-spinner label="Loading..." />
        </div>
        <div class="my-3 p-3 bg-white rounded shadow-sm">
          <div class="border-bottom pb-3 mb-3 d-flex justify-content-between">
            <h1 class="font-weight-bold h4 mb-0">
              {{ $t('Manage.SystemConfig') }}
            </h1>
            <div class="LangSwitch">
              <img
                v-for="(value, key) in $store.state.locales"
                :key="key"
                :src="require('~/assets/img/language/' + value + '.png')"
                class="mx-1"
                :class="{'active': NowLanguage === value }"
                @click="NowLanguage = value">
            </div>
          </div>
          <b-tabs active-nav-item-class="font-weight-bold text-dark" content-class="mt-3">
            <b-tab :title="$t('Manage.Global.GlobalSetting')" active>
              <b-row class="text-secondary">
                <b-col lg="6" sm="12" class="mb-2">
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.WebsiteSwitch') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-checkbox v-model="Config.OnService" switch size="lg" class="mb-1" />
                      <small class="text-secondary">{{ $t('Manage.Global.WebsiteSwitchInfo') }}</small>
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.WebsiteTitle') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Title" v-model="Config.Title[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="SubTitle" class="my-1">{{ $t('Manage.Global.WebsiteSubTitle') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="SubTitle" v-model="Config.Subtitle[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Year" class="my-1">{{ $t('Manage.Global.WebsiteYear') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input v-model="Config.Year" id="Year" class="mb-1" size="sm" :state="null" />
                      <small class="text-secondary">{{ $t('Manage.Global.WebsiteYearInfo') }}</small>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="6" sm="12" class="mb-2">
                  <label class="mb-2">{{ $t('Manage.Global.Logo') }}</label>
                  <b-card :img-src="Config.Logo.Url" bg-variant="light" img-alt="Card image" img-left class="site-logo mb-3 shadow-sm align-items-center py-2 px-3">
                    <b-card-text>
                      Some quick example text to build on the card and make up the bulk of the card's content.
                    </b-card-text>
                  </b-card>
                  <b-card :img-src="Config.LogoAlt.Url" bg-variant="secondary" img-alt="Card image" img-left class="site-logo mb-3 text-white shadow-sm align-items-center py-2 px-3">
                    <b-card-text>
                      Some quick example text to build on the card and make up the bulk of the card's content.
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('Manage.Global.Social')">
              Social
            </b-tab>
            <b-tab :title="$t('Manage.Global.SEO')">
              SEO
            </b-tab>
            <b-tab :title="$t('Manage.Global.ContactInfo')">
              SEO
            </b-tab>
          </b-tabs>
        </div>
        <div class="my-3 p-3 bg-white rounded shadow-sm d-flex justify-content-between">
          <b-button size="sm" variant="success" type="submit">
            {{ $t('Manage.Global.Save') }}
          </b-button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'ManageLayout',
  middleware: [
    'ManageAuth'
  ],
  data () {
    return {
      Config: {
        Title: {},
        Subtitle: {},
        Year: 0,
        Logo: {},
        LogoAlt: {},
        OnService: true,
        ServiceTime: '1970-01-01 00:00:00'
      },
      Loading: true,
      NowLanguage: ''
    }
  },
  mounted () {
    this.NowLanguage = this.$store.state.language
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.Init().then(() => {
        this.$nuxt.$loading.finish()
        this.Loading = false
      }).catch(() => {
        this.$nuxt.$loading.finish()
      })
    })
  },
  methods: {
    Init () {
      return Promise.all([
        this.GetConfig()
      ])
    },
    GetConfig () {
      return this.$Firebase('firestore').collection('Config').doc('Website').get().then((Document) => {
        this.Config = Document.data()
      }).catch((_Error) => {
        console.error(_Error)
      })
    },
    async SaveData () {
      await this.$Firebase('firestore').collection('Config').doc('Website').set(this.Config, { merge: true }).then(() => {
        this.$Swal.fire({
          icon: 'success',
          title: this.$t('Message.Success'),
          text: this.$t('Message.Manage.theme/save-success')
        })
      }).catch((_Error) => {
        this.$Swal.fire({
          icon: 'error',
          title: this.$t('Message.Error'),
          text: this.$t('Message.Manage.theme/save-fail') + ': ' + _Error
        })
      })
    }
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
