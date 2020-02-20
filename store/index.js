import { Firestore } from '@/plugins/firebase'

export const state = () => ({
  locales: ['zh-tw', 'en-us'],
  language: 'zh-tw',
  loading: false,
  profile: {
    logo: '',
    menu: [],
    website: {
      Designer: [],
      Subtitle: [],
      Title: [],
      Year: 1970
    }
  },
  manage: {
    login: false,
    uid: '',
    data: []
  }
})

export const mutations = {
  SetLang (state, locale) {
    if (state.locales.includes(locale)) {
      state.language = locale
    }
  },
  SetWebConfig (_State, Config) {
    _State.profile.website = Config
  },
  SetMenu (_State, Menu) {
    _State.profile.menu = Menu
  },
  SetLogo (_State, URL) {
    _State.profile.logo = URL
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch }, context) {
    await dispatch('GetWebConfig', context)
    await dispatch('GetMenu', context)
  },
  async GetMenu ({ commit }) {
    const Menu = []
    await Firestore.collection('Menu').where('Open', '==', true).orderBy('No', 'asc').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Menu.push(doc.data())
      })
      commit('SetMenu', Menu)
    }).catch((e) => {
      console.log(e)
    })
  },
  async GetWebConfig ({ commit }) {
    await Firestore.collection('Config').doc('Website').get().then((doc) => {
      commit('SetWebConfig', doc.data())
    }).catch((e) => {
      console.log(e)
    })
  }
}
