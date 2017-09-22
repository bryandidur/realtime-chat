<?php

namespace App\Http\Controllers;

use Auth;
use App\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class MessagesController extends Controller
{
    /**
     * Message model.
     *
     * @var App\Message
     */
    private $messageModel;

    /**
     * Create a new controller instance.
     *
     * @param App\Message $messageModel
     * @return void
     */
    public function __construct(Message $messageModel)
    {
        $this->messageModel = $messageModel;
    }

    /**
    * Show messages form.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        return view('chat');
    }

    /**
    * Get all messages.
    *
    * @return Message
    */
    public function getMessages()
    {
        $messages = $this->messageModel->with('user')->get();

        return response()->json($messages);
    }

    /**
    * Persist message to database.
    *
    * @param  Request $request
    * @return Response
    */
    public function sendMessage(Request $request)
    {
        $authUser = Auth::user();

        $message = $this->messageModel->create([
            'user_id' => $authUser->id,
            'message' => $request->input('message')
        ]);

        $message->user = $authUser;

        broadcast(new MessageSent($message, $authUser))->toOthers();

        return response()->json($message, 201);
    }
}
