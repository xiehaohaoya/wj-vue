<template>
  <div>
    <NavMenu></NavMenu>
    <!-- <nav-menu></nav-menu> 同一种标签的两种写法 -->
    <router-view/>
  </div>
</template>

<script>
  import NavMenu from './common/NavMenu'
  export default {
    name: 'Home',
    components: {NavMenu}
  }
</script>

<style scoped>

</style>
