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
                      <b-form-input id="Year" v-model="Config.Year" class="mb-1" size="sm" :state="null" />
                      <small class="text-secondary">{{ $t('Manage.Global.WebsiteYearInfo') }}</small>
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Description" class="my-1">{{ $t('Manage.Global.Description') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Description" v-model="Config.SEO.Description[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Keyword" class="my-1">{{ $t('Manage.Global.Keyword') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Keyword" v-model="Config.SEO.Keyword[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="6" sm="12" class="mb-2">
                  <label class="mb-2">{{ $t('Manage.Global.Logo') }}</label>
                  <b-card
                    no-body
                    :img-src="Config.Logo.Url"
                    bg-variant="light"
                    img-alt="Card image"
                    img-left
                    class="site-logo mb-3 shadow-sm align-items-center py-2 px-3"
                  >
                    <b-card-body class="p-0 ml-3">
                      <b-input-group size="sm" class="mb-1" :prepend="$t('Manage.Global.Url')">
                        <b-form-input v-model="Config.Logo.Url" />
                        <b-input-group-append>
                          <b-button size="sm" text="Button" variant="success">
                            {{ $t('Manage.Global.Browse') }}
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                      <b-input-group size="sm" class="mb-1" :prepend="$t('Manage.Global.Alt')">
                        <b-form-input v-model="Config.Logo.Alt" />
                      </b-input-group>
                      <b-input-group size="sm" class="mb-1" :prepend="$t('Manage.Global.Title')">
                        <b-form-input v-model="Config.Logo.Title" />
                      </b-input-group>
                    </b-card-body>
                  </b-card>
                  <b-card
                    no-body
                    :img-src="Config.LogoAlt.Url"
                    bg-variant="secondary"
                    img-alt="Card image"
                    img-left
                    class="site-logo mb-3 text-white shadow-sm align-items-center py-2 px-3"
                  >
                    <b-card-body class="p-0 ml-3">
                      <b-input-group size="sm" class="mb-1" :prepend="$t('Manage.Global.Url')">
                        <b-form-input v-model="Config.LogoAlt.Url" />
                        <b-input-group-append>
                          <b-button size="sm" text="Button" variant="success">
                            {{ $t('Manage.Global.Browse') }}
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                      <b-input-group size="sm" class="mb-1" :prepend="$t('Manage.Global.Alt')">
                        <b-form-input v-model="Config.LogoAlt.Alt" />
                      </b-input-group>
                      <b-input-group size="sm" class="mb-1" :prepend="$t('Manage.Global.Title')">
                        <b-form-input v-model="Config.LogoAlt.Title" />
                      </b-input-group>
                    </b-card-body>
                  </b-card>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab :title="$t('Manage.Global.Social')">
              <b-input-group v-for="(Data,Index) in Config.Social" :key="Index" size="sm" class="mb-1">
                <b-input-group-prepend is-text>
                  <i class="fa" :class="'fa-' + (Data.Name === '' ? 'paw' : Data.Name)" />
                </b-input-group-prepend>
                <b-form-input v-model="Data.Link" />
                <template v-slot:append>
                  <b-dropdown size="sm" variant="dark" class="text-capitalize">
                    <template v-slot:button-content>
                      <span class="text-capitalize">
                        {{ (Data.Name === '' ? '請選擇' : Data.Name) }}
                      </span>
                    </template>
                    <b-dropdown-item v-for="Value in AllowSocial" :key="Value" @click="Data.Name = Value">
                      {{ Value }}
                    </b-dropdown-item>
                  </b-dropdown>
                  <b-button variant="danger" @click="RemoveSocial(Index)">
                    <i class="fa fa-times" />
                  </b-button>
                </template>
              </b-input-group>
              <div class="text-right">
                <b-button size="sm" variant="danger" type="button" class="mt-3" @click="AddSocial">
                  <i class="fa fa-plus" /> 新增社群連結
                </b-button>
              </div>
            </b-tab>
            <b-tab :title="$t('Manage.Global.ContactInfo')">
              <b-row class="text-secondary">
                <b-col lg="6" sm="12" class="mb-2">
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.CompanyName') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Title" v-model="Config.Contact.CompanyName[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.Address') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Title" v-model="Config.Contact.Address[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.Email') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Title" v-model="Config.Contact.Email" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="6" sm="12" class="mb-2">
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.Phone') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Title" v-model="Config.Contact.Phone[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.Mobile') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Title" v-model="Config.Contact.Mobile[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                  <b-row class="my-2">
                    <b-col sm="3" class="text-right">
                      <label for="Title" class="my-1">{{ $t('Manage.Global.Fax') }}</label>
                    </b-col>
                    <b-col sm="9">
                      <b-form-input id="Title" v-model="Config.Contact.Fax[NowLanguage]" size="sm" :state="null" />
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
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
        Social: [],
        OnService: true,
        ServiceTime: '1970-01-01 00:00:00',
        SEO: {
          Description: {},
          Keyword: {}
        },
        Contact: {
          CompanyName: {},
          Address: {},
          Phone: {},
          Mobile: {},
          Fax: {},
          Email: ''
        }
      },
      AllowSocial: [
        'facebook',
        'twitter',
        'whatsapp',
        'skype',
        'weixin',
        'qq',
        'github',
        'youtube-play',
        'medium',
        'instagram',
        'twitch',
        'telegram',
        'pinterest'
      ],
      Loading: true,
      NowLanguage: '',
      File: null
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
        this.$Swal.fire({
          icon: 'error',
          title: this.$t('Message.Error'),
          text: this.$t('Message.Manage.global/get-data-fail') + ': ' + _Error
        })
      })
    },
    AddSocial () {
      this.Config.Social.push({
        Link: '',
        Name: ''
      })
    },
    RemoveSocial (_Index) {
      this.$Swal.fire({
        icon: 'warning',
        title: this.$t('Message.AskDelete'),
        text: this.$t('Message.Manage.theme/delete-confirm'),
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('Global.Confirm'),
        cancelButtonText: this.$t('Global.Cancel')
      }).then((Result) => {
        if (Result.value) {
          this.Config.Social.splice(_Index, 1)
        }
      })
    },
    // UploadLogo (_LogoType) {
    //   this.$Firebase('storage').ref('uploads/' + this.File.name).put(this.File).then((response) => {
    //     this.$Firebase('storage').ref().child(response.ref.fullPath).getDownloadURL().then((_URL) => {
    //       this.Config[_LogoType].Url = _URL
    //     }).catch((_Error) => {
    //       alert(_Error)
    //     })
    //   }).catch((_Error) => {
    //     alert(_Error)
    //   })
    // },
    async SaveData () {
      this.Loading = true
      await this.$Firebase('firestore').collection('Config').doc('Website').set(this.Config, { merge: true }).then(() => {
        this.Loading = false
        this.$Swal.fire({
          icon: 'success',
          title: this.$t('Message.Success'),
          text: this.$t('Message.Manage.global/save-success')
        })
      }).catch((_Error) => {
        this.Loading = false
        this.$Swal.fire({
          icon: 'error',
          title: this.$t('Message.Error'),
          text: this.$t('Message.Manage.global/save-fail') + ': ' + _Error
        })
      })
    }
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
