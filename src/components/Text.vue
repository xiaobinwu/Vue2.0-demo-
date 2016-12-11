<template>
	<div>
		<h2>{{source}} 学习</h2>
		<h4>Demo1 - 计数器</h4>
		<div class="demo1">
			<p>{{count}}</p>
			<p>
				<button @click="increment">+1</button>
				<button @click="decrement">-1</button>
				<button @click="increment_10">+10</button>
				<button @click="decrement_10">-10</button>

			</p>
		</div>
		<h4>Demo2 - Getters</h4>
		<div class="demo2">
			<h5>原先数据源</h5>
			<ul>
				<li v-for="todo in todos" :key="todo.id">
					{{todo.name}} - {{todo.position}}
				</li>
			</ul>
			<h5>getters后的数据源</h5>
			<ul>
				<li v-for="filtertodo in filtertodos" :key="filtertodo.id">
					{{filtertodo.name}} - {{filtertodo.position}}
				</li>				
			</ul>
			<h5>getters后的数据源的长度</h5>
			<p>{{filtertodoslength}}</p>
		</div>
		<h4>Demo3 - Action</h4>
		<div class="demo3">
			<p>
				<label for="name">名字：</label>
				<input v-model="name" id="name" placeholder="请输入名字"/>
			</p>
			<p>
				<label for="position">职位：</label>
				<input v-model="position" id="position" placeholder="请输入职位"/>
			</p>
			<p>
				<input type="checkbox" id="isfilter" v-model="isfilter">
				<label for="isfilter">是否允许过滤</label>
			</p>
			<button @click="addTodo">添加</button>
		</div>


	</div>
</template>

<script>
	//es6 function this指向vue实例，想this指向函数内部状态，使用常规函数
	//mapState辅助函数帮忙生成计算属性
	import {mapState, mapGetters} from 'vuex'
	export default{
		data() {
			return{
				source: 'Vuex',
				name: '',
				position: '',
				isfilter: false
			}
		},
		computed: {
			// ...mapState([
			// 	'count',
			// 	'todos'
			// ]),
			// ...mapGetters({
			// 	filtertodos: 'filterTodo',
			// 	filtertodoslength: 'filteredTodoLength'
			// })
			count(){
				return this.$store.state.count
			},
			todos(){
				return this.$store.state.todos
			},
			filtertodos(){
				return this.$store.getters.filterTodo
			},
			filtertodoslength(){
				return this.$store.getters.filteredTodoLength
			}
		},
		methods: {
			addTodo: function(){
				let item = {
					name: this.name,
					position: this.position,
					isfilter: this.isfilter
				};
				this.$store.dispatch('ADD_TODO_ASYNC', item).then((id) =>{
					console.log(id)
					this.name = ''
					this.position = ''
					this.isfilter = false
				});
			},
			increment(){
				this.$store.commit('COUNT_INCREAMENT')
			},
			decrement(){
				this.$store.commit('COUNT_DECREAMENT')
			},
			increment_10(){
				this.$store.commit('COUNT_INCREAMENT_10', { acount: 10 })
			},
			decrement_10(){
				this.$store.commit({ 
					type: 'COUNT_DECREAMENT_10',
					acount: 10,
				},{
					//静默提交，不被devtools 记录变综
					silent: true
				})				
			}
		}
	}
</script>


<style lang="stylus">
h2
  color #fff
  text-align center
  padding 10px
  margin 10px 0
  background-color #f60 
h4
  color #333
.demo1
  &:after
    content ' '
    display table
    clear both
  p
    float left
    &:first-child
      margin-right 50px
</style>