<template>
  <div class="container">
    <section v-if="Carousels.length > 0" id="IndexCarousel" class="d-none d-md-block mt-4 mb-5">
      <div v-for="(value, key) in Carousels" :key="key" slot="img" class="row no-gutters mb-3">
        <div class="col-lg-8">
          <nuxt-link :to="value.Link">
            <img :src="value.Url" :alt="value.Alt" :title="value.Title[$store.state.language]" class="img-fluid">
          </nuxt-link>
        </div>
        <div class="col-lg-4">
          <b-card no-body class="h-100 rounded-0">
            <b-card-body body-tag="article">
              <b-card-title title-tag="h3" class="h3 mb-4 font-weight-bold">
                <nuxt-link tag="a" class="text-dark" :to="value.Link">
                  {{ value.Title[$store.state.language] }}
                </nuxt-link>
              </b-card-title>
              <b-card-text class="text-secondary text-justify">
                {{ value.Content[$store.state.language] }}
              </b-card-text>
            </b-card-body>
            <b-card-footer class="bg-white border-0 text-secondary small">
              <span v-for="(tag, num) in value.Tags" :key="num">{{ tag }}</span>
            </b-card-footer>
          </b-card>
        </div>
      </div>
    </section>
    <section class="my-4">
      <h2 class="font-weight-bold mb-4 pb-3 h3 border-bottom">
        {{ $t('Index.LatestPosts') }}
      </h2>
      <b-card-group class="ArticleList" deck>
        <b-card v-for="(value,index) in Posts" :key="index" no-body class="rounded-0">
          <nuxt-link tag="a" class="text-dark d-block" :to="{ name: 'posts-slug', params: { slug: value.Slug }}">
            <b-card-img-lazy class="rounded-0" v-bind="mainProps" :src="value.Cover" :alt="value.Title[$store.state.language]" />
          </nuxt-link>
          <b-card-body body-tag="article">
            <b-card-title title-tag="h3" class="h4 font-weight-bold">
              <nuxt-link tag="a" class="text-dark d-block" :to="{ name: 'posts-slug', params: { slug: value.Slug }}">
                {{ value.Title[$store.state.language] }}
              </nuxt-link>
            </b-card-title>
            <b-card-text class="text-secondary text-justify">
              {{ value.Excerpt[[$store.state.language]] }}
            </b-card-text>
          </b-card-body>
          <b-card-footer class="bg-white border-0 text-muted small">
            <span v-for="(tag, subindex) in value.Tags" :key="subindex">{{ tag }}</span>
            <span>{{ $dayjs.unix(value.PostTime.seconds).format("YYYY-MM-DD") }}</span>
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
import { CardPlugin } from 'bootstrap-vue'
import { Firestore } from '@/plugins/firebase'
Vue.use(CardPlugin)

export default {
  layout: 'UserLayout',
  fetch ({ store, params }) {
    // The fetch method is used to fill the store before rendering the page
  },
  async asyncData () {
    let Carousels = []
    const Posts = []
    await Firestore.collection('Config').doc('Carousel').get().then((doc) => {
      Carousels = doc.data().Data
    })
    await Firestore.collection('Posts').where('State', '==', '1').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Posts.push(doc.data())
      })
    })
    return {
      Carousels,
      Posts
    }
  },
  middleware: [
    'ChenkMaintenance'
  ],
  data () {
    return {
      Carousels: [],
      // CarouselSlide: 0,
      // CarouselSliding: null,
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
    // onSlideStart () {
    //   this.CarouselSliding = true
    // },
    // onSlideEnd () {
    //   this.CarouselSliding = false
    // },
    ComingSoon (_Column = 3) {
      return parseInt(_Column - this.Posts.length)
    }
  },
  head () {
    return {
      title: this.$store.state.profile.website.Title[this.$store.state.language] + '｜' + this.$store.state.profile.website.Subtitle[this.$store.state.language],
      meta: [
        { hid: 'description', name: 'description', content: this.$store.state.profile.website.SEO.Description[this.$store.state.language] }
      ]
    }
  }
}
</script>
