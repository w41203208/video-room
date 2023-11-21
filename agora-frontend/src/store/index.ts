import { createStore } from 'vuex';
import { agoraStore } from './agoraStore';
import { testStore } from './testStore';

export default createStore({
  modules: {
    test: testStore,
    agora: agoraStore,
  },
});
