<template>
  <section id="PostAddCategory" class="AdminContent">
    <div class="container">
      <form class="fs-form-sm position-relative" @submit.prevent="SaveData">
        <div v-if="Loading" class="text-center p-5 position-absolute w-100 h-100 ContentLoading">
          <b-spinner label="Loading..." />
        </div>
        <div class="row text-secondary">
          <div class="mb-2 col-lg-9 col-md-8 col-12">
            <div class="mb-4 p-3 bg-white rounded shadow-sm fs-form-sm">
              <div class="border-bottom pb-3 mb-3 d-flex justify-content-between">
                <h1 class="font-weight-bold text-dark h4 mb-0">
                  {{ $t('Manage.Menu.PostAddCategory') }}
                </h1>
                <div class="PostLang">
                  <img
                    v-for="(value, key) in $store.state.locales"
                    :key="key"
                    :src="require('~/assets/img/language/' + value + '.png')"
                    class="mx-1"
                    :class="{'active': NowLanguage === value }"
                    @click="NowLanguage = value">
                </div>
              </div>
              <div class="row text-secondary">
                <div class="mb-2 col-lg-6 col-12">
                  <div class="row my-1">
                    <div class="col-sm-3">
                      <label for="Title" class="my-1">{{ $t('Manage.Post.PostAddCategory/Name') }}</label>
                    </div>
                    <div class="col-sm-9">
                      <b-form-input id="Title" v-model="CategoryData.Name[NowLanguage]" size="sm" :state="null" />
                    </div>
                  </div>
                </div>
                <div class="mb-2 col-lg-6 col-12">
                  <div class="row my-1">
                    <div class="col-sm-3">
                      <label for="Slug" class="my-1">{{ $t('Manage.Post.PostAddCategory/Slug') }}</label>
                    </div>
                    <div class="col-sm-9">
                      <b-form-input id="Slug" v-model="CategoryData.Slug" size="sm" :state="null" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-3 p-3 bg-white rounded shadow-sm fs-form-sm">
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAddCategory/Excerpt') }}
              </h6>
              <b-form-textarea
                v-model="CategoryData.Excerpt[NowLanguage]"
                rows="7"
                size="sm"
              />
            </div>
          </div>
          <div class="col-lg-3 col-md-4 col-12 mb-2">
            <div class="mb-3 p-3 bg-white rounded shadow-sm fs-form-sm">
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAddCategory/State') }}
              </h6>
              <div class="mb-4">
                <b-form-select v-model="CategoryData.State" size="sm">
                  <b-form-select-option value="1">
                    {{ $t('Manage.Post.PostAddCategory/Show') }}
                  </b-form-select-option>
                  <b-form-select-option value="0">
                    {{ $t('Manage.Post.PostAddCategory/Hide') }}
                  </b-form-select-option>
                </b-form-select>
              </div>
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAddCategory/SEO') }}
              </h6>
              <div class="mb-4">
                <b-form-group :label="$t('Manage.Post.PostAddCategory/Description')" label-for="Description">
                  <b-form-textarea
                    id="Description"
                    v-model="CategoryData.Description[NowLanguage]"
                    rows="3"
                    size="sm"
                   />
                </b-form-group>
                <b-form-group :label="$t('Manage.Post.PostAddCategory/Keyword')" label-for="Keyword">
                  <b-form-input id="Keyword" v-model="CategoryData.Keyword[NowLanguage]" size="sm" type="text" :placeholder="$t('Manage.Post.PostAddCategory/KeywordPlaceholder')" />
                </b-form-group>
              </div>
              <b-button variant="success" block size="sm" type="submit">
                {{ $t('Manage.Post.PostAdd/Save') }}
              </b-button>
            </div>
          </div>
        </div>
      </form>
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
        NowLanguage: '',
        Languages: [],
        Loading: true,
        CategoryData: {
          Name: {},
          Slug: '',
          State: 1,
          Description: {},
          Keyword: {},
          Excerpt: {}
        },
        Mode: 'add',
        File: null
      }
    },
    mounted () {
      this.NowLanguage = this.$store.state.language
      this.Languages = this.$store.state.locales
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
          this.GetCategory()
        ])
      },
      GetCategory () {
        if (!this.$route.params.slug) {
          return
        }
        this.$Firebase('firestore').collection('PostCategory').doc(this.$route.params.slug).get().then((Document) => {
          this.Mode = 'edit'
          this.CategoryData.Name = Document.data().Name
          this.CategoryData.Slug = Document.data().Slug
          this.CategoryData.State = Document.data().State
          this.CategoryData.Excerpt = Document.data().Excerpt
          this.CategoryData.Description = Document.data().Description
          this.CategoryData.Keyword = Document.data().Keyword
        })
      },
      async SaveData () {
        if (this.CategoryData.Slug === '') {
          await this.$Swal.fire({
            icon: 'warning',
            title: this.$t('Message.Warning'),
            text: this.$t('Message.Manage.post/slug-null')
          })
          return
        }
        const PostsRef = this.$Firebase('firestore').collection('PostCategory').doc(this.CategoryData.Slug)
        const CategoryData = {
          Name: this.CategoryData.Name,
          Slug: this.CategoryData.Slug,
          State: this.CategoryData.State,
          Excerpt: this.CategoryData.Excerpt,
          Description: this.CategoryData.Description,
          Keyword: this.CategoryData.Keyword
        }
        await this.$Firebase('firestore').runTransaction((Transaction) => {
          return Promise.all([
            Transaction.get(PostsRef).then((Document) => {
              switch (this.Mode) {
                case 'add':
                  if (Document.exists) {
                    throw new Error('Document has existed!')
                  }
                  Transaction.set(PostsRef, CategoryData)
                  break
                case 'edit':
                  if (!Document.exists) {
                    throw new Error('Document does not exist!')
                  }
                  Transaction.update(PostsRef, CategoryData)
                  break
                default:
                  throw new Error('Wrong mode!')
              }
            })
          ])
        }).then(() => {
          this.$Swal.fire({
            icon: 'success',
            title: this.$t('Message.Success'),
            text: this.$t('Message.Manage.post-category/save-success')
          }).then(() => {
            if (this.Mode === 'add') {
              this.$router.push({
                name: 'PostEditCategory',
                params: { slug: this.CategoryData.Slug }
              })
            }
          })
        }).catch((_Error) => {
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.post-category/save-fail') + ': ' + _Error
          })
        })
      }
    },
    head () {
      // Set Meta Tags for this Page
    }
  }
</script>
