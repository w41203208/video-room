<template>
  <section class="flex flex-col justify-center items-center h-screen">
    <div class="flex flex-col">
      <div
        class="flex justify-start items-start w-full mb-4 border-b border-purple-400"
      >
        <div
          class="ming-nav"
          :class="[inputReactive.mode === 'rtc' ? 'active' : '']"
          @click="handleChangeMODE('VideoCall')"
        >
          VideoCall
        </div>
        <div
          class="ming-nav"
          :class="[inputReactive.mode === 'live' ? 'active' : '']"
          @click="handleChangeMODE('Live')"
        >
          Live
        </div>
      </div>
      <Form
        v-if="inputReactive.mode === 'rtc'"
        :uid="inputReactive.uid"
        :channel="inputReactive.channel"
        :role="inputReactive.role || 0"
        @setRole="setROLE"
        @setChannel="setCHANNEL"
        @setUid="setUID"
      >
        <template #button>
          <div class="flex">
            <button
              @click="handleClickGoVideoCall"
              class="text-md border rounded border-green-600 px-2 py-1 hover:bg-green-600 hover:text-white mr-1"
            >
              Join Room
            </button>
            <button
              v-show="false"
              @click="handleClickTest"
              class="text-md border rounded border-green-600 px-2 py-1 hover:bg-green-600 hover:text-white mr-1"
            >
              test Room
            </button>
          </div>
        </template>
      </Form>
      <Form
        v-if="inputReactive.mode === 'live'"
        :uid="inputReactive.uid"
        :channel="inputReactive.channel"
        :role="inputReactive.role || 0"
        @setRole="setROLE"
        @setChannel="setCHANNEL"
        @setUid="setUID"
      >
        <template #button>
          <div class="flex">
            <button
              class="text-md border rounded border-blue-400 px-2 py-1 hover:bg-blue-400 hover:text-white mr-1"
              :class="[inputReactive.role === 1 ? '' : 'disabled']"
              :disabled="inputReactive.role === 1 ? false : true"
              @click="handleClickLiveCreateRoom"
            >
              Join Room Host
            </button>
            <button
              @click="handleClickLiveJoinRoom"
              :class="[inputReactive.role === 2 ? '' : 'disabled']"
              :disabled="inputReactive.role === 2 ? false : true"
              class="text-md border rounded border-green-600 px-2 py-1 hover:bg-green-600 hover:text-white mr-1"
            >
              Join Room Audience
            </button>
          </div>
        </template>
      </Form>
    </div>
    <!-- roomUUID：<a-input :value="testUUID" @change="setUUID"></a-input>
    roomToken：<a-input :value="testRoomToken" @change="setRoomToken"></a-input>
    roomRole：<a-input
      :value="testRoomRole"
      @change="setRoomRole"
      placeholder="Admin/Writer/Reader"
    ></a-input>
    <div class="flex">
      <a-button @click="testCreateRoom">create room</a-button>
      <a-button @click="testGetRoomToken">getRoomToken</a-button>
      <a-button @click="testJoin">join</a-button>
    </div>

    <div id="whiteboard" class="h-full w-full"></div> -->
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { getRoomToken, getCreateRoom } from '@/services/api';
import { WhiteWebSdk } from 'white-web-sdk';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import { CreateAgoraClientInfoType, SDK_MODE } from '@/types';
import Form from '@/components/form.vue';

var whiteWebSdk = new WhiteWebSdk({
  appIdentifier: '_TO-wKwKEey5EJdzlFjNzg/RzV78ruWf61qNA',
  region: 'cn-hz',
});

