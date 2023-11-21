<template>
  <footer class="min-h-min h-20">
    <div class="flex py-3 px-2 justify-center items-center relative h-full">
      <div class="ming-btn-outer">
        <button class="ming-media-btn blue" @click="clickMicOpenEvt">
          <ion-icon v-if="micOpen" name="mic-outline"></ion-icon>
          <ion-icon v-else name="mic-off-outline"></ion-icon>
        </button>
        <div class="w-4 divider blue" @click="getMicrophoneDevices">
          <ion-icon name="caret-forward-outline"></ion-icon>
        </div>
      </div>
      <div class="ming-btn-outer">
        <button class="ming-media-btn blue" @click="clickCameraOpenEvt">
          <ion-icon name="videocam-outline"></ion-icon>
        </button>
        <div class="w-4 divider blue" @click="getCameraDevices">
          <ion-icon name="caret-forward-outline"></ion-icon>
        </div>
      </div>
      <div class="ming-btn-outer">
        <button class="ming-media-btn black" @click="clickShareScreenEvt">
          <ion-icon name="share"></ion-icon>
        </button>
        <a-button @click="test">test</a-button>
      </div>
      <div class="ming-btn-outer">
        <input
          id="music"
          type="file"
          accept="audio/*"
          class="hidden"
          @change="(e) => clickShareMusicEvt(e)"
        />
        <label for="music" class="ming-media-btn black">
          <ion-icon name="musical-note"></ion-icon>
        </label>
      </div>
      <div class="ming-btn-outer">
        <button class="ming-media-btn black" @click="clickLeaveEvt">
          <ion-icon name="log-out-outline"></ion-icon>
        </button>
      </div>
    </div>
    <div
      v-for="item in mics"
      :key="item.label"
      class="text-black"
      @click="clickSetMicEvt(item.deviceId)"
    >
      {{ item.deviceId }}
    </div>
    <div
      v-for="item in cameras"
      :key="item.label"
      class="text-black"
      @click="clickSetCameraEvt(item.deviceId)"
    >
      {{ item.deviceId }}
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { RTCClient } from '@/services/agora';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    rtc: {
      type: RTCClient as PropType<RTCClient | undefined>,
    },
  },
  setup(props, {}) {
    const { rtc } = props;
    const store = useStore();
    const router = useRouter();
    const micOpen = ref(true);
    const cameraOpen = ref(true);

    const mics = ref<MediaDeviceInfo[]>();
    const cameras = ref<MediaDeviceInfo[]>();

    const micTracks = ref<MediaStreamTrack[]>();
    const cameraTracks = ref<MediaStreamTrack[]>();

    const clickLeaveEvt = () => {
      rtc?.leaveChannel().then((res) => {
        store.commit('resetCreateAgoraInfo');
        router.push('/');
      });
    };
    const clickMicOpenEvt = () => {
      if (micOpen.value) {
        rtc?.closeAudio();
      } else {
        rtc?.openAudio();
      }
      micOpen.value = !micOpen.value;
    };
    const clickCameraOpenEvt = () => {
      if (cameraOpen.value) {
        rtc?.closeVideo();
      } else {
        rtc?.openVideo();
      }
      cameraOpen.value = !cameraOpen.value;
    };

    const getMicrophoneDevices = () => {
      rtc?.getMicrophones().then((micDivices) => {
        mics.value = micDivices;
      });
    };
    const getCameraDevices = () => {
      rtc?.getCameras().then((cameraDevices) => {
        cameras.value = cameraDevices;
      });
    };
    const clickSetMicEvt = (id: string) => {
      rtc?.changeMic(id);
    };
    const clickSetCameraEvt = (id: string) => {
      rtc?.changeCamera(id);
    };
    const clickShareScreenEvt = () => {
      rtc?.shareCreen();
    };
    const clickShareMusicEvt = (e: any) => {
      const fileData = e.target?.files[0];
      console.log(fileData);
      rtc?.shareMusic(fileData);
    };
    const test = () => {
      rtc?.test();
    };

    return {
      micTracks,
      cameraTracks,
      clickLeaveEvt,
      clickMicOpenEvt,
      clickCameraOpenEvt,
      getMicrophoneDevices,
      getCameraDevices,
      clickSetMicEvt,
      clickSetCameraEvt,
      clickShareScreenEvt,
      clickShareMusicEvt,
      micOpen,
      cameraOpen,
      mics,
      cameras,
      test,
    };
  },
});
</script>
<style lang="scss" scoped>
.ming-btn-outer {
  @apply flex rounded overflow-hidden  mr-1 h-10;
  .ming-media-btn {
    @apply w-10 h-full flex justify-center items-center text-xl cursor-pointer;
    &.filter {
      border: 1px rgba(238, 238, 238, 0.637) solid;
      backdrop-filter: blur(2px);
      &:hover {
        background: rgba(197, 197, 197, 0.192);
        color: white;
      }
    }
    &.blue {
      @apply bg-blue-400 text-white hover:bg-blue-500;
    }
    &.black {
      @apply bg-black text-white;
    }
  }
  .divider {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      width: 1px;
      height: 80%;
      background: rgba(223, 223, 223, 0.747);
      left: -1px;
    }
    &.blue {
      @apply bg-blue-400 text-white hover:bg-blue-500;
    }
  }
}
</style>
