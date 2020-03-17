<template>
  <section id="Carousel" class="AdminContent">
    <div class="container">
      <div class="my-3 p-3 bg-white rounded shadow-sm">
        <h1 class="font-weight-bold border-bottom pb-3 h4 mb-3">
          {{ $t('Manage.Menu.ThemeCarousel') }}
        </h1>
        <div v-if="Loading" class="text-center p-5">
          <b-spinner label="Loading..." />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    layout: 'ManageLayout',
    middleware: [
      'ManageAuth'
    ],
    data () {
      return {
        Carousel: [],
        Loading: true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        this.Init().then(() => {
          this.$nuxt.$loading.finish()
          this.Loading = false
        }).catch(() => {
          this.$nuxt.$loading.finish()
        })
      })
    },
    methods: {
      Init () {
        return Promise.all([
          this.GetCarousel()
        ])
      },
      GetCarousel () {
        this.List = []
        return this.$Firebase('firestore').collection('Config').doc('Carousel').get().then((Document) => {
          this.Carousel = Document.data().Data
        }).catch((_Error) => {
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.post/list-fail-to-get') + ': ' + _Error
          })
        })
      },
      RemovePost (_Slug) {
        this.$Swal.fire({
          icon: 'warning',
          title: this.$t('Message.AskDelete'),
          text: this.$t('Message.Manage.post/delete-confirm'),
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: this.$t('Global.Confirm'),
          cancelButtonText: this.$t('Global.Cancel')
        }).then((Result) => {
          if (Result.value) {
            const Firestore = this.$Firebase('firestore')
            const PostsRef = Firestore.collection('Posts').doc(_Slug)
            const PostDetailRef = Firestore.collection('PostDetail').doc(_Slug)
            Firestore.runTransaction((Transaction) => {
              return Promise.all([
                Transaction.delete(PostsRef),
                Transaction.delete(PostDetailRef)
              ])
            }).then(() => {
              this.$Swal.fire({
                icon: 'success',
                title: this.$t('Message.Success'),
                text: this.$t('Message.Manage.post/delete-success')
              }).then(() => {
                this.Init()
              })
            }).catch((_Error) => {
              this.$Swal.fire({
                icon: 'error',
                title: this.$t('Message.Error'),
                text: this.$t('Message.Manage.post/delete-fail') + ': ' + _Error
              })
            })
          }
        })
      }
    },
    head () {
      // Set Meta Tags for this Page
    }
  }
</script>
