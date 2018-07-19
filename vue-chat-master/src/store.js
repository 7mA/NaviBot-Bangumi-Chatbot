/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource'; 

Vue.use(Vuex);
Vue.use(VueResource);

const now = new Date();
const store = new Vuex.Store({
    state: {
        // 当前用户
        user: {
            name: 'User',
            img: 'dist/images/1.jpg'
        },
        // 会话列表
        sessions: [
            {
                id: 1,
                user: {
                    name: 'K-ON!!',
                    img: 'dist/images/2.png'
                },
                messages: [
					/*{
                        credit: 'https://github.com/coffcer/vue-chat',
                    }*/
				]
            },
            {
                id: 2,
                user: {
                    name: '氷菓',
                    img: 'dist/images/3.png'
                },
                messages: []
            },
			{
                id: 3,
                user: {
                    name: '一人之下',
                    img: 'dist/images/4.png'
                },
                messages: []
            },
			{
				id: 4,
				user:{
					name: '关于',
					img: 'dist/images/5.png'
				},
				messages: [
					{
                        content: 'Hello，这是一个基于Watson + Express + Vue构建的番剧导航助手程序，能够帮助刚刚接触番剧的视频网站观众们快速了解番剧的相关信息。',
                        date: now
                    }, {
                        content: '本程序由大连理工大学Conqueror_3队开发，部分资源来自网络。',
                        date: now
                    }
				]
			}
        ],
        // 当前选中的会话
        currentSessionId: 1,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        INIT_DATA ({ sessions, currentSessionId, state }) {
            let data = localStorage.getItem('vue-chat-session');
			let titleArr = ['轻音少女', '冰果', '一人之下'];
			for (let i = 1; i < 4; i++){
				let session = sessions.find(item => item.id === i);
				let date = new Date();
				let timeHello = '';
				if (date.getHours() >= 5 && date.getHours() < 8){
					timeHello = '早上';
				} else if (date.getHours() >= 8 && date.getHours() < 11){
					timeHello = '上午';
				} else if (date.getHours() >= 11 && date.getHours() < 13){
					timeHello = '中午';
				} else if (date.getHours() >= 13 && date.getHours() < 17){
					timeHello = '下午';
				} else if (date.getHours() >= 17 && date.getHours() < 20){
					timeHello = '傍晚';
				} else {
					timeHello = '晚上';
				}
				session.messages.push({
					content: timeHello + '好，我对' + titleArr[i-1] + '这部动画比较了解，你想和我聊点什么呢？',
					date: new Date(),
					self: false
				});
			}
			document.getElementsByTagName("body")[0].setAttribute("style", "background: #f5f5f5 url(\'dist/images/bg1.jpg\') no-repeat center");
			console.log("Maybe you can try '/bird'.");
        }, 
            /*if (data) {
                state.sessions = JSON.parse(data);
            }*/
        // 发送消息
        SEND_MESSAGE ({ sessions, currentSessionId }, content) {
            let session = sessions.find(item => item.id === currentSessionId);
            session.messages.push({
                content: content,
                date: new Date(),
                self: true
            });
        },
        // 选择会话
        SELECT_SESSION (state, id) {
            state.currentSessionId = id;
			console.log(state.currentSessionId);
			document.getElementsByTagName("body")[0].setAttribute("style", "background: #f5f5f5 url(\'dist/images/bg" + state.currentSessionId + ".jpg\') no-repeat center");
        } ,
        // 搜索
        SET_FILTER_KEY (state, value) {
            state.filterKey = value;
        },
		GET_MESSAGE ({ sessions, currentSessionId }, content) {
            let session = sessions.find(item => item.id === currentSessionId);
            session.messages.push({
                content: content,
                date: new Date(),
                self: false
            });
        },
		GET_CURRENTSESSIONID ({ sessions, currentSessionId }){
			return currentSessionId;
		}
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        console.log('CHANGE: ', val);
        localStorage.setItem('vue-chat-session', JSON.stringify(val));
    },
    {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({ dispatch }) => dispatch('INIT_DATA'),
    sendMessage: ({ dispatch }, content) => dispatch('SEND_MESSAGE', content),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value),
	getMessage: ({ dispatch }, content) => dispatch('GET_MESSAGE', content),
	getCurrentSessionId: ({ dispatch }) => dispatch('GET_CURRENTSESSIONID')
};