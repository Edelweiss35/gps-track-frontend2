<template>
	<section>
		<h3 style="text-align: center;">Select Group</h3>
		<el-button size="mini" style="width: 50%; margin-left: 25%;"  @click="handleNodeClick({id:0})" :type="!currentKey?'primary':''">Root Group</el-button>
		<el-tree
			empty-text="No available Group."
			class="group-tree"
			ref="tree"
			:data="groups"
			node-key="id"
			:highlight-current="true"
			:default-expand-all="true"
			:render-content="renderContent"
			@node-click="handleNodeClick"
			:props="defaultProps">
		</el-tree>
	</section>
</template>

<script>
	import util from '@/utils/util'
	import { getGroupsByUid } from '@/api/api'
	export default {
		name: 'groupTree',
		props: ['currentKey', 'userId'],
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
			initGroups() {
				if(this.userId != 0) {
					getGroupsByUid(this.userId).then(data => {
						this.groups = util.listToTree('id', 'groupId', data)
					})
				}
			}
		},
		mounted(){
			this.initGroups();
			if(this.currentKey != 0){
				this.$refs.tree.setCurrentKey(this.currentKey)			
			}
		},
		watch: {
			currentKey(nv, ov){
				this.$refs.tree.setCurrentKey(nv)
			},
			userId(nv, ov) {
				if(nv != ov) {
					this.initGroups();
				}
			}
		},
	}
</script>
<style>
.group-tree {
	border: 1px dotted #555;
	margin-top: 10px;
	border-radius: 20px;
	padding: 0 20px;
}
</style>

