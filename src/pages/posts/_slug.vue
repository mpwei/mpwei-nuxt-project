<template>
  <div class="container">
    <section :id="$route.params.slug" class="post my-4">
      <div class="row justify-content-center">
        <div class="col-lg"></div>
        <div class="col-lg-9">
          <h1 class="font-weight-bold h2 mb-3">
            {{ PostData.Title[this.$store.state.language] }}
          </h1>
          <div class="meta d-flex justify-content-between">
            <div class="tags">
              <b-badge v-for="(value, index) in PostMeta.Tags" :key="index" variant="secondary" class="mr-1 mb-1">
                {{ value }}
              </b-badge>
            </div>
            <div class="update text-muted">
              <i class="fa fa-clock-o mr-2" />{{ $dayjs.unix(PostMeta.PostTime.seconds).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </div>
          <hr>
          <div class="first-letter-big introduction p-3 mb-4">
            {{ PostMeta.Excerpt[this.$store.state.language] }}
          </div>
          <div class="content" v-html="PostData.Content[this.$store.state.language]" />
        </div>
        <div class="col-lg"></div>
      </div>
    </section>
  </div>
</template>

<script>
import { Firestore } from '@/plugins/firebase'

export default {
  layout: 'UserLayout',
  validate ({ params }) {
    return /^[a-zA-Z0-9_-]+$/.test(params.slug)
  },
  fetch ({ store, params }) {
    // The fetch method is used to fill the store before rendering the page
  },
  async asyncData (_Context) {
	  let PostData = []
	  let PostMeta = []
	  let Title = _Context.app.head.title
	  let Description = ''
	  await Firestore.collection('PostDetail').doc(_Context.route.params.slug).get().then((doc) => {
      PostData = doc.data()
      Title = doc.data().Title
      Description = doc.data().Description
    })
    await Firestore.collection('Posts').doc(_Context.route.params.slug).get().then((doc) => {
      PostMeta = doc.data()
    })
	  return {
		  PostData,
      PostMeta,
		  Title,
		  Description
	  }
  },
  middleware: [
    'ChenkMaintenance'
  ],
  data () {
    return {
      PostData: [],
      Title: '',
      Description: ''
    }
  },
  mounted () {
  },
  methods: {},
  head () {
    return {
      title: this.Title[this.$store.state.language] + ' - ' + this.$store.state.profile.website.Title[this.$store.state.language] + '｜' + this.$store.state.profile.website.Subtitle[this.$store.state.language],
      meta: [
        { hid: 'description', name: 'description', content: this.Description[this.$store.state.language] }
      ]
    }
  }
}
</script>
