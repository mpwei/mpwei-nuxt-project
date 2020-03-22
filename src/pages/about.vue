<template>
  <div class="container">
    <section :id="$route.params.slug" class="post my-4">
      <div class="row justify-content-center">
        <div class="col-lg-9">
          <h1 class="font-weight-bold h2">
            {{ PostData.Title[this.$store.state.language] }}
          </h1>
          <hr>
          <div class="content" v-html="PostData.Content[this.$store.state.language]" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Firestore } from '@/plugins/firebase'

export default {
  layout: 'UserLayout',
  fetch ({ store, params }) {
  },
  async asyncData (_Context) {
    let PostData = []
    let Title = _Context.app.head.title
    let Description = ''
    await Firestore.collection('PostDetail').doc('about').get().then((doc) => {
      PostData = doc.data()
      Title = doc.data().Title
      Description = doc.data().Description
    })
    return {
      PostData,
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
  methods: {
  },
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
