export default async function ({ store, redirect, route }) {
  let RedirectRoute = ''
  await store.dispatch('GetWebConfig', store)

  // 判斷網站是否關閉
  if (!store.state.profile.website.OnService) {
    RedirectRoute = '/maintenance'
  } else if (route.name === 'maintenance' && store.state.profile.website.OnService) {
    // 未維護時，維護畫面跳轉至首頁
    RedirectRoute = '/'
  }
  return redirect(RedirectRoute)
}
