require('./bootstrap');

window.Vue = require('vue');

import VueResource from "vue-resource"

Vue.use(VueResource)

const app = new Vue({
    el: '#app',
    data: {
        chatMessage : [],
        userId : null,
        chats : [],
        chatWindows : [],
        chatStatus : 0,
        chatWindowStatus : [],
        chatCount : []
    },
    created(){
        window.Echo.channel('chat-message'+window.userid)
            .listen('ChatMessage', (e) => {
                console.log(e.user);
                this.userId = e.user.sourceuserid;
                if(this.chats[this.userId]){
                    this.show = 1;
                    this.$set(app.chats[this.userId], this.chatCount[this.userId] ,e.user);
                    this.chatCount[this.userId]++;
                    console.log("pusher");
                    console.log(this.chats[this.userId]);
                }else{
                    console.log("yes");
                    this.createChatWindow(e.user.sourceuserid,e.user.name);
                    this.$set(app.chats[this.userId], this.chatCount[this.userId] ,e.user);
                    this.chatCount[this.userId]++;
                }
            });
    },
    http: {
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    },
    methods: {
        sendMessage(event){
            this.userId = event.target.id;
            var message = this.chatMessage[this.userId];

            this.$http.post('sendmsg',{
                'userid' : this.userId,
                'message' : message
            }).then(response => {
                this.chatMessage[this.userId] = '';
                this.$set(app.chats[this.userId], this.chatCount[this.userId] , {
                    "message": message,
                    "name" : window.username
                });
                this.chatCount[this.userId]++;
                console.log("send");
            }, response => {
                this.error = 1;
                console.log("error");
                console.log(response);
            });
        },
        getUserId(event){
            console.log(event.target);
            this.userId = event.target.id;
            this.createChatWindow(this.userId, event.target.innerHTML);
            console.log(this.userId);
        },
        createChatWindow(userid, username){
            if(!this.chatWindowStatus[userid]){
                this.chatWindowStatus[userid] = 1;
                this.chatMessage[userid] = '';
                this.$set(app.chats, userid , {});
                this.$set(app.chatCount, userid , 0);
                this.chatWindows.push({"senderid" : userid , "name" : username});
            }
        },
        closeChatWindow(event) {
            var senderid = event.target.id
            console.log(event.target);
            for (var i = 0; i < this.chatWindows.length; i++) {
                if (this.chatWindows[i].senderid == senderid) {
                    this.chatWindows.splice(i, 1);
                    this.chatWindowStatus[senderid] = 0;
                    break;
                }
            }
        }
    }
});
