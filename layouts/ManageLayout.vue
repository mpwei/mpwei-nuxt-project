<template>
  <div class="bg-light">
    <header id="AdminHeader">
      <b-navbar id="MainNav" toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="#" class="site-logo">
          <img :src="Logo" alt="More Patient">
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="MainLeft">
            <template v-for="(value,index) in ManageMenu">
              <b-nav-item v-if="value.Open" :key="index" :active="(index === $route.meta.Taxonomy)" @click="SelectNav(index, value)">
                {{ $t('Manage.Menu.' + index) }}
              </b-nav-item>
            </template>
          </b-navbar-nav>
          <b-navbar-nav class="MainRight ml-auto">
            <b-nav-item v-b-tooltip.hover href="#" right :title="$t('Manage.Alert')">
              <i class="fa fa-bell" />
            </b-nav-item>
            <b-nav-item v-b-tooltip.hover href="#" right :title="$t('Manage.MediaStore')">
              <i class="fa fa-image" />
            </b-nav-item>
            <b-nav-item v-b-tooltip.hover href="#" right :title="$t('Manage.SystemConfig')">
              <i class="fa fa-gear" />
            </b-nav-item>
            <b-nav-item-dropdown v-b-tooltip.hover text="Lang" right :title="$t('Manage.LangSwitcher')">
              <template slot="button-content">
                <i class="fa fa-globe" aria-hidden="true" />
              </template>
              <b-dropdown-item v-for="(data,index) in $store.state.locales" :key="index" @click="ChangeLanguage(data)">
                {{ $t("Language." + data) }}
              </b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <template v-slot:button-content>
                <i class="fa fa-ellipsis-v" aria-hidden="true" />
              </template>
              <b-dropdown-item href="#">
                {{ $t('Manage.GoToWebsite') }}
              </b-dropdown-item>
              <b-dropdown-item href="#">
                {{ $t('Manage.AboutSystem') }}
              </b-dropdown-item>
              <b-dropdown-item href="#">
                {{ $t('Manage.Profile') }}
              </b-dropdown-item>
              <b-dropdown-item href="#">
                {{ $t('Manage.ResetPassword') }}
              </b-dropdown-item>
              <b-dropdown-item href="#" @click="Logout">
                {{ $t('Manage.Logout') }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-nav id="SubNav" class="nav-submenu shadow-sm">
        <template v-for="(SubNav, index) in SubNavs">
          <b-nav-item :key="index" :to="SubNav.Path">
            {{ $t('Manage.Menu.' + index) }}
          </b-nav-item>
        </template>
      </b-nav>
    </header>
    <nuxt />
</div>
</template>

<script>
import { Firestore } from '@/plugins/firebase'
import '~/assets/css/manage.css'

export default {
  fetch ({ store, params }) {
    // The fetch method is used to fill the store before rendering the page
  },
  data () {
    return {
      Logo: 'images/logo_icon_w.png',
      ManageMenu: {
        DashBoard: {
          Open: true,
          Sub: false,
          Path: '/manage/dashboard'
        },
        Theme: {
          Open: 'true',
          Sub: {
            ThemeCarousel: {
              Open: true,
              Path: '/manage/theme/carousel'
            },
            ThemeCustomMenu: {
              Open: true,
              Path: '/manage/theme/menu'
            }
          }
        },
        Order: {
          Open: false,
          Sub: false,
          Path: '/manage/order/list'
        },
        Product: {
          Open: false,
          Sub: {
            ProductList: {
              Open: true,
              Path: '/manage/product/list'
            },
            ProductAdd: {
              Open: true,
              Path: '/manage/product/add'
            },
            ProductCategory: {
              Open: true,
              Path: '/manage/product/category'
            },
            ProductAddCategory: {
              Open: true,
              Path: '/manage/product/add_category'
            }
          }
        },
        Post: {
          Open: true,
          Sub: {
            PostList: {
              Open: true,
              Path: '/manage/post/list'
            },
            PostAdd: {
              Open: true,
              Path: '/manage/post/add'
            },
            PostCategory: {
              Open: true,
              Path: '/manage/post/category'
            },
            PostAddCategory: {
              Open: true,
              Path: '/manage/post/add_category'
            }
          }
        },
        Member: {
          Open: false,
          Sub: {
            MemberList: {
              Open: true,
              Path: '/manage/member/list'
            },
            MemberAdd: {
              Open: true,
              Path: '/manage/member/add'
            },
            AdminList: {
              Open: true,
              Path: '/manage/admin/list'
            },
            AdminAdd: {
              Open: true,
              Path: '/manage/admin/add'
            },
            MemberGroup: {
              Open: false,
              Path: '/manage/member/group'
            },
            AdminGroup: {
              Open: false,
              Path: '/manage/admin/group'
            },
            AdminPermission: {
              Open: false,
              Path: '/manage/admin/permission'
            }
          }
        },
        MessageCenter: {
          Open: false,
          Sub: {
            Customer: {
              Open: true,
              Path: '/manage/message/customer'
            },
            System: {
              Open: true,
              Path: '/manage/message/system'
            }
          }
        }
      },
      SubNavs: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.Init().then(() => {
        this.$nuxt.$loading.finish()
      }).catch(() => {
        this.$nuxt.$loading.finish()
      })
    })
  },
  methods: {
    Init () {
      return Promise.all([
        this.GetLogo()
      ])
    },
    GetLogo () {
      return this.$Firebase('storage').ref().child(this.Logo).getDownloadURL().then((_URL) => {
        this.$store.commit('SetLogo', _URL)
      }).catch((e) => {
        console.error(e)
      })
    },
    ChangeLanguage (_Language) {
      this.$store.commit('SetLang', _Language)
      this.$i18n.locale = this.$store.state.language
    },
    SelectNav (_Index, _Value) {
      this.SubNavs = []
      if (_Value.Sub) {
        this.SubNavs = _Value.Sub
      } else {
        this.$router.push(_Value.Path)
      }
    },
    Logout () {
      this.$Firebase('auth').signOut().then((_Response) => {
        this.$Swal.fire({
          icon: 'success',
          title: this.$t('Message.Success'),
          text: this.$t('Message.Manage.logout/success-logout')
        })
        this.$router.push('/manage/login')
      }).catch((_Error) => {
        this.$Swal.fire({
          icon: 'error',
          title: this.$t('Message.Error'),
          text: this.$t('Message.Manage.auth/unexpected-error')
        })
      })
    }
  }
}
</script>
