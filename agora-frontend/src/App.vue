<template>
  <main class="h-screen flex flex-col">
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

export default defineComponent({
  name: 'App',
  setup() {
    return {};
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
