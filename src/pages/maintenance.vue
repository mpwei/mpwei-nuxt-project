<template>
  <div class="container">
    網站維護中
  </div>
</template>

<script>
export default {
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
  mounted () {},
  methods: {},
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
