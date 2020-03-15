<template>
  <section id="Setting" class="AdminContent">
    <div class="container">
      123
    </div>
  </section>
</template>

<script>
import { Firestore } from '@/plugins/firebase'

export default {
  layout: 'ManageLayout',
  middleware: [
    'ManageAuth'
  ],
  fetch ({ store, params }) {
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
  },
  methods: {
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
