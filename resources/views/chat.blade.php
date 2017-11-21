<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Document</title>
        <link rel="stylesheet" href="{{asset('css/app.css')}}">
        <style>
            .list-group {
                overflow-y: scroll;
                height: 200px;
            }
        
        </style>

    </head>
    <body>
        <div class="container">
            <div class="row" id="app">
                <div class="offset-4 col-4 offset-sm-1 col-sm-10">
                    <li class="list-group-item active">Chat Room <span class="badge
                    badge-pill badge-danger">@{{ numberOfUsers }}</span> </li>
                    <div class="badge badge-pill badge-primary">@{{ typing }}</div>
                    <ul class="list-group" v-chat-scroll>
                        
                        <message
                                v-for="value,index in chat.message"
                                :key=value.index
                                :color=chat.color[index]
                                :user=chat.user[index]
                                :time=chat.time[index]
                        > @{{ value }}

                        </message>
                    </ul>
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Type your message here..."
                            v-model="message" @keyup.enter='send'/>
                        <span class="input-group-btn">
                            <button class="btn btn-primary btn-sm" id="btn-chat" @click="send">
                            Send
                            </button>
                        </span>
                    </div>
                    <br>
                    <a href="" class="btn btn-warning btn-sm" @click.prevent="deleteSession">Delete Chats</a>
                    <a href="" class="btn btn-warning btn-sm offset-sm-1" v-confirm="{ok:leave, cancel: doNothing, message:'Are you sure to leave the chat room?'}">Leave Chat Room</a>
                </div>
            </div>
        </div>
        <script src="{{asset('js/app.js')}}"></script>
    </body>
</html>