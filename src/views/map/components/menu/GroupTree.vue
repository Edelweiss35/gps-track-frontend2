<template>
	<section>
	<el-button size="mini"  @click="handleNodeClick({id:0})" :type="!currentKey?'primary':''">根分组</el-button>
	<el-tree
		ref="tree"
		:data="$store.state.user.groups"
		node-key="id"
		:highlight-current='true'
		:default-expand-all="true"
		:render-content="renderContent"
		@node-click="handleNodeClick"
		:props="defaultProps">
	</el-tree>
</section>
</template>

<script>
	import util from '@/utils/util'
	export default {
		name: 'groupTree',
		props: ['currentKey'],
		data() {
			return {
				groups:[],
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
		},
		methods: {
		 handleNodeClick(node){
			 this.$emit('handleNodeClick',node);
		 },
		 renderContent(h, { node, data, store }) {
			return (
				<span class="custom-tree-node">
					<span><svg-icon icon-class="group" class-name="menu-icon-question blue" /> {node.label}</span>
				
				</span>);
		},
		},
		mounted(){
			this.$store.dispatch('initGroups');
			if(this.currentKey){
				var _this=this;
				setTimeout(function(){
						_this.$refs.tree.setCurrentKey(_this.currentKey)
				},500)
			}



		},
		watch: {
			 currentKey(val){
				if(val){
					this.$refs.tree.setCurrentKey(val)
				}

			},
		},
		// computed: {
		// 	selectNode:function(){
		// 		this.$refs.tree.setCurrentKey(val)
		// 		return this.currentKey;
		// 	}
		// }
	}
</script>
