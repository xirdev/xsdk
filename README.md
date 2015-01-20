xsdk
====

This repository contains simple examples for the new XirSys beta platform.  Each of the examples are created to make it easier to use and understand the XirSys API. Eventually, this repo will house the public SDK for XirSys.

SimpleWebRTC
----

We have recently added a SimpleWebRTC demo to this repo.  The demo is based on the SimpleWebRTC example supplied by &yet, but has some slight alterations to make it work with our own signalling.  Please do give this a try and let us know what improvements your would like.

The SimpleWebRTC library passes a room name between peers.  XirSys requires that the room already exists, so we instead pass the user token internally.  When running the demo, make sure to enter a room you know to exist in your account.

We could quite simply have updated the demo so that the room was created via the XirSys room endpoint, but we felt it was more important to keep the demo as close to &yet's as possible, so that you, the developer, could see how it worked.