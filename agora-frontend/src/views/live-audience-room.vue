<template>
  <section class="flex flex-col md:flex-row h-screen overflow-hidden relative">
    <div class="ming-bg pink top-2 left-56"></div>
    <div class="ming-bg blue bottom-3"></div>
    <div class="ming-bg yellow bottom-14 right-72"></div>
    <div class="ming-bg purple right-3 top-28"></div>
    <div class="flex-1 flex">
      <div
        class="flex flex-col relative overflow-y-auto"
        style="min-width: 220px"
        id="videoRemoteContainer"
      >
        <div class="overflow-y-auto" id="videoRemoteContainer">
          <div
            v-for="player in remotePlayers"
            :key="player.uid"
            :id="player.uid"
            class="h-52 w-72 relative"
          >
            <p class="absolute top-1 left-1 z-10 rounded-md px-2 py-1 bg-white">
              {{ player.uid }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col rounded-l-lg px-2 ming-live-container"
      id="livehost-container"
    >
      <div class="w-full mx-1 px-2 mt-2 flex justify-end">
        <button class="ming-media-btn white" @click="handleClickEvent">
          <ion-icon name="log-out-outline"></ion-icon>
        </button>
      </div>
      <div class="flex-1 my-2 mx-1 bg-slate-400 rounded" id="chat-box"></div>
      <div class="mb-2">
        <div class="p-1 flex items-end">
          <div class="w-8 h-8 flex items-center justify-center text-lg">
            <ion-icon name="chatbox-outline"></ion-icon>
          </div>
          <textarea
            class="outline-none w-64 py-1 pr-1 pl-1 resize-none h-8 bg-gray-200"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { RTCClient } from '@/services/agora';

type LocalPlayer = String;

export default defineComponent({
  setup(props) {
    const store = useStore();
    const { ...args } = store.state.agora.createAgoraInfo;
    const rtcClinet = ref<RTCClient>(
      new RTCClient('vp8', {
        ...args,
      })
    );
    const localPlayer = ref<LocalPlayer>('');
    const remotePlayers = computed(() => {
      console.log(store.state);
      return store.state.agora.remoteUsers;
    });

    const router = useRouter();

    const handleClickEvent = () => {
      rtcClinet.value?.leaveChannel().then((res) => {
        router.push('/');
      });
    };

    onMounted(() => {
      rtcClinet.value.createClient();
      const rtc = rtcClinet.value;
      rtc
        .joinChannel('test')
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
      handleClickEvent,
      remotePlayers,
      localPlayer,
    };
  },
});
</script>

<style lang="scss" scoped>
.ming-media-btn {
  @apply w-12 h-12 flex justify-center items-center rounded text-lg;
  &.filter {
    border: 1px rgba(238, 238, 238, 0.637) solid;
    backdrop-filter: blur(2px);
    &:hover {
      background: rgba(197, 197, 197, 0.192);
      color: rgb(255, 255, 255);
    }
  }
  &.blue {
    @apply bg-blue-400;
  }
  &.white {
    @apply bg-slate-300;
  }
  &.black {
    @apply bg-gray-800 text-white;
  }
}
.ming-bg {
  @apply absolute;
  z-index: -1;
  &:nth-child(1) {
    width: 300px;
    height: 300px;
    border-radius: 60% 87% 10% 68% / 50% 20% 30% 68%;
    filter: blur(40px);
  }
  &:nth-child(2) {
    width: 300px;
    height: 300px;
    border-radius: 60% 87% 80% 68% / 80% 10% 50% 68%;
    filter: blur(35px);
  }
  &:nth-child(3) {
    width: 250px;
    height: 250px;
    border-radius: 60% 50% 10% 68% / 80% 20% 10% 68%;
    filter: blur(45px);
  }
  &:nth-child(4) {
    width: 400px;
    height: 400px;
    border-radius: 15% 87% 10% 68% / 50% 20% 50% 80%;
    filter: blur(50px);
  }
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
.ming-live-container {
  border-left: 1px solid rgba(206, 206, 206, 0.822);
  background: rgba(228, 228, 228, 0.24);
}
</style>
