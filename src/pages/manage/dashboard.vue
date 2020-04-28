<template>
  <section id="DashBoard" class="AdminContent">
    <div class="container">
      <div class="d-flex align-items-center p-3 my-3 rounded shadow-sm" :class="{'bg-success text-white': $store.state.profile.website.OnService === true, 'bg-warning text-dark': $store.state.profile.website.OnService === false}">
        <img class="mr-3" :src="$store.state.profile.website.LogoAlt.Url" alt="" height="48">
        <div class="lh-100">
          <h5 class="font-weight-bold mb-0 lh-100">
            {{ $store.state.profile.website.Title[$store.state.language] }}
          </h5>
          <small>{{ $t('Manage.DashBoard.ServiceStatus') }}: {{ $t('Manage.DashBoard.' + ($store.state.profile.website.OnService ? 'OnService' : 'OffService') ) }}</small>
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
  async fetch ({ store, params }) {
    await store.dispatch('GetWebConfig', store)
  },
  asyncData (context) {
    // called every time before loading the component
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
  head () {
    // Set Meta Tags for this Page
  }
}
</script>
