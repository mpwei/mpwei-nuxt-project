<template>
  <div class="container py-4">
    <div class="row ArticleList">
      <div v-for="(value,index) in PostList" :key="index" class="col-lg-4 col-md-6 col-12">
        <b-card no-body class="rounded-0">
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
      </div>
    </div>
    <infinite-loading v-if="(PostList.length > 0)" @infinite="infiniteHandler">
      <div slot="no-results" class="mt-5 text-dark font-weight-bold">
        {{ $t('Global.NoMore') }}
      </div>
      <div slot="no-more" class="mt-5 text-dark font-weight-bold">
        {{ $t('Global.NoMore') }}
      </div>
    </infinite-loading>
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
    async asyncData ({ route }) {
      const PostList = []
      const Limit = 9
      await Firestore.collection('Posts').where('State', '==', '1').orderBy('PostTime', 'desc').limit(Limit).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          PostList.push(doc.data())
        })
      })
      return {
        PostList,
        Limit
      }
    },
    middleware: [
      'ChenkMaintenance'
    ],
    data () {
      return {
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
    mounted () {},
    methods: {
      infiniteHandler ($state) {
        // 時間需轉換成Firestore支援的格式
        let LastPostTime = this.PostList[(this.PostList.length - 1)].PostTime
        LastPostTime = this.$Firebase('app').firestore.Timestamp.fromMillis(LastPostTime.seconds * 1000)
        const Query = Firestore.collection('Posts').where('State', '==', '1')
          .orderBy('PostTime', 'desc').startAfter(LastPostTime).limit(this.Limit)
        Query.get().then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
              if (doc.exists) {
                this.PostList.push(doc.data())
              }
            })
            $state.loaded()
          } else {
            $state.complete()
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    head () {
      // Set Meta Tags for this Page
    }
  }
</script>
