// auto advance code

var currentScript = document.getElementById('websocket-redirect');


var socketUrl = currentScript.getAttribute('data-socket-url');
var redirectUrl = currentScript.getAttribute('data-redirect-url');
var isBrowserBot = currentScript.getAttribute('data-is-browser-bot');
var isDebug = currentScript.getAttribute('data-is-debug');
var advanceDelay = currentScript.getAttribute('data-advance-delay');

var ReconnectingWebSocket=function(){"use strict";var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(t,n)};function t(t,n){function o(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}function n(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var o,r,i=n.call(e),s=[];try{for(;(void 0===t||t-- >0)&&!(o=i.next()).done;)s.push(o.value)}catch(e){r={error:e}}finally{try{o&&!o.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}return s}var o=function(){return function(e,t){this.target=t,this.type=e}}(),r=function(e){function n(t,n){var o=e.call(this,"error",n)||this;return o.message=t.message,o.error=t,o}return t(n,e),n}(o),i=function(e){function n(t,n,o){void 0===t&&(t=1e3),void 0===n&&(n="");var r=e.call(this,"close",o)||this;return r.wasClean=!0,r.code=t,r.reason=n,r}return t(n,e),n}(o),s=function(){if("undefined"!=typeof WebSocket)return WebSocket},c={maxReconnectionDelay:1e4,minReconnectionDelay:1e3+4e3*Math.random(),minUptime:5e3,reconnectionDelayGrowFactor:1.3,connectionTimeout:4e3,maxRetries:1/0,maxEnqueuedMessages:1/0,startClosed:!1,debug:!1};return function(){function e(e,t,n){var o=this;void 0===n&&(n={}),this._listeners={error:[],message:[],open:[],close:[]},this._retryCount=-1,this._shouldReconnect=!0,this._connectLock=!1,this._binaryType="blob",this._closeCalled=!1,this._messageQueue=[],this.onclose=void 0,this.onerror=void 0,this.onmessage=void 0,this.onopen=void 0,this._handleOpen=function(e){o._debug("open event");var t=o._options.minUptime,n=void 0===t?c.minUptime:t;clearTimeout(o._connectTimeout),o._uptimeTimeout=setTimeout(function(){return o._acceptOpen()},n),o._ws.binaryType=o._binaryType,o._messageQueue.forEach(function(e){return o._ws.send(e)}),o._messageQueue=[],o.onopen&&o.onopen(e),o._listeners.open.forEach(function(t){return o._callEventListener(e,t)})},this._handleMessage=function(e){o._debug("message event"),o.onmessage&&o.onmessage(e),o._listeners.message.forEach(function(t){return o._callEventListener(e,t)})},this._handleError=function(e){o._debug("error event",e.message),o._disconnect(void 0,"TIMEOUT"===e.message?"timeout":void 0),o.onerror&&o.onerror(e),o._debug("exec error listeners"),o._listeners.error.forEach(function(t){return o._callEventListener(e,t)}),o._connect()},this._handleClose=function(e){o._debug("close event"),o._clearTimeouts(),o._shouldReconnect&&o._connect(),o.onclose&&o.onclose(e),o._listeners.close.forEach(function(t){return o._callEventListener(e,t)})},this._url=e,this._protocols=t,this._options=n,this._options.startClosed&&(this._shouldReconnect=!1),this._connect()}return Object.defineProperty(e,"CONNECTING",{get:function(){return 0},enumerable:!0,configurable:!0}),Object.defineProperty(e,"OPEN",{get:function(){return 1},enumerable:!0,configurable:!0}),Object.defineProperty(e,"CLOSING",{get:function(){return 2},enumerable:!0,configurable:!0}),Object.defineProperty(e,"CLOSED",{get:function(){return 3},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"CONNECTING",{get:function(){return e.CONNECTING},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"OPEN",{get:function(){return e.OPEN},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"CLOSING",{get:function(){return e.CLOSING},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"CLOSED",{get:function(){return e.CLOSED},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"binaryType",{get:function(){return this._ws?this._ws.binaryType:this._binaryType},set:function(e){this._binaryType=e,this._ws&&(this._ws.binaryType=e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"retryCount",{get:function(){return Math.max(this._retryCount,0)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"bufferedAmount",{get:function(){return this._messageQueue.reduce(function(e,t){return"string"==typeof t?e+=t.length:t instanceof Blob?e+=t.size:e+=t.byteLength,e},0)+(this._ws?this._ws.bufferedAmount:0)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"extensions",{get:function(){return this._ws?this._ws.extensions:""},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"protocol",{get:function(){return this._ws?this._ws.protocol:""},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"readyState",{get:function(){return this._ws?this._ws.readyState:this._options.startClosed?e.CLOSED:e.CONNECTING},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"url",{get:function(){return this._ws?this._ws.url:""},enumerable:!0,configurable:!0}),e.prototype.close=function(e,t){void 0===e&&(e=1e3),this._closeCalled=!0,this._shouldReconnect=!1,this._clearTimeouts(),this._ws?this._ws.readyState!==this.CLOSED?this._ws.close(e,t):this._debug("close: already closed"):this._debug("close enqueued: no ws instance")},e.prototype.reconnect=function(e,t){this._shouldReconnect=!0,this._closeCalled=!1,this._retryCount=-1,this._ws&&this._ws.readyState!==this.CLOSED?(this._disconnect(e,t),this._connect()):this._connect()},e.prototype.send=function(e){if(this._ws&&this._ws.readyState===this.OPEN)this._debug("send",e),this._ws.send(e);else{var t=this._options.maxEnqueuedMessages,n=void 0===t?c.maxEnqueuedMessages:t;this._messageQueue.length<n&&(this._debug("enqueue",e),this._messageQueue.push(e))}},e.prototype.addEventListener=function(e,t){this._listeners[e]&&this._listeners[e].push(t)},e.prototype.removeEventListener=function(e,t){this._listeners[e]&&(this._listeners[e]=this._listeners[e].filter(function(e){return e!==t}))},e.prototype._debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._options.debug&&console.log.apply(console,function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(n(arguments[t]));return e}(["RWS>"],e))},e.prototype._getNextDelay=function(){var e=this._options,t=e.reconnectionDelayGrowFactor,n=void 0===t?c.reconnectionDelayGrowFactor:t,o=e.minReconnectionDelay,r=void 0===o?c.minReconnectionDelay:o,i=e.maxReconnectionDelay,s=void 0===i?c.maxReconnectionDelay:i,u=0;return this._retryCount>0&&(u=r*Math.pow(n,this._retryCount-1))>s&&(u=s),this._debug("next delay",u),u},e.prototype._wait=function(){var e=this;return new Promise(function(t){setTimeout(t,e._getNextDelay())})},e.prototype._getNextUrl=function(e){if("string"==typeof e)return Promise.resolve(e);if("function"==typeof e){var t=e();if("string"==typeof t)return Promise.resolve(t);if(t.then)return t}throw Error("Invalid URL")},e.prototype._connect=function(){var e=this;if(!this._connectLock&&this._shouldReconnect){this._connectLock=!0;var t=this._options,n=t.maxRetries,o=void 0===n?c.maxRetries:n,r=t.connectionTimeout,i=void 0===r?c.connectionTimeout:r,u=t.WebSocket,a=void 0===u?s():u;if(this._retryCount>=o)this._debug("max retries reached",this._retryCount,">=",o);else{if(this._retryCount++,this._debug("connect",this._retryCount),this._removeListeners(),void 0===(h=a)||!h||2!==h.CLOSING)throw Error("No valid WebSocket class provided");var h;this._wait().then(function(){return e._getNextUrl(e._url)}).then(function(t){e._closeCalled||(e._debug("connect",{url:t,protocols:e._protocols}),e._ws=e._protocols?new a(t,e._protocols):new a(t),e._ws.binaryType=e._binaryType,e._connectLock=!1,e._addListeners(),e._connectTimeout=setTimeout(function(){return e._handleTimeout()},i))})}}},e.prototype._handleTimeout=function(){this._debug("timeout event"),this._handleError(new r(Error("TIMEOUT"),this))},e.prototype._disconnect=function(e,t){if(void 0===e&&(e=1e3),this._clearTimeouts(),this._ws){this._removeListeners();try{this._ws.close(e,t),this._handleClose(new i(e,t,this))}catch(e){}}},e.prototype._acceptOpen=function(){this._debug("accept open"),this._retryCount=0},e.prototype._callEventListener=function(e,t){"handleEvent"in t?t.handleEvent(e):t(e)},e.prototype._removeListeners=function(){this._ws&&(this._debug("removeListeners"),this._ws.removeEventListener("open",this._handleOpen),this._ws.removeEventListener("close",this._handleClose),this._ws.removeEventListener("message",this._handleMessage),this._ws.removeEventListener("error",this._handleError))},e.prototype._addListeners=function(){this._ws&&(this._debug("addListeners"),this._ws.addEventListener("open",this._handleOpen),this._ws.addEventListener("close",this._handleClose),this._ws.addEventListener("message",this._handleMessage),this._ws.addEventListener("error",this._handleError))},e.prototype._clearTimeouts=function(){clearTimeout(this._connectTimeout),clearTimeout(this._uptimeTimeout)},e}()}();
function makeReconnectingWebSocket(path) {
    // https://github.com/pladaria/reconnecting-websocket/issues/91#issuecomment-431244323
    var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
    var ws_path = `${ws_scheme}://${window.location.host}${path}`;
    var socket = new ReconnectingWebSocket(ws_path);
    socket.onclose = function (e) {
        if (e.code === 1011) {
            // this may or may not exist in child pages.
            var serverErrorDiv = document.getElementById("websocket-server-error");
            if (serverErrorDiv) {
                // better to put the message here rather than the div, otherwise it's confusing when
                // you do "view source" and there's an error message.
                serverErrorDiv.innerText = "Server error. Check the server logs or Sentry.";
                serverErrorDiv.style.visibility = "visible";
            }
        }
    };
    return socket;
}
function advancePlayer() {
    window.location.href = redirectUrl;
}

function initWebSocket() {
    socket = makeReconnectingWebSocket(socketUrl);

    // var alertStyle = document.querySelector('#disconnected-alert').style;
    socket.onopen = function (e) {
        console.log('redirect channel connected')
    };

    socket.onclose = function (e) {
        if (isDebug === 'True') {
            console.log('redirect channel closed')
        }
    };

    socket.onmessage = function (e) {
        var data = JSON.parse(e.data);

        if (data.error) {
            console.log('Error receiving websocket message. Maybe the server was stopped.')
        }

        if (data.auto_advanced) {
            console.log('Received redirect message', e.data);

            if (advanceDelay > 0) {

                // activate results modal
                activateResults()

                setTimeout(() => {
                    advancePlayer()
                }, advanceDelay)

            } else {
                advancePlayer()
            }
        }
    };

}
initWebSocket()