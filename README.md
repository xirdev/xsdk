xsdk
====

This repository contains simple examples for the new XirSys platform.  Each of the examples are created to make it easier to use and understand the XirSys API. Eventually, this repo will house the public SDK for XirSys.

The SDK and demos are still in active development. At present the Signal and SimpleWebRTC demos are up to date and functional examples of the Xirsys platform. The other demos will be brought up to speed and added to this repository soon. 

To get started we recommend reading the WebRTC Walkthrough documentation.

Changes
-------

##### 07/09/2016
Update SimpleWebRTC demo to use XirSys signalling.

##### 22/12/2015
All demos have been updated over the last six months. A walkthrough guide has been added.

##### 23/06/2015
Removed non-working demos for now, leaving only signalling and SimpleWebRTC demos. Other demos will be added back to this repo shortly.

##### 03/06/2015
Multitude of small improvements, focusing on setting the Signal and WebRTC demos working well.

##### 20/03/2015
Added screenshare example. To use, invoke Chrome with flags:

    --enable-usermedia-screen-capturing  // enable screen capture

    --allow-http-screen-capture  // enable non-SSL domain support (for localhost testing)

Updated docs to conform to new signalling packet type.

##### 31/03/2015
Implement handshake for pub/sub (one-to-many).  Pub/sub is still in development and cannot be used. However, the publish example shows how pub/sub handshakes can be implemented, now.  See docs for further info.

SimpleWebRTC
------------

The SimpleWebRTC demo is a great example of using the XirSys platform. The signalling for the SimpleWebRTC demo is based off of the demo server supplied by &Yet for use with SimpleWebRTC. The version of SimpleWebRTC supplied in the thirdparty directory is the standard and latest distribution of SimpleWebRTC. This is augmented by the files in the lib directory which update SimpleWebRTC to be compatible with both XirSys signalling and XirSys TURN servers.
