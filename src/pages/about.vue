<template>
  <div class="container">
    {{ PostData }}
  </div>
</template>

<script>
import { Firestore } from '@/plugins/firebase'

export default {
  layout: 'UserLayout',
  fetch ({ store, params }) {
  },
  async asyncData (_Context) {
    const PostData = []
    let Title = _Context.app.head.title
    let Description = ''
    await Firestore.collection('PostDetail').doc('about').get().then((doc) => {
      PostData.push(doc.data())
      Title = doc.data().Title[_Context.store.state.language]
      Description = doc.data().Description[_Context.store.state.language]
    })
    return {
      PostData,
      Title,
      Description
    }
  },
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
      title: this.Title,
      meta: [
        { hid: 'description', name: 'description', content: this.Description }
      ]
    }
  }
}
</script>
