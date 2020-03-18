<template>
  <section id="ThemeCustomMenu" class="AdminContent">
    <div class="container">
      <b-form @submit.prevent="SaveMenu">
        <div class="my-3 p-3 bg-white rounded shadow-sm">
          <h1 class="font-weight-bold border-bottom pb-3 h4 mb-3">
            {{ $t('Manage.Menu.ThemeCustomMenu') }}
          </h1>
          <div v-if="Loading" class="text-center p-5">
            <b-spinner label="Loading..." />
          </div>
          <draggable
            v-model="MenuList"
            class="list-group"
            tag="ul"
            v-bind="DragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
              <b-card v-for="(Data, Index) in MenuList" :key="Index + 'card'" no-body class="mb-2 shadow-sm">
                <b-card-header header-tag="header" class="p-0 text-left d-flex justify-content-between align-items-center" role="tab">
                  <div class="d-flex align-items-center">
                    <b-button
                      v-b-toggle="'accordion-' + Index"
                      href="#"
                      variant="white"
                      squared>
                    <span>
                      <i class="fa fa-bars mr-2" aria-hidden="true" /> {{ Data.Name[$store.state.language] }}
                    </span>
                    </b-button>
                    <b-form-checkbox v-model="Data.Open" class="mb-0 mr-5" switch size="sm" />
                  </div>
                  <a class="mx-2 px-2" @click="RemoveMenu(Index)">
                    <i class="fa fa-times" aria-hidden="true" />
                  </a>
                </b-card-header>
                <b-collapse :id="'accordion-' + Index" accordion="my-accordion" role="tabpanel">
                  <b-card-body>
                    <b-form-group
                      :label="$t('Manage.Themes.CustomMenu/Name')"
                      label-for="Name"
                    >
                      <b-form-input
                        :id="'Name' + Index"
                        v-model="Data.Name[$store.state.language]"
                        type="text"
                        required
                        size="sm"
                      />
                    </b-form-group>
                    <b-form-group
                      :label="$t('Manage.Themes.CustomMenu/LinkOption')"
                      label-for="LinkOption"
                    >
                      <b-form-select :id="'LinkOption' + Index" v-model="Data.SelectLinkOption" size="sm">
                        <b-form-select-option value="null">
                          {{ $t('Manage.Themes.CustomMenu/LinkOptionPlaceholder') }}
                        </b-form-select-option>
                        <b-form-select-option v-for="(value, index) in LinkOption" :key="index" :value="value">
                          {{ $t('Manage.Themes.CustomMenu/LinkOption' + value) }}
                        </b-form-select-option>
                      </b-form-select>
                    </b-form-group>
                    <b-form-group
                      :label="$t('Manage.Themes.CustomMenu/Url')"
                      label-for="Url"
                    >
                      <b-form-input
                        :id="'Url' + Index"
                        v-model="Data.Url"
                        type="text"
                        required
                        :disabled="Data.SelectLinkOption!=='Custom'"
                        size="sm"
                      />
                    </b-form-group>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </transition-group>
          </draggable>
        </div>
        <div class="my-3 p-3 bg-white rounded shadow-sm d-flex justify-content-between">
          <b-button variant="info" size="sm" type="button" @click="AddMenu">
            <i class="fa fa-plus-circle" aria-hidden="true" /> {{ $t('Manage.Themes.CustomMenu/AddMenu') }}
          </b-button>
          <b-button variant="success" size="sm" type="submit">
            {{ $t('Manage.Themes.CustomMenu/Save') }}
          </b-button>
        </div>
      </b-form>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import { CardPlugin } from 'bootstrap-vue'
  Vue.use(CardPlugin)

  export default {
    layout: 'ManageLayout',
    middleware: [
      'ManageAuth'
    ],
    components: {
      draggable: () => import('vuedraggable')
    },
    data () {
      return {
      	MenuList: [],
        LinkOption: ['Post', 'Custom'],
        Loading: true,
        drag: false
      }
    },
    computed: {
      DragOptions () {
        return {
          animation: 200,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost'
        }
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
          this.GetMenu()
        ])
      },
      GetMenu () {
        this.MenuList = []
        return this.$Firebase('firestore').collection('Config').doc('Website').get().then((Document) => {
	        this.MenuList = Document.data().Menu
        }).catch((_Error) => {
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.theme/get-list-fail') + ': ' + _Error
          })
        })
      },
      AddMenu () {
        this.MenuList.push({ Name: {}, Open: true, Url: '' })
      },
      RemoveMenu (_Index) {
        this.$Swal.fire({
          icon: 'warning',
          title: this.$t('Message.AskDelete'),
          text: this.$t('Message.Manage.theme/delete-confirm'),
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: this.$t('Global.Confirm'),
          cancelButtonText: this.$t('Global.Cancel')
        }).then((Result) => {
          if (Result.value) {
            this.MenuList.splice(_Index, 1)
          }
        })
      },
      async SaveMenu () {
        this.Loading = true
        await this.$Firebase('firestore').collection('Config').doc('Website').set({
          Menu: this.MenuList
        }, { merge: true }).then(() => {
          this.Loading = false
          this.$Swal.fire({
            icon: 'success',
            title: this.$t('Message.Success'),
            text: this.$t('Message.Manage.theme/save-success')
          })
        }).catch((_Error) => {
          this.Loading = false
          this.$Swal.fire({
            icon: 'error',
            title: this.$t('Message.Error'),
            text: this.$t('Message.Manage.theme/save-fail') + ': ' + _Error
          })
        })
      }
    },
    head () {
      // Set Meta Tags for this Page
    }
  }
</script>

<style>
  .button {
    margin-top: 35px;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #9a9a9a;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: move;
  }
  .list-group-item i {
    cursor: pointer;
  }
</style>
© 2020 GitHub, Inc.
