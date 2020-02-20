<template>
  <div class="container">
    {{ $route.name }}
    {{ $route.path }}
    {{ $route.params }}
  </div>
</template>

<script>
import { Firestore } from '@/plugins/firebase'

export default {
  layout: 'UserLayout',
  validate ({ params }) {
    return /^[a-zA-Z0-9_-]+$/.test(params.slug)
  },
  fetch () {
    // The fetch method is used to fill the store before rendering the page
  },
  asyncData (context) {
    // called every time before loading the component
    return {
      name: 'COSMOS'
    }
  },
  data () {
    return {
      name: '123',
      text: ''
    }
  },
  mounted () {
    console.log(this.$route)
  },
  methods: {},
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
