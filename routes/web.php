<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('chat', 'ChatController@chatPage');
Route::post('sendmsg', 'ChatController@SendMessage');
Route::post('send', 'ChatController@send');
Route::post('savemsg', 'ChatController@saveToSession');
Route::post('deletemsg', 'ChatController@deleteSession');
Route::post('getmsg', 'ChatController@getOldMessage');
Route::post('leave', 'ChatController@leave');

Route::get('messages', 'ChatsController@fetchMessages');
Route::post('messages', 'ChatsController@sendMessage');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
