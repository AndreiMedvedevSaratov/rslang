import axios from 'axios';

/** Instructions for working with actions
 * link https://vuex.vuejs.org/api/#actions
 */
const actions = {
	async AUTH_REQUEST({
		rootState, commit, dispatch,
	}) {
		commit('AUTH_REQUEST');
		const user = await axios.post(`${rootState.app.server}/signin`, {
			email: rootState.user.profile.email,
			password: rootState.user.profile.password,
		})
			.catch((err) => {
				commit('AUTH_ERROR', err.response);
				localStorage.removeItem('token');
				dispatch('ALERT', { status: 'error', data: err.response.data });
			});

		localStorage.setItem('token', user.data.token);
		commit('AUTH_SUCCESS', user.data);
		axios.defaults.headers.common.Authorization = user.data.token;

		commit('user/USER_SUCCESS', user.data, { root: true });
	},
	AUTH_LOGOUT({ commit }) {
		return new Promise(((resolve) => {
			commit('AUTH_LOGOUT');
			localStorage.removeItem('token');
			resolve();
		}));
	},

};

/**
 * Instructions for working with mutations
 * link https://vuex.vuejs.org/guide/mutations.html
 */
const mutations = {
	AUTH_REQUEST: (state) => {
		state.status = 'loading';
	},
	AUTH_SUCCESS: (state, payload) => {
		state.status = 'success';
		state.token = payload.token;
	},
	AUTH_ERROR: (state) => {
		state.status = 'error';
	},
	AUTH_LOGOUT: (state) => {
		state.token = '';
	},
};

/**
 * Instructions for working with getters
 * link https://vuex.vuejs.org/api/#getters
 */
const getters = {
	isAuthenticated: (state) => !!state.token,
	authStatus: (state) => state.status,
	isLoading: (state) => state.status === 'loading',
};

const state = {
	token: localStorage.getItem('token') || '',
	status: '',
};

export default {
	// namespaced false. To make it available throughout the project without special pointers.
	namespaced: false,
	state,
	getters,
	actions,
	mutations,
};
