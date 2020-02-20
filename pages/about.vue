<template>
  <div class="container">
    <div>
      <h2 class="subtitle">
        aaaaa
      </h2>
    </div>
  </div>
</template>

<script>
import { Firestore } from '@/plugins/firebase'

export default {
  layout: 'UserLayout',
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
  mounted () {},
  methods: {},
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
