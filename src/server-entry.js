import { app, router, store } from './app'

const isDev = process.env.NODE_ENV !== 'production'

//这个导出的函数将被`bundleRenderer`调用。
//这是我们执行数据预取以确定
//在实际渲染它之前我们的应用程序的状态。
//因为数据获取是异步的，这个函数是期望的
//返回一个解析到应用程序实例的Promise。
// 使用预捆绑的应用程序代码创建bundleRenderer实例（请参阅创建服务器捆绑包）。 
// 对于每个render调用，代码将使用Node.js的vm模块在一个新的上下文中重新运行。 
// 这确保您的应用程序状态在请求之间是离散的，您不必担心为了SSR而以限制模式构造应用程序。
export default context => {
  // set router's location
  router.push(context.url)

  const s = isDev && Date.now()

  // Call preFetch hooks on components matched by the route.
  // A preFetch hook dispatches a store action and returns a Promise,
  // which is resolved when the action is complete and store state has been
  // updated.
  return Promise.all(router.getMatchedComponents().map(component => {
    if (component.preFetch) {
      return component.preFetch(store)
    }
  })).then(() => {
    isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
    // After all preFetch hooks are resolved, our store is now
    // filled with the state needed to render the app.
    // Expose the state on the render context, and let the request handler
    // inline the state in the HTML response. This allows the client-side
    // store to pick-up the server-side state without having to duplicate
    // the initial data fetching on the client.
    context.initialState = store.state
    return app
  })
}
