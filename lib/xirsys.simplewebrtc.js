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

*********************************************************************************/

'use strict';

(function () {

	$xirsys.class.create({
		namespace : 'simplewebrtc',
		// $url must include a trailing forward stroke
		constructor : function ($url) {
			var c = $xirsys.simplewebrtc;
			if (!!$url) {
				c.tokenUrl = $url + 'signal/token';
				c.iceUrl = $url + 'ice';
				c.roomUrl = $url + 'room';
			}
		},
		fields : {
			connectionTypes: {
				default: 'default',
				direct: 'direct',
				server: 'server'
			},
			token : "",
			ice : [],
			xirsys_opts : null
		},
		methods : {
			connect : function ($opts, $rtcOpts) {
				this.xirsys_opts = $opts;
				$rtcOpts = $rtcOpts || {};
				$rtcOpts.url = "http://endpoint02.uswest.xirsys.com:8080";
				this.ref = new SimpleWebRTC($rtcOpts);
			},
			on : function ($ev, $fun) {
				this.ref.on($ev, $fun);
			},
			getDomId : function ($peer) {
				return this.ref.getDomId($peer);
			},
			capabilities : function () {
				return this.ref.capabilities;
			},
			createRoom : function ($room, $fun) {
				var self = this;
				if (!!$room) {
					this.xirsys_opts.room = $room;
				}
				self.xirsysRequest($xirsys.simplewebrtc.roomUrl, function ($a) {
					self.xirsysRequest($xirsys.simplewebrtc.tokenUrl, function ($data) {
						self.token = $data.d.token;
						self.xirsysRequest($xirsys.simplewebrtc.iceUrl, function ($idata) {
							self.ice = $idata.d.iceServers;
							self.ref.webrtc.config.peerConnectionConfig.iceServers = self.ice;
							self.ref.createRoom(self.token, $fun);
						});
					});
				});
			},
			joinRoom : function ($room) {
				var self = this;
				if (!!$room) {
					this.xirsys_opts.room = $room;
				}
				this.xirsysRequest($xirsys.simplewebrtc.tokenUrl, function ($data) {
					self.token = $data.d.token;
					self.xirsysRequest($xirsys.simplewebrtc.iceUrl, function ($idata) {
						self.ice = $idata.d.iceServers;
						self.ref.webrtc.config.peerConnectionConfig.iceServers = self.ice;
						self.ref.joinRoom(self.token);
					});
				});
			},
			leaveRoom : function() {
				this.ref.leaveRoom();
			},
			xirsysRequest : function ($url, $cb) {
				var self = this;
				$xirsys.ajax.do({
					url: $url,
					method: 'POST',
					data: self.xirsys_opts
				}) 
				.done($cb);
			},
			getLocalScreen : function () {
				return this.ref.getLocalScreen();
			},
			stopScreenShare : function () {
				this.ref.stopScreenShare();
			},
			shareScreen : function ($handle) {
				this.ref.shareScreen($handle);
			}
		},
		statics : {
			tokenUrl : $xirsys.baseUrl + "signal/token",
			iceUrl : $xirsys.baseUrl + "ice",
			roomUrl : $xirsys.baseUrl + "room"
		}
	});

})();
