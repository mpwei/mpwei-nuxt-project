<template>
  <section id="PostCategory" class="AdminContent">
    <div class="container">
      <div class="my-3 p-3 bg-white rounded shadow-sm">
        <h1 class="font-weight-bold border-bottom pb-3 h4 mb-3">
          {{ $t('Manage.Menu.PostCategory') }}
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
            {{ row.item.Name[$store.state.language] }}
          </template>
          <template v-slot:cell(State)="row">
            <span class="badge" :class="{ 1:'badge-success' , 0:'badge-danger' }[row.item.State]">
              {{ $t('Manage.Post.State.' + row.item.State) }}
            </span>
          </template>
          <template v-slot:cell(Action)="row">
            <b-button size="sm" class="mr-2" @click="$router.push({ name: 'PostEditCategory', params: { slug: row.item.Slug }})">
              <i class="fa fa-edit" />
            </b-button>
            <b-button variant="danger" size="sm" @click="RemoveCategory(row.item.Slug)">
              <i class="fa fa-remove" />
            </b-button>
          </template>
        </b-table>
        <div v-if="(List.length === 0 && !Loading)" class="text-center p-5">
          {{ $t('Message.Manage.post/nodata') }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import { TablePlugin } from 'bootstrap-vue'
  Vue.use(TablePlugin)

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
          { key: 'Title', label: this.$t('Manage.Post.PostCategory/Name') },
          { key: 'Slug', label: this.$t('Manage.Post.PostCategory/Slug') },
          { key: 'State', label: this.$t('Manage.Post.PostCategory/State') },
          { key: 'Action', label: this.$t('Manage.Post.PostCategory/Action') }
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
          this.GetPostCategories()
        ])
      },
      GetPostCategories () {
        this.List = []
        return this.$Firebase('firestore').collection('PostCategory').get().then((_Response) => {
          _Response.forEach((doc) => {
            this.List.push(doc.data())
          })
        }).catch((_Error) => {
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.post/list-fail-to-get') + ': ' + _Error
          })
        })
      },
      RemoveCategory (_Slug) {
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
            this.$Firebase('firestore').collection('PostCategory').doc(_Slug).delete().then(() => {
              this.$Swal.fire({
                icon: 'success',
                title: this.$t('Message.Success'),
                text: this.$t('Message.Manage.post-category/delete-success')
              }).then(() => {
                this.Init()
              })
            }).catch((_Error) => {
              this.$Swal.fire({
                icon: 'error',
                title: this.$t('Message.Error'),
                text: this.$t('Message.Manage.post-category/delete-fail') + ': ' + _Error
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
