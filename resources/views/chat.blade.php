@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Chats</div>

                <div id="chat-panel" class="panel-body chat-panel">
                    <ul id="messages-list"></ul>
                </div>

                <div class="panel-footer">
                    <form id="messages-form">
                        <div class="input-group">
                            <input id="btn-input" type="text" name="message" class="form-control input-sm" placeholder="Type your message here...">
                            <span class="input-group-btn">
                                <button class="btn btn-sm btn-primary">Send</button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script id="messages-item" type="text/html">
    <li class="left clearfix">
        <div class="chat-body clearfix">
            <div class="header">
                <strong class="primary-font">##user.name##</strong>
            </div>
            <p>##message##</p>
        </div>
    </li>
</script>

@endsection
