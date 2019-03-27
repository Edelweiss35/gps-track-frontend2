<template>
  <el-tree
    ref="tree"
    :data="data"
    show-checkbox
    node-key="id"
    :default-checked-keys="defaultCheckedKeys"
    :props="defaultProps">
  </el-tree>
</template>

<script>
export default {
  props: {
    data: {
        type: Array,
        default: _ => []
    },
    defaultCheckedKeys: {
        type: Array,
        default: _ => []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    getAllCheckedKeys(){
      return this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
    }
  },
  mounted() {

  }
}
</script>
