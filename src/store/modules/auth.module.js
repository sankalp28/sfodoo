import { APIService } from '@/service/api.js';
import urlConstant from '@/constants/uri.constants.js';

const state =
{
    token: localStorage.getItem('user-token') || '',
    status: {},
    syncstatus: {}
};

const mutations = {
    login(state, payload) {
        switch (payload.type) {
            case 'LOGGING_LOGIN':
                state.status = {

                    islogginglogin: true,
                    issucesslogin: false,
                    iserrorlogin: false,
                    isresStatus: {}

                }
                break;
            case 'SUCCESS_LOGIN':
                state.status = {

                    islogginglogin: false,
                    issucesslogin: true,
                    iserrorlogin: false,
                    isresStatus: payload.data

                }
                break;


            case 'FAILURE_LOGIN':
                state.status = {

                    islogginglogin: false,
                    issucesslogin: false,
                    iserrorlogin: true,
                    isresStatus: payload.data

                }
                break;


        }
    }
};
const actions = {
    login({ commit }, user) {
        commit('login', { type: 'LOGGING_LOGIN' });
        APIService.get(urlConstant.baseUrl + urlConstant.login, { auth: user }).then((res) => {

            if (res.status === 200) {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', user)
                // console.log("success")
                APIService.get(urlConstant.baseUrl + urlConstant.syncstatus)
                    .then((response) => {
                        commit('login', { type: 'SUCCESS_LOGIN', data: response.data })
                    })
            }
            else {

                if (res.status == -1) {
                    commit('login', { type: 'FAILURE_LOGIN', data: { status: "failed" } })
                }
            }
        })

    },
    // logout({commit}){
    //     return new Promise((resolve) => {
    //       commit('logout')
    //       localStorage.removeItem('token')
    //       delete APIService.defaults.headers.common['Authorization']
    //       resolve()
    //     })
    //   }
};
export default {

    namespaced: true,
    state,
    actions,
    mutations
};