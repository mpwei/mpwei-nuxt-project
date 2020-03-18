<template>
  <section id="PostAdd" class="AdminContent">
    <div class="container">
      <form class="fs-form-sm position-relative" @submit.prevent="SaveData">
        <div v-if="Loading" class="text-center p-5 position-absolute w-100 h-100 ContentLoading">
          <b-spinner label="Loading..." />
        </div>
        <div class="my-3 p-3 bg-white rounded shadow-sm fs-form-sm">
          <div class="border-bottom pb-3 mb-3 d-flex justify-content-between">
            <h1 class="font-weight-bold h4 mb-0">
              {{ $t('Manage.Menu.PostAdd') }}
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
                  <label for="Title" class="my-1">{{ $t('Manage.Post.PostAdd/Title') }}</label>
                </div>
                <div class="col-sm-9">
                  <b-form-input id="Title" v-model="PostData.Title[NowLanguage]" size="sm" :state="null" />
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-lg-6 mb-2">
              <div class="row my-1">
                <div class="col-sm-3">
                  <label for="Slug" class="my-1">{{ $t('Manage.Post.PostAdd/Slug') }}</label>
                </div>
                <div class="col-sm-9">
                  <b-form-input id="Slug" v-model="PostData.Slug" size="sm" :state="null" />
                </div>
              </div>
            </div>
            <div class="mb-2 col-lg-6 col-12">
              <div class="row my-1">
                <div class="col-sm-3">
                  <label for="Tags" class="my-1">{{ $t('Manage.Post.PostAdd/Tags') }}</label>
                </div>
                <div class="col-sm-9">
                  <b-form-tags
                    v-model="PostData.Tags"
                    input-id="tags-pills"
                    tag-variant="dark"
                    size="sm"
                    separator=" "
                    :add-button-text="$t('Manage.Post.PostAdd/AddTag')"
                    add-button-variant="danger"
                    :placeholder="$t('Manage.Post.PostAdd/TagPlaceholder')"
                  />
                </div>
              </div>
            </div>
            <div class="mb-2 col-lg-6 col-12">
              <div class="row my-1">
                <div class="col-sm-3">
                  <label for="Category" class="my-1">{{ $t('Manage.Post.PostAdd/Category') }}</label>
                </div>
                <div class="col-sm-9">
                  <b-form-select v-model="PostData.Category" size="sm" :options="Categories" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row text-secondary">
          <div class="mb-2 col-lg-9 col-md-8 col-12">
            <div class="my-3 p-3 bg-white rounded shadow-sm fs-form-sm">
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAdd/Content') }}
              </h6>
              <VueEditor v-model="PostData.Content[NowLanguage]" class="mb-4" />
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAdd/Excerpt') }}
              </h6>
              <b-form-textarea
                v-model="PostData.Excerpt[NowLanguage]"
                rows="4"
                size="sm"
              />
            </div>
          </div>
          <div class="col-lg-3 col-md-4 col-12 mb-2">
            <div class="my-3 p-3 bg-white rounded shadow-sm fs-form-sm">
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAdd/Cover') }}
              </h6>
              <div class="mb-4">
                <b-img
                        v-if="PostData.Cover!==''"
                        thumbnail
                        fluid
                        :src="PostData.Cover"
                        class="mb-3" />
                <b-form-file
                        v-model="File"
                        accept=".jpg, .png, .gif"
                        size="sm"
                        :browse-text="$t('Manage.Post.PostAdd/Browse')"
                        :placeholder="$t('Manage.Post.PostAdd/UploadPlaceholder')"
                        :rop-placeholder="$t('Manage.Post.PostAdd/DropPlaceholder')"
                        @input="UploadImage" />
              </div>
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAdd/State') }}
              </h6>
              <div class="mb-4">
                <b-form-select v-model="PostData.State" size="sm">
                  <b-form-select-option value="1">
                    {{ $t('Manage.Post.PostAdd/Show') }}
                  </b-form-select-option>
                  <b-form-select-option value="0">
                    {{ $t('Manage.Post.PostAdd/Hide') }}
                  </b-form-select-option>
                </b-form-select>
              </div>
              <h6 class="font-weight-bold text-dark border-bottom pb-2 mb-3">
                {{ $t('Manage.Post.PostAdd/SEO') }}
              </h6>
              <div class="mb-4">
                <b-form-group :label="$t('Manage.Post.PostAdd/Description')" label-for="Description">
                  <b-form-textarea
                    id="Description"
                    v-model="PostData.Description[NowLanguage]"
                    rows="3"
                    size="sm"
                   />
                </b-form-group>
                <b-form-group :label="$t('Manage.Post.PostAdd/Keyword')" label-for="Keyword">
                  <b-form-input id="Keyword" v-model="PostData.Keyword[NowLanguage]" size="sm" type="text" :placeholder="$t('Manage.Post.PostAdd/KeywordPlaceholder')" />
                </b-form-group>
                <b-button variant="success" block size="sm" type="submit">
                  {{ $t('Manage.Post.PostAdd/Save') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import { ImagePlugin, FormTagsPlugin, FormFilePlugin } from 'bootstrap-vue'
  Vue.use(ImagePlugin)
  Vue.use(FormTagsPlugin)
  Vue.use(FormFilePlugin)

  let VueEditor
  if (process.client) {
    VueEditor = require('vue2-editor').VueEditor
  }
  export default {
    layout: 'ManageLayout',
    middleware: [
      'ManageAuth'
    ],
    components: {
      VueEditor
    },
    data () {
      return {
        NowLanguage: '',
        Loading: true,
        PostData: {
          Title: {},
          Slug: '',
          Tags: [],
          Category: null,
          Content: {},
          Cover: '',
          State: 1,
          Description: {},
          Keyword: {},
          Excerpt: {}
        },
        Mode: 'add',
        Categories: [
          { value: null, text: this.$t('Manage.Post.PostAdd/CategoryPlaceholder'), disabled: true }
        ],
        File: null
      }
    },
    mounted () {
      this.NowLanguage = this.$store.state.language
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
          this.GetPostCategories(),
          this.GetPost()
        ])
      },
      GetPost () {
        if (!this.$route.params.slug) {
          return
        }
        const PostsRef = this.$Firebase('firestore').collection('Posts').doc(this.$route.params.slug)
        const PostDetailRef = this.$Firebase('firestore').collection('PostDetail').doc(this.$route.params.slug)
        this.$Firebase('firestore').runTransaction((Transaction) => {
          return Promise.all([
            Transaction.get(PostsRef).then((Document) => {
              this.PostData.Title = Document.data().Title
              this.PostData.Slug = Document.data().Slug
              this.PostData.Tags = Document.data().Tags
              this.PostData.Cover = Document.data().Cover
              this.PostData.Category = Document.data().Category
              this.PostData.State = Document.data().State
              this.PostData.Excerpt = Document.data().Excerpt
            }),
            Transaction.get(PostDetailRef).then((Document) => {
              this.PostData.Content = Document.data().Content
              this.PostData.Description = Document.data().Description
              this.PostData.Keyword = Document.data().Keyword
            })
          ])
        }).then(() => {
          this.Mode = 'edit'
        })
      },
      GetPostCategories () {
        return this.$Firebase('firestore').collection('PostCategory').get().then((_Response) => {
          _Response.forEach((doc) => {
            this.Categories.push({
              text: doc.data().Name[this.$store.state.language],
              value: doc.data().Slug
            })
          })
        }).catch((_Error) => {
          console.error(_Error)
        })
      },
      UploadImage () {
      	this.$Firebase('storage').ref('uploads/' + this.File.name).put(this.File).then((response) => {
	        this.$Firebase('storage').ref().child(response.ref.fullPath).getDownloadURL().then((_URL) => {
			    this.PostData.Cover = _URL
		    }).catch((_Error) => {
			    alert(_Error)
		    })
        }).catch((_Error) => {
		      alert(_Error)
        })
      },
      async SaveData () {
        if (this.PostData.Slug === '') {
          await this.$Swal.fire({
            icon: 'warning',
            title: this.$t('Message.Warning'),
            text: this.$t('Message.Manage.post/slug-null')
          })
          return
        }
        // Firebase核心
        const Firestore = this.$Firebase('firestore')
        const FirebaseApp = this.$Firebase('app')
        // Posts集合
        const PostsRef = Firestore.collection('Posts').doc(this.PostData.Slug)
        const PostsData = {
          Title: this.PostData.Title,
          Slug: this.PostData.Slug,
          Tags: this.PostData.Tags,
          Cover: this.PostData.Cover,
          Category: this.PostData.Category,
          State: this.PostData.State,
          PostTime: FirebaseApp.firestore.FieldValue.serverTimestamp(),
          Excerpt: this.PostData.Excerpt
        }
        // PostDetail集合
        const PostDetailRef = Firestore.collection('PostDetail').doc(this.PostData.Slug)
        const PostDetailData = {
          Title: this.PostData.Title,
          Slug: this.PostData.Slug,
          Content: this.PostData.Content,
          Description: this.PostData.Description,
          Keyword: this.PostData.Keyword
        }
        await Firestore.runTransaction((Transaction) => {
          return Promise.all([
            Transaction.get(PostsRef).then((Document) => {
              switch (this.Mode) {
                case 'add':
                  if (Document.exists) {
                    throw new Error('Document has existed!')
                  }
                  Transaction.set(PostsRef, PostsData)
                  break
                case 'edit':
                  if (!Document.exists) {
                    throw new Error('Document does not exist!')
                  }
                  Transaction.update(PostsRef, PostsData)
                  break
                default:
                  throw new Error('Wrong mode!')
              }
            }),
            Transaction.get(PostDetailRef).then((Document) => {
              switch (this.Mode) {
                case 'add':
                  if (Document.exists) {
                    throw new Error('Document has existed!')
                  }
                  Transaction.set(PostDetailRef, PostDetailData)
                  break
                case 'edit':
                  if (!Document.exists) {
                    throw new Error('Document does not exist!')
                  }
                  Transaction.update(PostDetailRef, PostDetailData)
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
            text: this.$t('Message.Manage.post/save-success')
          }).then(() => {
            if (this.Mode === 'add') {
              this.$router.push({
                name: 'PostEdit',
                params: { slug: this.PostData.Slug }
              })
            }
          })
        }).catch((_Error) => {
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.post/save-fail') + ': ' + _Error
          })
        })
      }
    },
    head () {
      // Set Meta Tags for this Page
    }
  }
</script>
