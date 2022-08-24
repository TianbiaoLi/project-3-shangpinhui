<template>
  <div class="dashboard-container">
    <!-- 顶部 -->
    <Card></Card>
    <!-- 中间 -->
    <Sale></Sale>
    <!-- 底部 -->
    <Observe></Observe>
  </div>
</template>

<script>
import Card from "./Card";
import Sale from "./Sale";
import Observe from "./Observe";
export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Observe,
  },
  mounted() {
    this.$store.dispatch("getData");
  },
};
</script>

<style scoped></style>
