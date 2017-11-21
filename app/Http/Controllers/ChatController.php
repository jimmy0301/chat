<?php

namespace App\Http\Controllers;

use App\Events\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Events\ChatEvent;


class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chat()
    {
        return view('chat');
    }

    public function chatPage()
    {
        $users = User::take(10)->get();
        return view('chat_new', ['users' => $users]);
    }

    public function sendMessage(Request $request)
    {
        $this->validate($request, [
            'userid' => 'required',
            'message' => 'required'
            ]);

        $message = [
          "id" => $request->userid,
            "sourceuserid" => Auth::user()->id,
            "name" => Auth::user()->name,
            "message" => $request->message
        ];

        event(new ChatMessage($message));
    }

    public function send(request $request)
    {
        //return $request->all();

        $user = User::find(Auth::id());
        $this->saveToSession($request);

        event(new ChatEvent($request->message, $user));
    }

    public function saveToSession(request $request)
    {
        session()->put('chat', $request->chat);
    }

    public function getOldMessage()
    {
        return session('chat');
    }

    public function deleteSession()
    {
        session()->forget('chat');
    }

    public function leave()
    {
        Auth::logout();
    }

    /*public function send()
    {
        $message = "Hello";
        $user = User::find(Auth::id());

        event(new ChatEvent($message, $user));
    }*/
}
