const express = require('express');
const cors = require('cors');
const WhiteBoardController = require('./src/controller/whiteboardController');
const {
  AgoraRTCTokenController,
} = require('./src/controller/agoraRtcTokenController');
const {
  AgoraRTMTokenController,
} = require('./src/controller/agoraRtmTokenController');

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());

app.get('/getCreateRoom', WhiteBoardController.getCreateRoom);
app.post('/getRoomToken', WhiteBoardController.getRoomToken);
app.get('/getRoomList', WhiteBoardController.getRoomList);

app.post('/getRTCToken', AgoraRTCTokenController.getRTCToken);
app.post('/getRTMToken', AgoraRTMTokenController.getRTMToken);

app.listen(port, () => {
  console.log(`Token server is listening at http://localhost:${port}`);
});
