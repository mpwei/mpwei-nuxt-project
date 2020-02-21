<template>
  <div class="container">
    {{ $route.name }}
    {{ $route.path }}
    {{ $route.params }}

    {{ PostData }}
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
	  const PostData = []
	  let Title = _Context.app.head.title
	  let Description = ''
	  await Firestore.collection('PostDetail').doc(_Context.route.params.slug).get().then((doc) => {
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
  methods: {},
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
