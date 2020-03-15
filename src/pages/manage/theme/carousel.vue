<template>
  <section id="PostList" class="AdminContent">
    <div class="container">
      <div class="my-3 p-3 bg-white rounded shadow-sm">
        <h1 class="font-weight-bold border-bottom pb-3 h4 mb-3">
          {{ $t('Manage.Menu.PostList') }}
        </h1>
        <div v-if="Loading" class="text-center p-5">
          <b-spinner label="Loading..." />
        </div>
        <b-table
          v-if="(List.length > 0 && !Loading)"
          hover
          borderless
          :items="List"
          :fields="Fields"
          head-variant="dark"
          class="mb-0 fs-form-sm">
          <template v-slot:cell(Title)="row">
            {{ row.item.Title[$store.state.language] }}
          </template>
          <template v-slot:cell(Tags)="row">
            <b-badge v-for="(value, index) in row.item.Tags" :key="index" variant="secondary" pill class="mr-1 mb-1">
              {{ value }}
            </b-badge>
          </template>
          <template v-slot:cell(Action)="row">
            <b-button size="sm" class="mr-2" @click="$router.push({ name: 'PostEdit', params: { slug: row.item.Slug }})">
              <i class="fa fa-edit" />
            </b-button>
            <b-button variant="danger" size="sm" @click="RemovePost(row.item.Slug)">
              <i class="fa fa-remove" />
            </b-button>
          </template>
        </b-table>
        <div v-if="(List.length === 0 && !Loading)" class="text-center p-5">
          {{ $t('Message.Manage.post/no-category') }}
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
        List: [],
        Loading: true
      }
    },
    computed: {
      Fields () {
        return [
          { key: 'Title', label: this.$t('Manage.Post.PostList/Title') },
          { key: 'Slug', label: this.$t('Manage.Post.PostList/Slug') },
          { key: 'PostTime', label: this.$t('Manage.Post.PostList/PostTime') },
          { key: 'Tags', label: this.$t('Manage.Post.PostList/Tags') },
          { key: 'Action', label: this.$t('Manage.Post.PostList/Action') }
        ]
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
          this.GetPostList()
        ])
      },
      GetPostList () {
        this.List = []
        return this.$Firebase('firestore').collection('Posts').orderBy('PostTime', 'desc').get().then((_Response) => {
          _Response.forEach((doc) => {
            this.List.push({
              ID: doc.id,
              Title: doc.data().Title,
              Slug: doc.data().Slug,
              PostTime: this.$moment.unix(doc.data().PostTime.seconds).format('Y-MM-DD HH:mm:ss'),
              Tags: doc.data().Tags
            })
          })
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
