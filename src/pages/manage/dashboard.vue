<template>
  <section id="DashBoard" class="AdminContent">
    <div class="container">
      <div class="d-flex align-items-center p-3 my-3 bg-success text-white rounded shadow-sm">
        <img class="mr-3" :src="$store.state.profile.website.LogoAlt.Url" alt="" width="48" height="48">
        <div class="lh-100">
          <h5 class="mb-0 lh-100">
            {{ $store.state.profile.website.Title[$store.state.language] }}
          </h5>
          <small>網站狀態: 正常運作中</small>
        </div>
      </div>
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
