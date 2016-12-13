import Vue from 'vue'
import Vuex from 'vuex'
import { fetchItems, fetchIdsByType, fetchUser } from './api'

Vue.use(Vuex)

//热重载 [http://vuex.vuejs.org/zh-cn/hot-reload.html]


//插件例子
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe(mutation => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    if (mutation.type === 'ADD_TODO') {
        store.commit('IS_MUTATION')
    }
  })
}

const store = new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 20,
    items: {/* [id: number]: Item */},
    users: {/* [id: string]: User */},
    lists: {
      top: [/* number */],
      new: [],
      show: [],
      ask: [],
      job: []
    },
    //vuex学习
    count: 0,
    todos: [
      {id: 1481461990569, name: "柯佳鹏", position: '.net工程师', isfilter: true},
      {id: 1481461997125, name: "吴绍彬", position: 'web前端', isfilter: false},
      {id: 1481462003982, name: "陈浩川", position: 'ios工程师', isfilter: true},
      {id: 1481462005138, name: "林建详", position: 'ios工程师', isfilter: false}
    ],
    ismutation: false
  },

  actions: {
    // ensure data for rendering given list type
    FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {
      commit('SET_ACTIVE_TYPE', { type })
      return fetchIdsByType(type)
        .then(ids => commit('SET_LIST', { type, ids }))
        .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
    },

    // ensure all active items are fetched
    ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {
      return dispatch('FETCH_ITEMS', {
        ids: getters.activeIds
      })
    },

    FETCH_ITEMS: ({ commit, state }, { ids }) => {
      // only fetch items that we don't already have.
      ids = ids.filter(id => !state.items[id])
      if (ids.length) {
        return fetchItems(ids).then(items => commit('SET_ITEMS', { items }))
      } else {
        return Promise.resolve()
      }
    },

    FETCH_USER: ({ commit, state }, { id }) => {
      return state.users[id]
        ? Promise.resolve(state.users[id])
        : fetchUser(id).then(user => commit('SET_USER', { user }))
    },
    //VUEX学习
    //第一个参数是store
    ADD_TODO_ASYNC: ({commit}, item) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          item.id = +new Date() + Math.round(Math.random()*1000)
          commit('ADD_TODO', item)
          resolve(item.id)
        }, 1000)
      })
    }

  },

  mutations: {
    SET_ACTIVE_TYPE: (state, { type }) => {
      state.activeType = type
    },

    SET_LIST: (state, { type, ids }) => {
      state.lists[type] = ids
    },

    SET_ITEMS: (state, { items }) => {
      items.forEach(item => {
        if (item) {
          //遵守vue响应式原理
          Vue.set(state.items, item.id, item)
        }
      })
    },

    SET_USER: (state, { user }) => {
      Vue.set(state.users, user.id, user)
    },

    //vuex学习
    COUNT_INCREAMENT: state => state.count++,
    COUNT_DECREAMENT: state => state.count--,
    COUNT_INCREAMENT_10: (state, payload) => { state.count += payload.acount },
    COUNT_DECREAMENT_10: (state, payload) => { state.count -= payload.acount },
    ADD_TODO: (state, item) => {
        state.todos.push(item)
    },
    IS_MUTATION: state => { state.ismutation = true  } 
  },

  getters: {
    // ids of the items that should be currently displayed based on
    // current list type and current pagination
    activeIds (state) {
      const { activeType, itemsPerPage, lists } = state
      const page = Number(state.route.params.page) || 1
      if (activeType) {
        const start = (page - 1) * itemsPerPage
        const end = page * itemsPerPage
        return lists[activeType].slice(start, end)
      } else {
        return []
      }
    },

    // items that should be currently displayed.
    // this Array may not be fully fetched.
    activeItems (state, getters) {
      return getters.activeIds.map(id => state.items[id]).filter(_ => _)
    },

    //vuex学习
    filterTodo(state){
      return state.todos.filter(item => !item.isfilter)
    },
    filteredTodoLength(state, getters){
      return getters.filterTodo.length
    }

  },

  plugins: [myPlugin],
  //无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
  strict: process.env.NODE_ENV !== 'production'
})

export default store
