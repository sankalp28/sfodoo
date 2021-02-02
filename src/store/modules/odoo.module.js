import { APIService } from '@/service/api.js';
import urlConstant from '@/constants/uri.constants.js';

const state = {
  updateOdooData: {},
  odoofields:{},
};

const mutations = {
  odooUpdate(state, payload) {
    switch (payload.type) {
      case 'UPDATING_ODOO_DATA':
        state.updateOdooData = {
          isUpdatingOdooData: true,
          isUpdatedOdooData: false,
          errorUpdatingOdooData: false,
          responseData: {},
        };
        break;
      case 'UPDATED_ODOO_DATA':
        state.updateOdooData = {
          isUpdatingOdooData: false,
          isUpdatedOdooData: false,
          errorUpdatingOdooData: false,
          responseData: payload.data,
        };
        break;
    }
  },
  odoofields(state, payload) {
    switch (payload.type) {
      case 'FETCHING_ODOO_FIELDS':
        state.odoofields = {
          isFechingODOOFieldsData: true,
          errorFechingODOOFieldsData: false,
          responseData: {},
        };
        break;
      case 'FETCHED_ODOO_FIELDS':
        state.odoofields = {
          isFechingODOOFieldsData: false,
          errorFechingODOOFieldsData: false,
          responseData: payload.data,
        };
        break;
    }
  },
};

const actions = {
  actionUpdateOdoo({ commit, dispatch }, _obj) {
    commit('odooUpdate', { type: 'UPDATING_ODOO_DATA' });
    APIService.post(urlConstant.baseUrl + urlConstant.odooUpdate, _obj).then(
      res => {
        if (res.data.ref) {
          const key = res.data.ref.split('/');
          dispatch('actionUpdateProgressOdoo', key.pop());
        }
      }
    );
  },

  actionUpdateProgressOdoo({ commit, dispatch }, key) {
    APIService.get(
      urlConstant.baseUrl + urlConstant.odooUpdate + '/' + key
    ).then(res => {
      if (res.data.result.data.progress !== 100) {
        window.console.log('Fetch Progresssssss', res.data.result.data.progress);
        setTimeout(() => {
          dispatch('actionUpdateProgressOdoo', res.data.result.key);
        }, 1000);
      } else {
        APIService.trash(urlConstant.baseUrl + urlConstant.odooUpdate + '/' + key);
        console.log("res.data ---> ", res.data);
        commit('odooUpdate', {
          type: 'UPDATED_ODOO_DATA',
          data: res.data,
        });
      }
    });
  },
  actionodoofields({ commit,dispatch }){
    commit('odoofields', { type: 'FETCHING_ODOO_FIELDS' });
    APIService.get(urlConstant.baseUrl + urlConstant.odoofields).then(
        res => {
          if (res.data.ref)
           {
              const key = res.data.ref.split('/');
              dispatch('actionProgressodoo', key.pop());
              // commit('odoofields', { type: 'FETCHED_ODOO_FIELDS', data: res.data });
         }
          }
        ).catch((err)=>{
          console.log("actionfieldMap", err);
      });
  },
  actionProgressodoo({ commit, dispatch }, key) {
    APIService.get(urlConstant.baseUrl + urlConstant.odoofields+'/'+key).then(
      res => {
        // console.log('Fetch Progresssssss odoo field new ', res.data.result.data.response);
        if (res.data.result.data.progress !== 100 ) {
          setTimeout(() => {
            dispatch('actionProgressodoo', res.data.result.key);
          }, 1000);
        }  else {
          APIService.trash(urlConstant.baseUrl + urlConstant.odoofields+'/'+key);
            commit('odoofields', {
              type: 'FETCHED_ODOO_FIELDS',
              data: res.data,
            });
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
