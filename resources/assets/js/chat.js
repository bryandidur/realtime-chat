
var Chat = function ()
{
    var MessagesModel = function ()
    {
        var self = this;
        var messages = [];

        /**
         * Return all messages.
         *
         * @return array
         */
        self.getAll = function ()
        {
            return messages;
        };

        /**
         * Add message.
         *
         * @param string message
         */
        self.addMessage = function (message)
        {
            messages.push(message);
        };

        /**
         * Set messages.
         *
         * @param array msgs
         */
        self.setMessages = function (msgs)
        {
            if ( messages instanceof Array ) {
                messages = msgs;
            }
        };
    };

    var MessagesController = function (MessagesModel, MessagesView)
    {
        var self = this;
        self.model = new MessagesModel;
        self.view = new MessagesView(this);
        self.apiURL = '/messages';
        self.broadcastEvent = 'MessageSent';
        self.broadcastChannel = window.Echo.private('chat');

        /**
         * Initialize the controller.
         *
         * @return void
         */
        self.init = function ()
        {
            self.view.init();

            self.getData();
            self.bindBroadcastEventListener();
        };

        /**
         * Bind the broadcast event listener.
         *
         * @return void
         */
        self.bindBroadcastEventListener = function ()
        {
            self.broadcastChannel.listen(self.broadcastEvent, function (response) {
                var message = response.message;
                message.user = response.user;

                self.addMessage(message);
            });
        };

        /**
         * Add message to the model and re-render the messages list.
         *
         * @param string msg
         */
        self.addMessage = function (msg)
        {
            self.view.resetForm();

            self.model.addMessage(msg);

            self.view.renderList(self.model.getAll());
        };

        /**
         * Send the request to get all messages.
         *
         * @return void
         */
        self.getData = function ()
        {
            var promisesCallbacks = {
                success: function (messages)
                {
                    self.model.setMessages(messages);

                    self.view.renderList(self.model.getAll());
                },
                error: function (response)
                {
                    console.log('Cannot get data from server.', response);
                }
            };

            self.makeRequest('GET', self.apiURL, promisesCallbacks);
        };

        /**
         * Send the request for store the message.
         *
         * @param  string msg
         * @return void
         */
        self.sendMessage = function (msg)
        {
            if ( ! msg ) return;

            var data = {message: msg};
            var promisesCallbacks = {
                success: function (message)
                {
                    self.addMessage(message);
                },
                error: function (response)
                {
                    console.log('Cannot get data from server.', response);
                }
            };

            self.makeRequest('POST', self.apiURL, promisesCallbacks, data);
        };

        /**
         * Simple wrapper for HTTP requests.
         *
         * @param  string method
         * @param  string url
         * @param  object callbacks
         * @param  object data
         * @return void
         */
        self.makeRequest = function (method, url, callbacks, data)
        {
            var config = {url: url, method: method, data: data};

            $.ajax($.extend(config, callbacks));
        };
    };

    var MessagesView = function (MessagesController)
    {
        var self = this;
        self.listElem = $('#messages-list');
        self.formElem = $('#messages-form');
        self.itemTemplate = $('#messages-item').html();
        self.chatPanelElem = $('#chat-panel');
        self.controller = MessagesController;

        /**
         * Initialize the class.
         *
         * @return void
         */
        self.init = function ()
        {
            this.bindForm();
        }

        /**
         * Bind event listener to the chat form.
         *
         * @return void
         */
        self.bindForm = function ()
        {
            self.formElem.on('submit', function (event) {
                event.preventDefault();

                var message = this['message'].value;

                self.controller.sendMessage(message);
            });
        }

        /**
         * Render the messages list.
         *
         * @param  array messages
         * @return void
         */
        self.renderList = function (messages)
        {
            var listItems = '';
            self.listElem.html('');

            $.each(messages, function (index, message) {
                var listItem = self.itemTemplate;

                // Replace anchors
                listItem = listItem.replace('##user.name##', message.user.name);
                listItem = listItem.replace('##message##', message.message);

                listItems += listItem;
            });

            self.listElem.html(listItems);

            // Scroll chat panel to the bottom
            self.chatPanelElem.scrollTop(self.chatPanelElem[0].scrollHeight);
        };

        /**
         * Reset the chat form to initial state.
         *
         * @return void
         */
        self.resetForm = function ()
        {
            self.formElem.find('input').val('');
        }
    };

    /**
     * Initialize the Chat controller.
     *
     * @return void
     */
    var init = (function ()
    {
        var msgsController = new MessagesController(MessagesModel, MessagesView);

        msgsController.init();
    })();
};

module.exports = Chat;
