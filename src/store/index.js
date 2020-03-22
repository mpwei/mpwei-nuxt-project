import { Firestore, Auth } from '@/plugins/firebase'

export const state = () => ({
  locales: ['zh-tw', 'en-us'],
  language: 'zh-tw',
  loading: false,
  profile: {
    website: {
      Logo: {},
      LogoAlt: {},
      Subtitle: [],
      Menu: [],
      Title: [],
      Year: 1970,
      Social: [],
      SEO: {
        Description: [],
        Keyword: []
      },
      OnService: true,
      Contact: {
        Address: [],
        CompanyName: [],
        Fax: [],
        Mobile: [],
        Phone: [],
        Email: ''
      }
    }
  },
  manage: {
    login: false,
    uid: '',
    data: []
  }
})

export const mutations = {
  SetLang (_State, _Locale) {
    if (_State.locales.includes(_Locale)) {
      _State.language = _Locale
    }
  },
  SetWebConfig (_State, _Config) {
    _State.profile.website = _Config
  },
  SetAuthStatus (_State, _Auth) {
    if (_Auth) {
      _State.manage.login = true
      _State.manage.uid = _Auth.uid
      _State.manage.data = {
        displayName: _Auth.displayName,
        photoURL: _Auth.photoURL,
        email: _Auth.email,
        emailVerified: _Auth.emailVerified,
        phoneNumber: _Auth.phoneNumber,
        isAnonymous: _Auth.isAnonymous,
        metadata: _Auth.metadata
      }
    } else {
      _State.manage.login = false
      _State.manage.uid = ''
      _State.manage.data = []
    }
  }
}

export const actions = {
  async nuxtServerInit ({ dispatch }, context) {
    await dispatch('GetWebConfig', context)
    await dispatch('GetLang', context)
  },
  async GetWebConfig ({ commit }) {
    await Firestore.collection('Config').doc('Website').get().then((doc) => {
      const Data = doc.data()
      const Menu = []
      Data.Menu.forEach((_Value, _Index) => {
        if (_Value.Open === true) {
          Menu.push(_Value)
        }
      })
      Data.Menu = Menu
      commit('SetWebConfig', Data)
    }).catch((_Error) => {
      console.log(_Error)
    })
  },
  GetLang ({ commit }) {
    commit('SetLang', 'zh-tw')
  },
  CheckAuth ({ commit }) {
    return new Promise((resolve, reject) => {
      const User = Auth.currentUser
      if (User !== null) {
        resolve(true)
      } else {
        reject(new Error('auth/expired'))
      }
    })
  },
  AuthWatcher ({ commit }) {
    return new Promise((resolve, reject) => {
      Auth.onAuthStateChanged((_Auth) => {
        commit('SetAuthStatus', _Auth)
        if (_Auth) {
          resolve(true)
        } else {
          reject(new Error('auth/expired'))
        }
      })
    })
  }
}
