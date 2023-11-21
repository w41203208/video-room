import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  SDK_CODEC,
  UID,
  IAgoraRTCRemoteUser,
  ILocalVideoTrack,
  IBufferSourceAudioTrack,
  NetworkQuality,
} from 'agora-rtc-sdk-ng';
import {
  RtcOptions,
  CreateAgoraClientInfoTypeAfterToken,
  RemotePlayers,
} from '@/types';
import store from '@/store';
import { getAgoraRTCToken } from '@/services/api';

AgoraRTC.setLogLevel(0);

export class RTCClient {
  public option: RtcOptions;
  public localAudioTrack: IMicrophoneAudioTrack | undefined = undefined;
  public localVideoTrack: ICameraVideoTrack | undefined = undefined;
  public localScreenShareTrack: ILocalVideoTrack | undefined = undefined;
  public localAudioFileTrack: IBufferSourceAudioTrack | undefined = undefined;
  public downlinkClient: IAgoraRTCClient | undefined = undefined;
  public uplinkClient: IAgoraRTCClient | undefined = undefined;
  public screenClient: IAgoraRTCClient | undefined = undefined;

  constructor(
    codec: SDK_CODEC,
    { ...options }: CreateAgoraClientInfoTypeAfterToken
  ) {
    //options: CreateAgoraClientInfoType
    this.option = {
      appId: '9533f78356b045399c1ba4a505f624c2',
      codec: codec,
      ...options,
    };
  }

  /**
   * AgoraClient create client API
   */
  createClient() {
    const { mode, codec, role } = this.option;
    const roleType = role === 1 ? 'host' : 'audience';
    console.log(roleType);
    this.uplinkClient = AgoraRTC.createClient({ mode, codec, role: roleType });
    // this.downlinkClient = AgoraRTC.createClient({
    //   mode,
    //   codec,
    //   role: roleType,
    // });
  }

