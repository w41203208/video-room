import AgoraRTM, { RtmClient, RtmChannel, RtmMessage } from 'agora-rtm-sdk';

interface Option {
  appId: string;
}

export class RTMClient {
  public options: Option;
  public client: RtmClient | undefined = undefined;
  public channel: RtmChannel | undefined = undefined;

  constructor() {
    this.options = {
      appId: '9533f78356b045399c1ba4a505f624c2',
    };
  }

  createClient = () => {
    this.client = AgoraRTM.createInstance(this.options.appId);
  };
  createChannel = async (channelId: string) => {
    this.channel = this.client?.createChannel(channelId);
  };
  login = async (uid: string, token: string) => {
    await this.client?.login({ uid: uid, token: token });
    this.client?.on('MessageFromPeer', this.handleReceiveMessageFromPeer);
  };
  joinChannel = async () => {
    await this.channel?.join().then(() => {
      this.channel?.on('MemberJoined', this.handleMemberJoin);
      this.channel?.on('ChannelMessage', this.handleReceiveMessageFromChannel);
      console.log('You success to join channel');
    });
  };
  sendChannelMsg = async (sendMsg: string) => {
    if (this.channel != null) {
      await this.channel.sendMessage({ text: sendMsg }).then(() => {
        console.log('You successfully send channelmsg to everybody!');
      });
    }
  };

  sendPeerMsg = async (peerId: string, sendMsg: string) => {
    await this.client
      ?.sendMessageToPeer({ text: sendMsg }, peerId)
      .then((result) => {
        console.log('You successfully send peermsg to' + peerId + '!');
      });
  };

  handleReceiveMessageFromPeer = async (
    message: RtmMessage,
    peerId: string
  ) => {
    document
      .getElementById('peermsg')
      ?.appendChild(document.createElement('p'))
      .append('Message from: ' + peerId + ' Message: ' + message);
  };

  handleReceiveMessageFromChannel = async (
    message: RtmMessage,
    memberId: string
  ) => {
    document
      .getElementById('channelmsg')
      ?.appendChild(document.createElement('p'))
      .append('Message from: ' + memberId + ' Message: ' + message);
  };

  handleMemberJoin = (memberId) => {
    console.log(memberId);
  };
}
