<template>
  <section id="About" class="AdminContent">
    <div class="container">
      <form class="fs-form-sm position-relative" @submit.prevent="SaveData">
        <div v-if="Loading" class="text-center p-5 position-absolute w-100 h-100 ContentLoading">
          <b-spinner label="Loading..." />
        </div>
        <div class="my-3 p-3 bg-white rounded shadow-sm fs-form-sm">
          <div class="border-bottom pb-3 mb-3 d-flex justify-content-between">
            <h1 class="font-weight-bold h4 mb-0">
              {{ $t('Manage.Menu.About') }}
            </h1>
            <div class="PostLang">
              <img
                v-for="(value, key) in $store.state.locales"
                :key="key"
                :src="require('~/assets/img/language/' + value + '.png')"
                class="mx-1"
                :class="{'active': NowLanguage === value }"
                alt=""
                @click="NowLanguage = value">
            </div>
          </div>
          <div v-for="(Data, Index) in AboutData" :key="Index" class="row text-secondary">
            <div class="mb-3 col-12">
              <div class="row my-1">
                <div class="col-sm-3 col-xl-1 col-lg-2">
                  <label :for="'Title' + Index" class="my-1">{{ $t('Manage.Unit.Title') }}</label>
                </div>
                <div class="col-sm-9 col-xl-11 col-lg-10">
                  <b-form-input :id="'Title' + Index" v-model="Data.Title[NowLanguage]" size="sm" :state="null" />
                </div>
              </div>
            </div>
            <div class="col-12">
              <VueEditor v-model="Data.Content[NowLanguage]" class="mb-4" :editor-toolbar="CustomToolbar" />
              <hr>
            </div>
          </div>
        </div>
        <div class="my-3 p-3 bg-white rounded shadow-sm d-flex justify-content-end">
          <b-button variant="success" size="md" type="submit">
            {{ $t('Global.Save') }}
          </b-button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
  let VueEditor
  if (process.client) {
    VueEditor = require('vue2-editor').VueEditor
  }
  export default {
    layout: 'ManageLayout',
    middleware: [
      'ManageAuth'
    ],
    components: {
      VueEditor
    },
    data () {
      return {
        NowLanguage: '',
        Loading: true,
        AboutData: {
          About: {
            Title: {},
            Content: {}
          }
        },
        CustomToolbar: [
          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],

          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
          ['link', 'image', 'video', 'formula'],

          ['clean'] // remove formatting button
        ]
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
          this.GetAboutList()
        ])
      },
      GetAboutList () {
        this.Loading = true
        this.$Firebase('firestore').runTransaction((Transaction) => {
          return Promise.all([
            Transaction.get(this.$Firebase('firestore').collection('PostDetail').doc('about')).then((Document) => {
              this.AboutData.About.Title = Document.data().Title
              this.AboutData.About.Content = Document.data().Content
            })
          ])
        }).then(() => {
          this.Loading = false
        })
      },
      async SaveData () {
        this.Loading = true
        const About = this.$Firebase('firestore').collection('PostDetail').doc('about')
        await this.$Firebase('firestore').runTransaction((Transaction) => {
          return Promise.all([
            Transaction.get(About).then((Document) => {
              if (!Document.exists) {
                throw new Error('Document-About does not exist!')
              }
              Transaction.update(About, {
                Title: this.AboutData.About.Title,
                Content: this.AboutData.About.Content
              })
            })
          ])
        }).then(() => {
          this.Loading = false
          this.$Swal.fire({
            icon: 'success',
            title: this.$t('Message.Success'),
            text: this.$t('Message.Manage.post/save-success')
          })
        }).catch((_Error) => {
          this.Loading = false
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.post/save-fail') + ': ' + _Error
          })
        })
      }
    },
    head () {
      // Set Meta Tags for this Page
    }
  }
</script>
