export default async function ({ store, redirect }) {
  await store.dispatch('CheckAuth').catch((_Error) => {
    return redirect('/manage/login?redirect=true')
  })
}