  /**
   * 本地user連線的API
   */
  joinChannel(div: HTMLElement | string) {
    return new Promise(async (resovle, reject) => {
      await this.uplinkClient
        ?.join(
          this.option.appId,
          this.option.channel,
          this.option.token,
          this.option.uid
        )
        .then((uid) => {
          this.uplinkClient?.on('user-joined', this.handleUserJoin);
          this.uplinkClient?.on('user-left', this.handleUserLeft);
          this.uplinkClient?.on('user-published', this.handleUserPublished);
          this.uplinkClient?.on('user-unpublished', this.handleUserUnPublished);
          this.uplinkClient?.on(
            'token-privilege-will-expire',
            this.handleTokenWillExp
          );
          // rtc.client.on('media-reconnect-start', this.handleReconectStart);
          if (this.option.mode === 'rtc') {
            // this.createAudio();
            // this.createVideo(div);

            resovle(uid);
            return;
          } else {
            if (this.option.role === 1) {
              this.createAudio();
              this.createVideo(div);
            }
            resovle(uid);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  leaveChannel() {
    return new Promise(async (resovle, reject) => {
      this.destroyVideo();
      this.destroyAideo();
      this.destroyShareVideo();
      this.destroyShareMusic();

      store.commit('m_resetRemoteUser');

      await this.screenClient?.leave();
      await this.uplinkClient?.leave();
      resovle(0);
    });
  }

  /*
   * 控制本地媒體的API
   */

  async createAudio() {
    this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.uplinkClient?.publish(this.localAudioTrack);
    this.localAudioTrack?.play();
  }

  async createVideo(el: string | HTMLElement) {
    this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await this.uplinkClient?.publish(this.localVideoTrack);
    this.localVideoTrack?.play(el);
  }
  async destroyVideo() {
    // this.uplinkClient?.unpublish(this.localVideoTrack);
    this.localVideoTrack?.stop();
    this.localVideoTrack?.close();
    this.localVideoTrack = undefined;
  }
  async destroyAideo() {
    // this.uplinkClient?.unpublish(this.localAudioTrack);
    this.localAudioTrack?.stop();
    this.localAudioTrack?.close();
    this.localAudioTrack = undefined;
  }

  async destroyShareVideo() {
    this.localScreenShareTrack?.stop();
    this.localScreenShareTrack?.close();
    this.localScreenShareTrack = undefined;
  }

  async destroyShareMusic() {
    this.localAudioFileTrack?.stop();
    this.localAudioFileTrack?.close();
    this.localAudioFileTrack = undefined;
  }
  async test() {
    this.createAudio();
    this.createVideo(
      document.getElementById(`${this.uplinkClient?.uid}`) as HTMLElement
    );
  }

  async closeAudio() {
    this.localAudioTrack?.setMuted(true);
  }
  async closeVideo() {
    await this.localVideoTrack?.setMuted(true);
    console.log(this.localVideoTrack?.muted);
  }
  async openAudio() {
    this.localAudioTrack?.setMuted(false);
  }
  async openVideo() {
    await this.localVideoTrack?.setMuted(false);
    console.log(this.localVideoTrack?.muted);
  }

  /*
   * 處理remote user 進入時的API，與本地對遠端媒體的狀態操作
   */

  handleUserPublished = async (
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video'
  ) => {
    if (this.uplinkClient?.uid?.toString() === user.uid.toString()) {
      return;
    }
    if (this.screenClient?.uid?.toString() === user.uid.toString()) {
      return;
    }
    const rtc = this.uplinkClient;
    //因為使用typescript如果不判斷是否為object會有錯誤，但不影響執行
    if (typeof rtc === 'object') {
      //處理vue生命週期所造成的未取得user資訊的解決辦法
      // const obj = Object.values(rtc.remoteUsers).filter((o, index) => {
      //   if (user.uid === o.uid) {
      //     return o;
      //   }
      // });
      // const newRemoteUser: IAgoraRTCRemoteUser = obj[0];
      //subscribe(判斷後的remoteUser)
      await rtc?.subscribe(user, mediaType);
      console.log(`${user.uid} subscribe success!`);

      if (mediaType === 'video') {
        console.log('video open');
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack?.play(`${user.uid.toString()}`, { mirror: true });
      }
      if (mediaType === 'audio') {
        console.log('audio open');
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack?.play();
      }
    }
  };

  handleUserUnPublished = async (
    user: IAgoraRTCRemoteUser,
    mediaType: 'audio' | 'video'
  ) => {
    if (mediaType === 'audio') {
      console.log(`${user.uid} is close audio!`);
      user.audioTrack?.stop();
    }
    if (mediaType === 'video') {
      console.log(`${user.uid} is close video!`);
      user.videoTrack?.stop();
    }
  };

  handleUserJoin = async (user: IAgoraRTCRemoteUser) => {
    if (this.uplinkClient?.uid?.toString() === user.uid.toString()) {
      return;
    }
    if (this.screenClient?.uid?.toString() === user.uid.toString()) {
      return;
    }
    const new_user: RemotePlayers = {
      uid: user.uid.toString(),
      video: false,
      audio: false,
      videoTrack: user.videoTrack,
      audioTrack: user.audioTrack,
    };
    store.commit('m_setRemoteUser', new_user);
  };

  handleUserLeft = async (user: IAgoraRTCRemoteUser) => {
    const dom = document.getElementById(user.uid.toString());
    dom?.remove();
    store.commit('m_removeRemoteUser', user.uid.toString());
  };

  /**
   * 取得連線Token的API，與過期交換Token的API
   */
  //token超過期限的前30s調用
  handleTokenWillExp = async () => {
    const rtc = this.uplinkClient;
    const { uid, channel, role } = store.state.agora.createAgoraInfo;
    getAgoraRTCToken(uid, channel, role).then(async (res: any) => {
      store.commit('setAgoraToken', res.data.token);
      await rtc?.renewToken(res.data.token);
    });
  };
  //token因網路斷線需要重新取得，並連線
  handleRequestToken = async () => {
    const rtc = this.uplinkClient;
    const { uid, channel, role } = store.state.agora.createAgoraInfo;
    getAgoraRTCToken(uid, channel, role).then(async (res: any) => {
      store.commit('setAgoraToken', res.data.token);
      await rtc?.renewToken(res.data.token);
    });
  };
  handleReconectStart = async (uid: UID) => {
    console.log('media-reconnect-start' + uid.toString());
  };

  /*
   * 取得媒體資訊的API
   */
  getMicrophones = async () => {
    const microphones = AgoraRTC.getMicrophones();
    return microphones;
  };
  getCameras = async () => {
    const cameras = await AgoraRTC.getCameras();
    return cameras;
  };
  changeCamera = async (id: string) => {
    await this.localVideoTrack?.setDevice(id);
  };
  changeMic = async (id: string) => {
    await this.localAudioTrack?.setDevice(id);
    const level = this.localAudioTrack?.getVolumeLevel();
    console.log('local stream audio level', level);
  };

  /**
   *
   */
  shareCreen = async () => {
    const { mode, codec, role, ...restOption } = this.option;
    this.screenClient = AgoraRTC.createClient({ mode, codec });
    await this.screenClient?.join(
      this.option.appId,
      this.option.channel,
      this.option.token,
      this.option.uid
    );

    this.localScreenShareTrack = (await AgoraRTC.createScreenVideoTrack({
      encoderConfig: '1080p_1',
    })) as ILocalVideoTrack;
    await this.screenClient.publish(this.localScreenShareTrack);
  };

  shareMusic = async (file: File) => {
    this.localAudioFileTrack = await AgoraRTC.createBufferSourceAudioTrack({
      source: file,
    });
    this.localAudioFileTrack.startProcessAudioBuffer();
    this.uplinkClient?.publish(this.localAudioFileTrack);
  };

  /**
   * 檢測連線品質的API
   */
  up_handleNetworkQuality = async (quality: NetworkQuality) => {
    console.log('uplink network quality', quality.uplinkNetworkQuality);
    console.log(this.uplinkClient?.getLocalAudioStats());
    console.log(this.uplinkClient?.getLocalVideoStats());
  };
  down_handleNetworkQuality = async (quality: NetworkQuality) => {
    console.log('downlink network quality', quality.uplinkNetworkQuality);
    console.log(this.downlinkClient?.getRemoteAudioStats());
    console.log(this.downlinkClient?.getRemoteVideoStats());
  };
  joinTestChannel(div: HTMLElement | string) {
    return new Promise(async (resolve, reject) => {
      await this.uplinkClient
        ?.join(
          this.option.appId,
          this.option.channel,
          this.option.token,
          this.option.uid
        )
        .then((res) => {
          resolve(res);
        });
      await this.downlinkClient?.join(
        this.option.appId,
        this.option.channel,
        this.option.token,
        this.option.uid
      );

      this.uplinkClient?.on('network-quality', this.up_handleNetworkQuality);
      this.downlinkClient?.on(
        'network-quality',
        this.down_handleNetworkQuality
      );
      this.openAudio();
      this.openVideo(div);

      this.downlinkClient?.on('user-published', this.handleUserPublished);
    });
  }

  leaveTestChannel() {
    return new Promise(async (resovle, reject) => {
      this.closeAudio();
      this.closeVideo();

      this.uplinkClient?.remoteUsers.forEach((user) => {
        const dom = document.getElementById(user.uid.toString());
        dom?.remove();
      });

      await this.uplinkClient?.leave();
      await this.downlinkClient?.leave();
      resovle(0);
    });
  }
}
AgoraRTC.onMicrophoneChanged = async (info) => {
  console.log('microphone changed!', info.state, info.device);
};
AgoraRTC.onCameraChanged = async (info) => {
  console.log('camera changed!', info.state, info.device);
};
AgoraRTC.onAutoplayFailed = () => {
  console.log('onAutoplayFailed');
};
