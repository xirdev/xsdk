'use strict';

/*********************************************************************************
	The MIT License (MIT) 

	Copyright (c) 2014 XirSys

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

	********************************************************************************

	This script provides functionality for connecting to the 
	XirSys API endpoints.

	No external libraries are required. However, if supporting an
	older browser (earlier than Internet Explorer 8, Firefox 3.1, 
	Safari 4, and Chrome 3), then you may want to use the open
	source JSON library by Douglas Crockford :
	 (https://github.com/douglascrockford/JSON-js) 

*********************************************************************************/

(function () {

	/*********************************************************************************
	 * For full use of this class, see the information at the top of this script.
	 *********************************************************************************/

	$xirsys.class.create({
		namespace : 'api',
		constructor : function ($opts, $url) {
			if (!!$url) {
				$xirsys.api.getIceServers = $url + "ice";
			}
			this.data = $opts;
		},
		fields : {
			ice : null
		},
		methods : {
			connect : function ($opts) {
				var self = this;
				self.getToken($xirsys.signal.tokenUrl, $opts, function (td) {
					self.getSocketEndpoints(function (sd) {
						self.sock = new $xirsys.socket(sd + "/ws/" + td); //, {disableWebsocket:true, disableEventSource:true});
						self.sock.onmessage = self.handleData.bind(self);
						self.sock.onopen = self.onOpen.bind(self);
						self.sock.ondisconnect = self.onDisconnect.bind(self);
						self.sock.onclose = self.onClose.bind(self);
						self.sock.onerror = self.onError.bind(self);
					});
				});
			},
			getIceServers : function ($cb) {
				var self = this;
				$xirsys.ajax.do({
					url: $xirsys.api.getIceServers,
					method: 'GET',
					data: self.xirsys_opts
				}) 
				.done(function($data) {
					console.log($data);
					self.ice = {
					    iceServers: [
					        {url: "stun:23.21.150.121"},
					        {url: "stun:stun.l.google.com:19302"},
					        {url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com"}
					    ]
					}; //$data.d;
					$cb.apply(this, [self.ice]);
				});
			}
		},
		statics : {
			getIceServers : $xirsys.baseUrl + "ice"
		}
	});

})();
