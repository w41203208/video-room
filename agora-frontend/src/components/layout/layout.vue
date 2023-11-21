<template>
  <slot name="main"></slot>
  <Footer :rtc="rtcClient"></Footer>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import Footer from './footer.vue';
import Header from './header.vue';
import { RTCClient } from '@/services/agora';

export default defineComponent({
  components: {
    Header,
    Footer,
  },
  props: {
    rtc: {
      type: RTCClient as PropType<any>,
    },
  },
  setup(props, {}) {
    const rtcClient = ref(props.rtc);
    return {
      rtcClient,
    };
  },
});
</script>
