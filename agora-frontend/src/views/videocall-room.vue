<template>
  <Layout :rtc="rtcClinet">
    <template #main>
      <section
        class="flex flex-col md:flex-row h-full overflow-hidden relative"
      >
        <div class="flex-1 bg-slate-800 flex justify-center items-center">
          <div id="remoteShareScreen"></div>
        </div>
        <div class="flex flex-col overflow-hidden" id="videoContainer">
          <div class="overflow-y-auto" id="videoRemoteContainer">
            <div
              v-for="player in remotePlayers"
              :key="player.uid"
              :id="player.uid"
              class="h-52 w-72 relative"
            >
              <p
                class="absolute top-1 left-1 z-10 rounded-md px-2 py-1 bg-white"
              >
                {{ player.uid }}
              </p>
            </div>
          </div>
        </div>
        <div class="absolute right-2 bottom-2 z-40">
          <div class="flex flex-col relative" style="min-width: 320px">
            <p class="absolute top-0 left-1 z-50 text-red-500">
              {{ localPlayer }}
            </p>
            <div
              :id="localPlayer.toString()"
              class="w-full h-52 rounded overflow-hidden"
              ref="selfDivRef"
            ></div>
          </div>
        </div>
      </section>
    </template>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { RTCClient } from '@/services/agora';
import Layout from '@/components/layout/layout.vue';

type LocalPlayer = String;

export default defineComponent({
  components: { Layout },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const { ...args } = store.state.agora.createAgoraInfo;
    const rtcClinet = ref<RTCClient>(
      new RTCClient('vp8', {
        ...args,
      })
    );
    const localPlayer = ref<LocalPlayer>('');
    const selfDivRef = ref<HTMLElement | string>('');
    const remotePlayers = computed(() => {
      return store.state.agora.remoteUsers;
    });

    onMounted(() => {
      rtcClinet.value.createClient();
      const rtc = rtcClinet.value;
      rtc
        .joinChannel(selfDivRef.value)
        .then((res: any) => {
          console.log(res);
          localPlayer.value = res;
          console.log('join success!');
        })
        .catch((err) => {
          router.push('/');
        });
    });
    return {
      remotePlayers,
      selfDivRef,
      localPlayer,
      rtcClinet,
    };
  },
});
</script>

<style lang="scss" scoped>
.ming-bg {
  @apply absolute;
  width: 200px;
  height: 200px;
  z-index: -1;
  filter: blur(40px);
  &.pink {
    @apply bg-pink-500;
  }
  &.yellow {
    @apply bg-yellow-500;
  }
  &.purple {
    @apply bg-purple-500;
  }
  &.blue {
    @apply bg-blue-500;
  }
}
</style>
