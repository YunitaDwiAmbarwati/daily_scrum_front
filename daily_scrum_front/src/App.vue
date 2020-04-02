<template>
  <div id="app">
      <div class="container-scroller">
    <router-view name="header" />
      <div class="wrapper">
        <router-view />
      </div>
  </div>
  </div>
</template>

<script>
import Navbar from './views/layouts/Navbar'
export default {
  name: 'App',
  components: {
    Navbar
  },
  data : function(){
    return {
      status_login: ''
    }
  }
}
</script>

