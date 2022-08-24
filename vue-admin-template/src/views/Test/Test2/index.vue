<template>
  <div>
    <p>模块开发中~</p>
    <el-button type="primary" :disabled="$store.state.user.buttons.indexOf('btn.test2.add1')==-1">添加按钮3</el-button>
  </div>
</template>

<script>
export default {
  name:'Test2'
}
</script>

<style>

</style>
