
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

//for auto scroll
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

//for notification
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'

Vue.use(Toaster, {timeout: 5000})

import VuejsDialog from "vuejs-dialog"

Vue.use(VuejsDialog)

import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data: {
        message:'',
        chat: {
            message:[],
            user:[],
            color: [],
            time: []
        },
        typing: '',
        numberOfUsers:0
    },

    watch: {
        message() {
            Echo.private('chat')
                .whisper('typing', {
                    name: this.message
                });
        }
    },

    methods: {
        send() {
            if (this.message.length != 0) {
                this.chat.message.push(this.message);
                this.chat.user.push('you');
                this.chat.color.push('success');
                this.chat.time.push(this.getTime());

                axios.post('/send', {
                    message: this.message,
                    chat: this.chat
                }).then(response => {
                    console.log(response);
                    this.message = '';
                }).catch(error => {
                    console.log(error);
                });
            }
        },

        getTime() {
            let time = new Date();
            return time.getHours() + ":" + time.getMinutes();
        },

        getOldMessage() {
            axios.post('/getmsg')
                .then(response => {
                    console.log(response);
                    if (response.data != '') {
                        this.chat = response.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        },

        deleteSession() {
            axios.post('/deletemsg')
                .then(response => this.$toaster.success('Chats have already deleted')
                );
        },

        leave() {
            axios.post('/leave').then(response => {
                if (response.status == 200) {
                    location.href ="/login";
                }
            })
        },

        doNothing() {

        }
    },

    mounted() {
        this.getOldMessage();
        Echo.private('chat')
            .listen('ChatEvent', (e) => {
                this.chat.message.push(e.message);
                this.chat.user.push(e.user);
                this.chat.color.push('warning');
                this.chat.time.push(this.getTime());

                axios.post('/savemsg', {
                    chat: this.chat
                }).then(response => {
                }).catch(error => {
                    console.log(error);
                });

            }).listenForWhisper('typing', (e) => {
                if (e.name != '') {
                    this.typing = 'typing...';
                }
                else {
                    this.typing = '';
                }
        });

        Echo.join(`chat`)
            .here((users) => {
                this.numberOfUsers = users.length;
            }).joining((user) => {
                this.numberOfUsers += 1;
                this.$toaster.success(user.name + ' joined the chat room')
            }).leaving((user) => {
                this.numberOfUsers -= 1;
                this.$toaster.warning(user.name + ' left the chat room')
    });
        }
});
