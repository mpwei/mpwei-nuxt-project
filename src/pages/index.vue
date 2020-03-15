<template>
  <div class="container">
    <section v-if="Carousels.length > 0" class="d-none d-md-block my-4">
      <b-carousel
        id="IndexCarousel"
        v-model="CarouselSlide"
        :interval="6000"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide v-for="(value, key) in Carousels" :key="key">
          <div slot="img" class="row no-gutters">
            <div class="col-lg-8">
              <img :src="value.Url" :alt="value.Alt" :title="value.Title" :to="value.Link" class="img-fluid">
            </div>
            <div class="col-lg-4">
              <b-card no-body class="h-100 rounded-0">
                <b-card-body body-tag="article">
                  <b-card-title title-tag="h3" class="h2 font-weight-bold">
                    {{ value.Title }}
                  </b-card-title>
                  <b-card-text>
                    {{ value.Content }}
                  </b-card-text>
                </b-card-body>
                <b-card-footer class="bg-white border-0 text-secondary small">
                  <span>Vue.js</span>
                  <span>Firebase</span>
                  <span>2020-01-20</span>
                </b-card-footer>
              </b-card>
            </div>
          </div>
        </b-carousel-slide>
      </b-carousel>
    </section>
    <section class="my-4">
      <b-card-group class="ArticleList" deck>
        <b-card v-for="(value,index) in Posts" :key="index" no-body class="rounded-0" @click="$router.push( { name: 'posts-slug', params: { slug: value.Slug }} )">
          <b-card-img-lazy class="rounded-0" v-bind="mainProps" :src="value.Cover" :alt="value.Title[$store.state.language]" />
          <b-card-body body-tag="article">
            <b-card-title title-tag="h3" class="h4 font-weight-bold">
              {{ value.Title[$store.state.language] }}
            </b-card-title>
            <b-card-text>
              {{ value.Excerpt[[$store.state.language]] }}
            </b-card-text>
          </b-card-body>
          <b-card-footer class="bg-white border-0 text-muted small">
            <span v-for="(tag, subindex) in value.Tags" :key="subindex">{{ tag }}</span>
            <span>{{ $moment.unix(value.PostTime.seconds).format("Y-MM-DD HH:mm:ss") }}</span>
          </b-card-footer>
        </b-card>
        <b-card v-for="number in ComingSoon()" :key="number" no-body class="rounded-0">
          <b-card-body body-tag="article" class="align-items-center d-flex justify-content-center">
            <b-card-title title-tag="h3" class="h4 font-weight-bold">
              Coming Soon
            </b-card-title>
          </b-card-body>
        </b-card>
      </b-card-group>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMoment from 'vue-moment'
import { Firestore } from '@/plugins/firebase'
Vue.use(VueMoment)

export default {
  layout: 'UserLayout',
  fetch ({ store, params }) {
    // The fetch method is used to fill the store before rendering the page
  },
  async asyncData () {
    const Carousels = []
    const Posts = []
    await Firestore.collection('Carousel').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Carousels.push(doc.data())
      })
    })
    await Firestore.collection('Posts').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Posts.push(doc.data())
      })
    })
    return {
      Carousels,
      Posts
    }
  },
  data () {
    return {
      Carousels: [],
      CarouselSlide: 0,
      CarouselSliding: null,
      mainProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: '#999',
        block: true,
        blankWidth: 600,
        blankHeight: 400
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
      ])
    },
    onSlideStart () {
      this.CarouselSliding = true
    },
    onSlideEnd () {
      this.CarouselSliding = false
    },
    ComingSoon (_Column = 3) {
      return parseInt(_Column - this.Posts.length)
    }
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
