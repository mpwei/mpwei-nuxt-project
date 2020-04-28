<template>
  <div id="AdminLogin">
    <section class="container my-lg-5">
      <form class="form-signin" @submit.prevent="DoLogin">
        <div class="mb-4">
          <img :src="$store.state.profile.website.Logo.Url" :alt="$store.state.profile.website.Title[$store.state.language]" class="mb-4 mx-auto d-block">
          <h1 class="text-center h3 mb-3 font-weight-bold">
            {{ $t('Manage.ManageLogin') }}
          </h1>
          <b-alert
            class="shadow"
            :show="Error"
            :variant="Variant"
            fade
            dismissible
            @dismissed="Error = false">
            {{ ErrorMessage }}
          </b-alert>
        </div>

        <div class="form-label-group">
          <input
            id="inputEmail"
            v-model="Account"
            type="email"
            class="form-control shadow"
            :placeholder="$t('Manage.Account')"
            required
            autofocus>
          <label for="inputEmail">{{ $t('Manage.Account') }}</label>
        </div>

        <div class="form-label-group">
          <input
            id="inputPassword"
            v-model="Password"
            type="password"
            class="form-control shadow"
            :placeholder="$t('Manage.Password')"
            required>
          <label for="inputPassword">{{ $t('Manage.Password') }}</label>
        </div>
        <div class="checkbox mb-3">
          <label>
            <input v-model="RememberMe" type="checkbox" value="remember-me">
            {{ $t('Manage.Remember') }}
          </label>
        </div>
        <button class="btn btn-lg btn-dark btn-block shadow" type="submit">
          {{ $t('Manage.Login') }}
        </button>
        <p class="mt-5 mb-3 text-muted text-center">
          Copyright © {{ $store.state.profile.website.Year }} {{ $store.state.profile.website.Title[$store.state.language] }}
        </p>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  fetch ({ store, params }) {
  },
  asyncData (context) {
  },
  data () {
    return {
      Account: '',
      Password: '',
      RememberMe: true,
      Error: false,
      ErrorMessage: '',
      Variant: 'danger'
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
        this.CheckAuth()
      ])
    },
    DoLogin () {
      this.$nuxt.$loading.start()
      this.$Firebase('firestore').collection('Member').where('Account', '==', this.Account).where('Identity', '==', 'Master').get().then((_Document) => {
        if (_Document.empty) {
          this.$nuxt.$loading.finish()
          this.Error = true
          this.Variant = 'danger'
          this.ErrorMessage = this.$t('Message.Manage.auth/user-not-found')
        } else {
          this.$Firebase('auth').signInWithEmailAndPassword(this.Account, this.Password).then((_Response) => {
            this.WriteRecord(_Response).then(() => {
              this.$nuxt.$loading.finish()
              this.$router.push('/manage/dashboard')
            }).catch((_Error) => {
              this.$nuxt.$loading.finish()
              this.Error = _Error.Error
              this.Variant = _Error.Variant
              this.ErrorMessage = _Error.ErrorMessage
            })
          }).catch((_Error) => {
            this.$nuxt.$loading.finish()
            this.Error = true
            this.Variant = 'danger'
            this.ErrorMessage = this.$t('Message.Manage.' + _Error.code)
          })
        }
      }).catch((_Error) => {
        this.$nuxt.$loading.finish()
        this.Error = true
        this.Variant = 'danger'
        this.ErrorMessage = this.$t('Message.Manage.auth/unexpected-error') + ': ' + _Error
      })
    },
    CheckAuth () {
      return this.$store.dispatch('AuthWatcher').then(() => {
        this.$router.push('/manage/dashboard')
      }).catch(() => {
        if (this.$route.query.redirect) {
          this.Error = true
          this.Variant = 'info'
          this.ErrorMessage = this.$t('Message.Manage.auth/expired')
        }
      })
    },
    WriteRecord (_Response, _Operation = 'Login') {
      return this.$Firebase('firestore').collection('LoginRecord').add({
        Account: this.Account,
        Uid: _Response.user.uid,
        Operation: _Operation,
        Time: _Response.user.metadata.b
      }).catch((_Error) => {
        _Error({
          Error: true,
          Variant: 'danger',
          ErrorMessage: this.$t('Message.Manage.auth/unexpected-error') + ': ' + _Error
        })
      })
    }
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