export default defineComponent({
  components: {
    Form,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const inputReactive = reactive<CreateAgoraClientInfoType>({
      uid: '',
      channel: '',
      mode: 'rtc',
      role: 0,
    });

    // 白板測試
    const testUUID = ref();
    const testRoomToken = ref();
    const testRoomRole = ref();
    ////////////////////

    const setUID = (uid: string) => {
      inputReactive.uid = uid;
    };
    const setCHANNEL = (channel: string) => {
      inputReactive.channel = channel;
    };
    const setROLE = (role: string) => {
      inputReactive.role = parseInt(role);
    };
    const resetReactive = (mode: SDK_MODE) => {
      inputReactive.uid = '';
      inputReactive.channel = '';
      inputReactive.role = 0;
      inputReactive.mode = mode;
    };
    const handleChangeMODE = (mode: string) => {
      if (mode === 'Live') {
        resetReactive('live');
      }
      if (mode === 'VideoCall') {
        resetReactive('rtc');
      }
    };
    const handleClickGoVideoCall = () => {
      store
        .dispatch('a_getCreateAgoraInfo', inputReactive)
        .then((res) => {
          router.push('/videocall');
          resetReactive('rtc');
        })
        .catch((err) => {});
    };

    const handleClickLiveCreateRoom = () => {
      store
        .dispatch('a_getCreateAgoraInfo', inputReactive)
        .then((res) => {
          router.push('/live');
          resetReactive('rtc');
        })
        .catch((err) => {});
    };

    const handleClickLiveJoinRoom = () => {
      store
        .dispatch('a_getCreateAgoraInfo', inputReactive)
        .then((res) => {
          router.push('/live-audience');
          resetReactive('rtc');
        })
        .catch((err) => {});
    };
    const handleClickTest = () => {
      store
        .dispatch('a_getCreateAgoraInfo', inputReactive)
        .then((res) => {
          router.push('/test');
          resetReactive('rtc');
        })
        .catch((err) => {});
    };

    // 白板測試
    const setUUID = (e: any) => {
      testUUID.value = e.target.value;
    };
    const setRoomToken = (e: any) => {
      testRoomToken.value = e.target.value;
    };
    const setRoomRole = (e: any) => {
      testRoomRole.value = e.target.value;
    };
    const testGetRoomToken = async () => {
      const _resData = await getRoomToken(testRoomRole.value);
      testRoomToken.value = _resData.data.roomToken;
    };
    const testCreateRoom = async () => {
      const _resData = await getCreateRoom();
      testUUID.value = _resData.data.uuid;
      testCreate();
    };

    const testJoin = async () => {
      const joinRoomParams = {
        uuid: testUUID.value,
        uid: inputReactive.uid,
        roomToken: testRoomToken.value,
      };
      whiteWebSdk
        .joinRoom(joinRoomParams)
        .then((room) => {
          room.bindHtmlElement(
            document.getElementById('whiteboard') as HTMLDivElement
          );
        })
        .catch(function (err) {
          console.error(err);
        });
    };

    const testCreate = () => {
      const joinRoomParams = {
        uuid: testUUID.value,
        uid: inputReactive.uid,
        roomToken: testRoomToken.value,
      };
      whiteWebSdk
        .joinRoom(joinRoomParams)
        .then((room) => {
          room.bindHtmlElement(
            document.getElementById('whiteboard') as HTMLDivElement
          );
          room.setMemberState({
            currentApplianceName: 'pencil',
            strokeColor: [255, 182, 193],
            strokeWidth: 12,
          });
        })
        .catch(function (err) {
          console.error(err);
        });
    };

    return {
      setUID,
      setCHANNEL,
      setROLE,
      handleChangeMODE,
      handleClickGoVideoCall,
      handleClickLiveCreateRoom,
      handleClickLiveJoinRoom,
      handleClickTest,
      inputReactive,
      //下面是whiteboart demo
      testGetRoomToken,
      testJoin,
      testCreateRoom,
      testUUID,
      testRoomToken,
      testRoomRole,
      setRoomRole,
      setUUID,
      setRoomToken,
    };
  },
});
</script>

<style lang="scss" scoped>
.ming-nav {
  @apply w-24 h-8  flex items-center justify-center rounded-t cursor-pointer;
  margin-bottom: -1px;
  &.active {
    @apply border border-b-0 border-purple-400 bg-white;
  }
}
.disabled {
  @apply bg-gray-300 border border-gray-400 text-gray-400;
}
</style>
