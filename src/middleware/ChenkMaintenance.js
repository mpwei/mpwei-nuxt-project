export default function ({ store, redirect }) {
  // 判斷網站是否關閉
  if (!store.state.profile.website.OnService) {
    return redirect('/maintenance')
  }
  // 判斷文章是否為隱藏
}
