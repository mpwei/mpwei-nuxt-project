export const state = () => ({
  locales: ['en-us', 'zh-tw'],
  locale: 'zh-tw',
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
  SET_LANG (state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  }
}

export const action = {
  GetWebsiteConfig (_Context) {
    return Promise.resolve((_Resolve, _Reject) => {
      _Context.state.database.collection('Config').doc('Website').get().then((_Response) => {
        _Context.state.profile.website = {
          Designer: _Response.data().Designer,
          Subtitle: _Response.data().Subtitle,
          Title: _Response.data().Title,
          Year: _Response.data().Year
        }
        _Resolve()
      }).catch((_Error) => {
        _Reject(_Error)
      })
    })
  },
  GetLogo (_Context) {
    return Promise.resolve((_Resolve, _Reject) => {
      _Context.state.profile.logo = 'images/logo_icon.png'
      _Context.state.storage.ref().child(_Context.state.profile.logo).getDownloadURL().then((URL) => {
        _Context.state.profile.logo = URL
        _Resolve()
      }).catch((_Error) => {
        _Reject(_Error)
      })
    })
  },
  GetStorageImages (_Context, _Path) {
    return Promise.resolve((_Resolve, _Reject) => {
      _Context.state.storage.ref().child(_Path).getDownloadURL().then((URL) => {
        _Resolve(URL)
      }).catch((_Error) => {
        _Reject(_Error)
      })
    })
  },
  GetMenu (_Context) {
    return Promise.resolve((_Resolve, _Reject) => {
      _Context.state.profile.menu = []
      _Context.state.database.collection('Menu').where('Open', '==', true).orderBy('No', 'asc').get().then((_Response) => {
        _Response.forEach((doc) => {
          _Context.state.profile.menu.push(doc.data())
        })
        _Resolve()
      }).catch((_Error) => {
        _Reject(_Error)
      })
    })
  },
  CheckAuth (_Context) {
    return Promise.resolve((_Resolve, _Reject) => {
      _Context.state.auth.onAuthStateChanged((_Auth) => {
        if (_Auth) {
          _Context.state.manage.login = true
          _Context.state.manage.uid = _Auth.uid
          _Context.state.manage.data = {
            displayName: _Auth.displayName,
            photoURL: _Auth.photoURL,
            email: _Auth.email,
            emailVerified: _Auth.emailVerified,
            phoneNumber: _Auth.phoneNumber,
            isAnonymous: _Auth.isAnonymous,
            metadata: _Auth.metadata
          }
          _Resolve(_Context.state.manage.login)
        } else {
          _Context.state.manage.login = false
          _Context.state.manage.uid = ''
          _Context.state.manage.data = []
          _Reject(_Context.state.manage.login)
        }
      })
    })
  }
}
