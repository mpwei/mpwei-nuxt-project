<template>
  <div class="container">
    <div>
      <logo />
      <img src="https://firebasestorage.googleapis.com/v0/b/mpwei-2889f.appspot.com/o/images%2Flogo_icon.png?alt=media&token=f0882d45-264c-41a0-acdf-753c4300bb8f" alt="">
      <img v-lazy="'https://firebasestorage.googleapis.com/v0/b/mpwei-2889f.appspot.com/o/images%2Flogo_icon.png?alt=media&token=f0882d45-264c-41a0-acdf-753c4300bb8f'" alt="">
      <h1 class="title">
        {{ name }}
      </h1>
      <h2 class="subtitle">
        My wonderful Nuxt.js project
      </h2>
      <div class="links">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
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
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.Init().then(() => {
        this.$nuxt.$loading.finish()
        this.$Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Good'
        })
      }).catch(() => {
        this.$nuxt.$loading.finish()
        this.$Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Bad'
        })
      })
    })
  },
  methods: {
    Init () {
      return Promise.all([
        this.readFromFirestore()
      ])
    },
    readFromFirestore () {
      return this.$Firebase('firestore').collection('Config').doc('Website').get().then((r) => {
        this.text = r.data()
        console.log(this.text)
      }).catch((e) => {
        console.error(e)
      })
    }
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
