<template>
  <section id="Carousel" class="AdminContent">
    <div class="container">
      <form class="position-relative" @submit.prevent="SaveCarousel">
        <div class="my-3 p-3 bg-white rounded shadow-sm">
          <h1 class="font-weight-bold border-bottom pb-3 h4 mb-3">
            {{ $t('Manage.Menu.ThemeCarousel') }}
          </h1>
          <div class="alert alert-secondary mb-4" role="alert">
            {{ $t('Manage.Themes.Carousel/Notice') }}
          </div>
          <div v-if="Loading" class="text-center p-5">
            <b-spinner label="Loading..." />
          </div>
          <draggable
            v-model="Carousel"
            class="row no-gutters mx-n1"
            tag="div"
            v-bind="DragOptions"
            @start="Drag = true"
            @end="Drag = false"
          >
            <div v-for="(Data, Index) in Carousel" :key="Index" class="col-lg-3 col-md-4 col-sm-6 col-12 px-1">
              <div class="card CarouselItem">
                <img :src="Data.Url" class="card-img-top" :alt="Data.Alt">
                <div class="card-body">
                  <button v-b-toggle.EditCarousel type="button" class="btn mx-1 btn-sm btn-success" @click="EditCarousel(Index)">
                    <i class="fa fa-edit" />
                  </button>
                  <button type="button" class="btn mx-1 btn-sm btn-danger" @click="RemoveCarousel(Index)">
                    <i class="fa fa-times" />
                  </button>
                </div>
              </div>
            </div>
          </draggable>
        </div>
        <div class="my-3 p-3 bg-white rounded shadow-sm d-flex justify-content-between">
          <b-button variant="info" size="md" type="button" @click="AddCarousel">
            <i class="fa fa-plus-circle" aria-hidden="true" /> {{ $t('Manage.Themes.Carousel/Add') }}
          </b-button>
          <b-button variant="success" size="md" type="submit">
            {{ $t('Manage.Themes.Carousel/Save') }}
          </b-button>
        </div>
      </form>
    </div>
    <b-modal
      id="MediaStore"
      :title="$t('Manage.Themes.Carousel/Edit')"
      :ok-title="$t('Manage.Themes.Carousel/OK')"
      :cancel-title="$t('Manage.Themes.Carousel/Cancel')"
      cancel-variant="danger"
      ok-variant="success"
      @ok="''"
    />
    <b-sidebar
      id="EditCarousel"
      :title="$t('Manage.Themes.Carousel/Edit')"
      header-class="bg-dark text-white"
      body-class="text-dark"
      footer-class="bg-info"
      text-variant="white"
      shadow
      right
    >
      <template v-slot:footer>
        <div v-if="false" class="PostLang d-flex align-items-center p-3">
          <strong class="mr-auto">{{ $t('Manage.LangSwitcher') }}</strong>
          <img
            v-for="(value, key) in $store.state.locales"
            :key="key"
            :src="require('~/assets/img/language/' + value + '.png')"
            class="mx-1"
            :class="{'active': NowLanguage === value }"
            :alt="value"
            @click="NowLanguage = value">
        </div>
      </template>
      <div class="p-3">
        <div class="form-group">
          <label for="Url">{{ $t('Manage.Themes.Carousel/Url') }}</label>
          <div class="input-group mb-3">
            <input id="Url" v-model="CarouselItem.Url" type="text" class="form-control form-control-sm">
            <div class="input-group-append">
              <button class="btn btn-info btn-sm" type="button">
                {{ $t('Manage.Themes.Carousel/OpenMediaStore') }}
              </button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="Alt">{{ $t('Manage.Themes.Carousel/Alt') }}</label>
          <input id="Alt" v-model="CarouselItem.Alt" type="text" class="form-control form-control-sm">
        </div>
        <div class="form-group">
          <label for="Title">{{ $t('Manage.Themes.Carousel/Title') }}</label>
          <input id="Title" v-model="CarouselItem.Title[NowLanguage]" type="text" class="form-control form-control-sm">
        </div>
        <div class="form-group">
          <label for="Link">{{ $t('Manage.Themes.Carousel/Link') }}</label>
          <input id="Link" v-model="CarouselItem.Link" type="text" class="form-control form-control-sm">
        </div>
        <div class="form-group">
          <label for="Content">{{ $t('Manage.Themes.Carousel/Content') }}</label>
          <textarea id="Content" v-model="CarouselItem.Content[NowLanguage]" type="text" class="form-control form-control-sm" rows="5" />
        </div>
        <button v-b-toggle.EditCarousel class="btn btn-success btn-sm btn-block mb-3" type="button" @click="SetCarousel(CarouselItem.Index)">
          {{ $t('Manage.Themes.Carousel/OK') }}
        </button>
      </div>
    </b-sidebar>
  </section>
</template>

<script>
  import Vue from 'vue'
  import { ModalPlugin, SidebarPlugin } from 'bootstrap-vue'
  Vue.use(ModalPlugin)
  Vue.use(SidebarPlugin)

  export default {
    layout: 'ManageLayout',
    middleware: [
      'ManageAuth'
    ],
    components: {
      draggable: () => import('vuedraggable')
    },
    data () {
      return {
        NowLanguage: '',
        Carousel: [],
        Loading: true,
        Drag: false,
        NoImg: 'https://firebasestorage.googleapis.com/v0/b/researchproject-aaa0e.appspot.com/o/images%2Fno-image.svg?alt=media&token=c3a516c2-a1b2-4a3d-888c-65f0494301dd',
        CarouselItem: {
          Alt: '',
          Title: {},
          Content: {},
          Link: '',
          Url: ''
        }
      }
    },
    computed: {
      DragOptions () {
        return {
          animation: 200,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost'
        }
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
          this.GetCarousel()
        ])
      },
      GetCarousel () {
        this.List = []
        return this.$Firebase('firestore').collection('Config').doc('Carousel').get().then((Document) => {
          this.Carousel = Document.data().Data
        }).catch((_Error) => {
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.post/list-fail-to-get') + ': ' + _Error
          })
        })
      },
      AddCarousel () {
        this.Carousel.push({
          Content: {
            'zh-tw': ''
          },
          Title: {
            'zh-tw': ''
          },
          Tags: [],
          Link: '/',
          Type: 'image',
          Url: this.NoImg,
          Alt: ''
        })
      },
      EditCarousel (_Index) {
        this.CarouselItem = this.Carousel[_Index]
        this.CarouselItem.Index = _Index
      },
      SetCarousel (_Index) {
        this.Carousel[_Index] = this.CarouselItem
      },
      RemoveCarousel (_Index) {
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
            this.Carousel.splice(_Index, 1)
          }
        })
      },
      async SaveCarousel () {
        this.Loading = true
        await this.$Firebase('firestore').collection('Config').doc('Carousel').set({
          Data: this.Carousel
        }, { merge: true }).then(() => {
          this.Loading = false
          this.$Swal.fire({
            icon: 'success',
            title: this.$t('Message.Success'),
            text: this.$t('Message.Manage.theme/save-success')
          })
        }).catch((_Error) => {
          this.Loading = false
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

<style scoped>
  #Carousel .CarouselItem {
    cursor: pointer;
    transition: background-color 0.3s;
    overflow: hidden;
    height: 100%;
  }
  #Carousel .CarouselItem > img {
    object-fit: cover;
    height: 100%;
  }
  #Carousel .CarouselItem > .card-body {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #Carousel .CarouselItem:hover {
    cursor: pointer;
    background-color: #f1f1f1;
  }
  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #9a9a9a;
  }
</style>
