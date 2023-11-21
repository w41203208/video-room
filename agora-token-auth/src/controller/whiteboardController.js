const request = require('request');
const { sdkToken, TokenRole, roomToken } = require('../utils');

const AK = 'ytjOo0rXiMF93HRC';
const SK = 'DXmWC8s4A1xdW1f_z9TjkN1TiPWjxJqV';

const WhiteBoardController = {
  getCreateRoom: async (req, res) => {
    let _thisres = res;
    let _createRoomInfo = {};
    const netlessSDKToken = sdkToken(
      AK,
      SK,
      1000 * 60 * 10, // token 有效时间 (10分钟)，为 0 时，即永不过期。单位毫秒
      {
        role: TokenRole.Admin, // 可以选择 TokenRole.Reader / TokenRole.Writer
      }
    );
    const options = {
      method: 'POST',
      url: 'https://api.netless.link/v5/rooms',
      headers: {
        token: `${netlessSDKToken}`,
        'Content-Type': 'application/json',
        region: 'cn-hz',
      },
    };

    request(options, (err, res) => {
      if (err) throw new Error(error);
      _createRoomInfo = {
        ...JSON.parse(res.body),
      };
      return _thisres.status(200).json({ ..._createRoomInfo });
    });
  },
  getRoomToken: async (req, res) => {
    const { role } = req.body;
    console.log(TokenRole[role]);
    const netlessRoomToken = roomToken(
      AK,
      SK,
      1000 * 60 * 10, // token 有效时间 (10分钟)，为 0 时，即永不过期。单位毫秒
      {
        role: TokenRole[role], // 可以选择 TokenRole.Reader / TokenRole.Writer
      }
    );
    return res.status(200).json({ roomToken: netlessRoomToken });
  },
  getRoomList: async (req, res) => {
    const _thisres = res;
    const netlessSDKToken = sdkToken(
      AK,
      SK,
      1000 * 60 * 10, // token 有效时间 (10分钟)，为 0 时，即永不过期。单位毫秒
      {
        role: TokenRole.Admin, // 可以选择 TokenRole.Reader / TokenRole.Writer
      }
    );
    const options = {
      method: 'GET',
      url: 'https://api.netless.link/v5/rooms',
      headers: {
        token: `${netlessSDKToken}`,
        'Content-Type': 'application/json',
        region: 'cn-hz',
      },
    };
    request(options, (err, res) => {
      console.log(res.body.length);
      return _thisres.status(200).json(JSON.parse(res.body));
    });
  },
};

module.exports = WhiteBoardController;
