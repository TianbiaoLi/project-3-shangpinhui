<template>
  <div>
    <p>模块开发中~</p>
    <el-button type="primary" :disabled="$store.state.user.buttons.indexOf('btn.test1.add1')==-1">添加按钮1</el-button>
    <el-button type="primary" :disabled="$store.state.user.buttons.indexOf('btn.test1.add2')==-1">添加按钮2</el-button>
  </div>
</template>

<script>
export default {
  name:'Test1'
}
</script>

<style>

</style>
