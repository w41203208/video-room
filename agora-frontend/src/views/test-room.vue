<template>
  <h1>This is test your stream quality room.</h1>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup(props) {
    const store = useStore();
    const router = useRouter();
    onMounted(() => {});
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
