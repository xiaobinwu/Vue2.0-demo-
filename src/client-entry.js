require('es6-promise').polyfill()
import { app, store } from './app'

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
store.replaceState(window.__INITIAL_STATE__)

// actually mount to DOM
app.$mount('#app')

//PWA 所做的离线应用处理措施
// service worker
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/dist/service-worker.js')
}