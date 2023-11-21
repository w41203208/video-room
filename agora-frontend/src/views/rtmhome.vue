<template>
  <section class="flex flex-col justify-center items-center h-screen">
    <div class="flex flex-col">
      <div class="flex flex-col mb-2">
        <h1 class="text-xl">RTM QuickDEMO</h1>
        <div class="flex items-center justify-center">
          <p class="ming-p-title mr-1">UID</p>
          <input
            type="text"
            class="ming-input"
            :value="uid"
            @change="(e) => handleChangeUID(e)"
          />
        </div>
        <div class="flex">
          <a-button @click="handleClickLOGIN">LOGIN</a-button>
          <a-button @click="handleClickLOGOUT">LOGOUT</a-button>
        </div>
      </div>

      <div class="flex flex-col mb-2">
        <h1 class="text-xl">
          Channel Name：<input
            type="text"
            class="ming-input"
            :value="channel"
            @change="(e) => handleChangeChannel(e)"
          />
        </h1>
        <div class="flex">
          <a-button @click="handleClickCREATE">CREATE</a-button>
          <a-button @click="handleClickJOIN">JOIN</a-button>
          <a-button @click="handleClickLEAVE">LEAVE</a-button>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <h1 class="text-md">Peer Msg：</h1>
      <input
        type="text"
        class="ming-input"
        :value="peerMsg"
        @change="(e) => handleChangePeerMsg(e)"
      />
      <a-button @click="handleClickSendPeerMsg">send</a-button>
    </div>
    <div class="flex items-center">
      <h1 class="text-md">Channel Msg：</h1>
      <input
        type="text"
        class="ming-input"
        :value="channelMsg"
        @change="(e) => handleChangeChannelMsg(e)"
      />
      <a-button @click="handleClickSendChannelMsg">send</a-button>
    </div>
    <div class="flex">
      <div class="flex flex-col" id="peermsg">
        <p v-for="msg in peerMsgList" :key="msg">{{ msg }}</p>
      </div>
      <div class="flex flex-col" id="channelmsg">
        <p v-for="msg in channelMsgList" :key="msg">{{ msg }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { getAgoraRTMToken } from '@/services/api';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { RTMClient } from '@/services/agoraRTM';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const rtmClient = ref(new RTMClient());
    const uid = ref<string>('');
    const channel = ref<string>('');
    const channelMsg = ref<string>('');
    const peerMsg = ref<string>('');
    const channelMsgList = ref<Array<string>>([]);
    const peerMsgList = ref<Array<string>>([]);

    const handleClickLOGIN = () => {
      getAgoraRTMToken(uid.value).then((res: any) => {
        rtmClient.value.login(uid.value, res.data.token);
      });
    };
    const handleClickLOGOUT = () => {};

    const handleChangeUID = (e: any) => {
      uid.value = e.target.value;
    };
    const handleClickCREATE = () => {
      rtmClient.value.createChannel(channel.value);
    };
    const handleClickJOIN = () => {
      rtmClient.value.joinChannel();
    };
    const handleClickLEAVE = () => {};

    const handleChangeChannel = (e: any) => {
      channel.value = e.target.value;
    };
    const handleChangeChannelMsg = (e: any) => {
      channelMsg.value = e.target.value;
    };
    const handleChangePeerMsg = (e: any) => {
      peerMsg.value = e.target.value;
    };

    const handleClickSendChannelMsg = () => {};
    const handleClickSendPeerMsg = () => {
      const test = /[\w\s\S]+:[\w\s\S]+/.test(peerMsg.value);
      if (test) {
        peerMsg.value.split(':');
      }
    };

    onMounted(() => {
      rtmClient.value.createClient();
    });

    return {
      uid,
      handleClickLOGIN,
      handleClickLOGOUT,
      handleChangeUID,
      channel,
      handleChangeChannel,
      handleClickCREATE,
      handleClickJOIN,
      handleClickLEAVE,
      channelMsg,
      channelMsgList,
      handleChangeChannelMsg,
      peerMsg,
      peerMsgList,
      handleChangePeerMsg,

      handleClickSendPeerMsg,
      handleClickSendChannelMsg,
    };
  },
});
</script>

<style lang="scss" scoped>
.ming-input {
  @apply outline-none border px-2 py-1 rounded focus:border-blue-400 hover:border-blue-400;
}
.ming-p-title {
  @apply text-lg text-left;
}
</style>
