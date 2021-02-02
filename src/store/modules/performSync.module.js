import { APIService } from '@/service/api.js';
import urlConstant from '@/constants/uri.constants.js';

const state = {
  performsyncData: {},
  
  
};

const mutations = {
    performsyncData(state, payload) {
    switch (payload.type) {
      case 'UPDATING_SYNC_DATA':
        state.performsyncData = {
          isUpdatingperformsyncData: true,
          isUpdatedperformsyncData: false,
          errorUpdatingperformsyncData: false,
          isprogresssyncData:false,
          responseData: {},
        };
        break;
      case 'UPDATED_SYNC_DATA':
        state.performsyncData = {
          isUpdatingperformsyncData: false,
          isUpdatedperformsyncData: false,
          errorUpdatingperformsyncData: false,
          isprogresssyncData:false,
          responseData: payload.data,
        };
        break;
        case 'UPDATE_PROGRESS_SYNC_DATA':
        state.performsyncData = {
          isUpdatingperformsyncData: true,
          isUpdatedperformsyncData: false,
          errorUpdatingperformsyncData: false,
          isprogresssyncData:true,
          responseData: payload.data,
        };
        break;
    }
  },
}
  const actions = {
    actionperformsyncData({ commit, dispatch }, _obj) {
        console.log('sssssssssssssssssssssssssssssss',_obj);
      commit('performsyncData', { type: 'UPDATING_SYNC_DATA' });
      APIService.put(urlConstant.baseUrl + urlConstant.performsyncData, _obj).then(
        res => {
          if (res.data.ref) {
            const key = res.data.ref.split('/');
            dispatch('actionperformsyncProgress', key.pop());
          }
        }
      );
    },
  
    actionperformsyncProgress({ commit, dispatch  }, key) {
      APIService.get(urlConstant.baseUrl + urlConstant.performsyncData+'/'+key).then(
        res => {
          if (res.data.result.data.progress !== 100 ) {
            setTimeout(() => {
              dispatch('actionperformsyncProgress', res.data.result.key);
              commit('performsyncData', {
                type: 'UPDATE_PROGRESS_SYNC_DATA',
                data: res.data,
              });
            }, 1000);
          }  else {
              APIService.trash(urlConstant.baseUrl + urlConstant.performsyncData+'/'+key);
              commit('performsyncData', {
                type: 'UPDATED_SYNC_DATA',
                data: res.data,
              });
              APIService.get(urlConstant.baseUrl + urlConstant.sfsync);
              APIService.get(urlConstant.baseUrl + urlConstant.odoosync);
            }
          
        }
        
       
      );
      
    },
};
    export default {
        namespaced: true,
        state,
        actions,
        mutations,
      };
      