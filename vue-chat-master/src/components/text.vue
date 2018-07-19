<script>
import { actions } from '../store';

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    //sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };
}());

export default {
    vuex: {
        actions: actions,
		getters: {
            // 过滤后的会话列表
            sessions: ({ sessions, filterKey }) => {
                let result = sessions.filter(session => session.user.name.includes(filterKey));
                return result;
            },
            // 当前会话index
            currentId: ({ currentSessionId }) => currentSessionId
        }
    },
    data () {
        return {
            content: ''
        };
    },
    methods: {
        onKeyup (e) {
            if (e.keyCode === 13 && this.content.length) {
                this.sendMessage(this.content);
				var payloadToWatson = {};
				if (this.content) {
					payloadToWatson.input = {
						text: this.content,
					};
				};
				var context;
				var latestResponse = Api.getResponsePayload();
				if (latestResponse) {
					context = latestResponse.context;
				}
				if (context) {
					payloadToWatson.context = context;
				}
				//console.log(this.currentId);
				if (this.currentId === 1){
				    payloadToWatson.workspace_id = '8313b8a2-2506-47fb-8f15-2efb1f108738';
				} else if (this.currentId === 2) {
				    payloadToWatson.workspace_id = '833e8802-e4a3-465d-942f-b9015bb15ad7';
				} else if (this.currentId === 3) {
					payloadToWatson.workspace_id = 'd13ebccd-cb35-4f00-987f-03d16e296877';
				} else {
					payloadToWatson.workspace_id = '';
				}
				if (payloadToWatson.workspace_id){
					this.$http.post('/api/message', JSON.stringify(payloadToWatson))
					.then((data) => {
						this.getMessage(data.body.output.text);
						console.log(data.body);
						console.log(payloadToWatson.workspace_id);
						//this.arrs = data.body;
					},
					(err) => {
						this.getMessage('哎呀，系统出错了，请刷新一下页面>_<~');
					});
				}
				this.content = '';
			}
        }
    }
}

</script>

<template>
<div class="text">
    <input placeholder="按 Enter 发送" v-model="content" @keyup="onKeyup"></input>
</div>
</template>

<style lang="less" scoped>
.text {
    height: 40px;
    border-top: solid 1px #ddd;

    input {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
    }
}
</style>