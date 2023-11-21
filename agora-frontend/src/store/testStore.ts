import { StoreOptions, Module } from 'vuex';
import { testState, rootState } from './types';

export const testStore: Module<testState, rootState> = {
  state: {
    testnum: 1, //test
  },
  mutations: {
    m_testaddnum(state) {
      //test
      state.testnum++;
    },
  },
  actions: {},
};
