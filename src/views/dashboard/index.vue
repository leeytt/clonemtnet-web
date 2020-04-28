<template>
  <div class="dashboard-container">
    <div>用户名:<span class="dashboard-text"> {{ username }}</span></div>
    <div>昵称:<span class="dashboard-text"> {{ nickname }}</span></div><br>
    角色:<span class="dashboard-text"> {{ roleName }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'username',
      'roleName',
      'nickname'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
