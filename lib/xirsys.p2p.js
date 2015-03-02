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

  This script provides functionality for connecting using Peer-to-Peer 
  via the XirSys WebRTC services [STUN/TURN].

  No external libraries are required. However, if supporting an
  older browser (earlier than Internet Explorer 8, Firefox 3.1, 
  Safari 4, and Chrome 3), then you may want to use the open
  source JSON library by Douglas Crockford :
  (https://github.com/douglascrockford/JSON-js)

*********************************************************************************/

(function() {

  /*********************************************************************************
   * For full use of this class, see the information at the top of this script.
   *********************************************************************************/

  $xirsys.class.create( {
    namespace : 'p2p',
    constructor : function($config, $localVideo, $remoteVideo) {
      this.status = $xirsys.p2p.DISCONNECTED;
      this.useVideo = (!!$config.video);
      this.useAudio = (!!$config.audio);
      this.rtc.forceTurn = (!!$config.forceTurn);
      this.rtc.localVideo = $localVideo;
      this.rtc.remoteVideo = $remoteVideo;
    },
    inherits : $xirsys.api,
    fields : {
      status : null,
      signal : null,
      data : {
        username : null,
        password : null,
        domain : null,
        application : null,
        room : null
      },
      autoreply : null,
      rtc : {
        state : null,
        sdpConstraints : {'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }},
        useVideo : true,
        useAudio : true,
        forceTurn : false,
        localStream : null,
        remoteStream : null,
        localVideo : null,
        remoteVideo : null,
        peerConn : null,
        peer : null,
        ice : null,
        participant : null
      }
    },
    methods : {
      open : function($dom, $app, $room, $credentials, $autoreply) {
        if (!!this.signal && !this.signal.isClosed) this.close();
        if (!$credentials) {
          this.error('connect', 'User credentials should be specified.');
          return;
        }
        this.data.domain = $dom;
        this.data.application = $app;
        this.data.room = $room;
        this.autoreply = !!$autoreply;
        if (typeof $credentials === 'string') {
          this.data.username = $credentials;
        } else {
          this.data.type = $credentials.type;
          this.data.username = $credentials.user;
          this.data.password = $credentials.pass;
          if (!!$credentials.secret && !!$credentials.ident) { // only use for testing purposes
            this.data.ident = $credentials.ident;
            this.data.secret = $credentials.secret;
          }
        }
        this.signal = new $xirsys.signal();
        this.signal.onOpen = (this.onSignalOpen).bind(this);
        this.signal.onClose = (this.onSignalClose).bind(this);
        this.signal.onMessage = (this.onSignalMessage).bind(this);
        this.signal.connect(this.data);
        return this.signal;
      },
      close : function() {
        this.signal.close();
      },
      call : function($targetUser) {
        console.log("calling");
        this.rtc.peer = $targetUser;
        this.rtc.participant = $xirsys.p2p.CLIENT;
        this.status = $xirsys.p2p.CALLING;
        this.setConstraints();
        this.doPeerConnection((function() {
         console.log("doPeerConnection");
          var _constraints = {"optional": [], "mandatory": {"MozDontOfferDataChannel": true}};
          if (webrtcDetectedBrowser === "chrome")
            for (var prop in _constraints.mandatory)
              if (prop.indexOf("Moz") != -1) delete _constraints.mandatory[prop];
          _constraints = this.mergeConstraints(_constraints, this.rtc.sdpConstraints);
          this.rtc.peerConn.addStream(this.rtc.localStream);
          console.log("creating offer");
          this.rtc.peerConn.createOffer((this.setLocalAndSendMessage).bind(this), null, _constraints);
        }).bind(this));
      },
      hangUp : function() {
        // TODO
      },
      answer : function() {
        this.rtc.peerConn.createAnswer((this.setLocalAndSendMessage).bind(this), null);
      },
      createDataChannel : function() {
        // TODO
      },
      onSignalOpen : function() {
        this.doGetUserMedia();
      },
      onSignalClose : function() {
        // TODO
      },
      onSignalMessage : function($msg) {
        switch ($msg.data.type) {
          case "ice":
            this.onIceServers($msg.data.ice);
            break;
          case "offer":
            this.rtc.participant = $xirsys.p2p.PEER;
            if (!this.status == $xirsys.p2p.CALLING)
              this.status = $xirsys.p2p.ANSWERING;
            this.rtc.peer = $msg.sender;
            this.rtc.peerConn.setRemoteDescription(new RTCSessionDescription($msg.data));
            $xirsys.events.getInstance().dispatch(null, $xirsys.p2p.offer, this.status, this.rtc.peer);
            this.setConstraints();
            this.answer();
            break;
          case "answer":
            this.rtc.peerConn.setRemoteDescription(new RTCSessionDescription($msg.data));
            $xirsys.events.getInstance().dispatch(null, $xirsys.p2p.answer);
            break;
          case "candidate":
            this.rtc.peerConn.addIceCandidate(
              new RTCIceCandidate({
                sdpMLineIndex:$msg.data.label, 
                candidate:$msg.data.candidate
              })
            );
            break;
        }
      },
      onIceCandidate : function($evt) {
        console.log("onIceCandidate");
        if ($evt.candidate) {
          var components = event.candidate.candidate.split(" ");
          if (!(this.rtc.forceTurn && components[7] != "relay")) {
            this.signal.send('session', {
              type: 'candidate',
              label: $evt.candidate.sdpMLineIndex,
              id: $evt.candidate.sdpMid,
              candidate: $evt.candidate.candidate
            }, this.rtc.peer);
          }
        }
      },
      onIceServers : function($ice) {
        this.rtc.ice = $ice;
        var peer_constraints = {"optional": [{"DtlsSrtpKeyAgreement": true}]};
        try {
          this.rtc.peerConn = new RTCPeerConnection(this.rtc.ice, peer_constraints);
          this.rtc.peerConn.onicecandidate = this.onIceCandidate.bind(this);
          this.rtc.peerConn.onaddstream = this.onRemoteStreamAdded.bind(this);
        } catch (e) {
          this.rtc.onPeerConnectionError();
        }
      },
      onRemoteStreamAdded : function($evt) {
        console.log("remoteStreamAdded");
        attachMediaStream(this.rtc.remoteVideo, $evt.stream);
      },
      onUserMediaSuccess : function($stream) {
        attachMediaStream(this.rtc.localVideo, $stream);
        this.rtc.localStream = $stream;
      },
      onUserMediaError : function() {
        this.error("doGetUserMedia", "Could not get user media");
      },
      doPeerConnection : function($cb) {
        this.getIceServers((function($ice) {
          this.signal.send('session', {type: 'ice', ice: $ice}, this.rtc.peer);
          this.onIceServers($ice);
          $cb();
        }).bind(this));
      },
      onPeerConnectionError : function() {
        this.error("doPeerConnection", "Could not create peer connection");
      },
      doGetUserMedia : function() {
        var _constraint = {"audio": this.rtc.useAudio, "video": {"mandatory": {}, "optional": []}};
        try {
          getUserMedia(_constraint, (this.onUserMediaSuccess).bind(this), (this.onUserMediaError).bind(this));
        } catch (e) {
          this.onUserMediaError();
        }
      },
      setLocalAndSendMessage : function($sessionDescription) {
        this.rtc.peerConn.setLocalDescription($sessionDescription);
        console.log('session', $sessionDescription, this.rtc.peer);
        this.signal.send('session', $sessionDescription, this.rtc.peer);
      },
      mergeConstraints : function($c1, $c2) {
        var m = $c1;
        for (var n in $c2.mandatory)
          m.mandatory[n] = $c2.mandatory[n];
        m.optional.concat($c2.optional);
        return m;
      },
      setConstraints : function() {
        this.rtc.sdpConstraints = "{'mandatory': {'OfferToReceiveAudio':" + (!!this.rtc.useAudio).toString() + ", 'OfferToReceiveVideo':" + (!!this.rtc.useVideo).toString() + " }}"
      },
      error : function($func, $msg) {
        $xirsys.events.getInstance().dispatch(null, "p2p.error", $func, $msg);
      }
    },
    statics : {
      /* status */
      PEER : "peer",
      CLIENT : "client",
      DISCONNECTED : "disconnected",
      CONNECTED : "connected",
      CALLING : "calling",
      ANSWERING : "answering",
      /* events */
      offer : "p2p.offer",
      answer : "p2p.answer"
    }
  } );

} )();