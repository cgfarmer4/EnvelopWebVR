EnvelopWebVR
===================
Perform live or render audio reactive 2D, 3D and VR visuals using data from Ableton Live, Max and E4L. 

=.+.+.=

#### What can I do with this code?
- Quick inspection of spatial audio mixes aligned with graphical object movement. 
(Does not support reverberations and reflections from the graphical environment like most game audio SDKs. Definitely could though!)
- Perform live audio reactive visuals across multiple devices using WebSockets and WebGL.
- Create, save and export keyframe rendering data with tweening / easing support for WebGL object properties.
- Record Envelop for Live vector movements, channel levels and reassign those values to WebGL object properties.
- Host a UDP <-> WebSocket event parsing server that sends data between Max, Ableton and your web browser of choice.
- Render scene in 4k 360 and merge with B format audio for YouTube, Vimeo and Facebook 360. 

#### Tutorials
[Getting started with WebVR and Spatial Audio](http://chasefarmer.com/articles/2017-01-09-getting-started-with-webvr-and-spatial-audio/)

[Getting started with WebVR and Spatial Audio part 2](http://chasefarmer.com/articles/2017-02-16-webvr-and-spatial-audio-part-2/)

#### HTTPS Local Setup for WebVR
WebVR will display an error message about insecure content if you use a non HTTPS server with Chrome. In order to circumvent that `budo` has a way of emulating
an HTTPS server.
        
    npm run vr

#### Notes
- Omnitone only manipulates the binaural playback based on the camera quaternion. It does not interpret camera distance from center of audio placement.

- There are likely differences in the ambisonic interpretation between Envelop For Live -> B format -> Omnitone and these will stem from the different implementations of HRIR functions and HRTFs. This software is not meant to be an exact mathematical replica but rather a complimentary tool to what you're hearing in the DAW. The Omnitone implementation shows how the creative flow from sound design to finished WebVR product may occur. Please raise any discrepancies found in the channel implementation so they can be fixed. There is a custom FOA Decoder where you can provide your own HRTFs should you wish for better accuracy.

- This was developed using only Google Chrome, Android Chrome and Chrome Canary. You may experience rendering issues in other browsers, specifically with audio. See here for more details: https://github.com/GoogleChrome/omnitone#omnitone-spatial-audio-on-the-web


#### Future 
- Daydream controller as vector input
- Two-way OSC messaging of input positioning like Oculus SDK
- 1080p/2D Render
- Binaural decoder support over WebSocket
- Binaural HRTF visualization
- Better WebAudio visualization / support
- Scene Timeline
- MIDI input with Boolean / String record input tracks.

#### Known Issues
- Custom Max decoder for UDP server should be moved to Midway model and not Satellite.
- Browser scroll throws off timeline selections.
- Timeline blurry on retina screens. 
- Antialias WebGL Renderer FPS performance on retina
- UDP Server connections limit error.

If you find other issues, please file them on Github or even better open a pull request :D.

#### Reference
http://www.envelop.us/
https://github.com/EnvelopSound/EnvelopForLive
https://www.facebook.com/groups/E4LUsers/
https://github.com/cgfarmer4/three-audio-timeline
https://francois.pitie.net/2016/05/05/360-audio-youtube-upload/
https://github.com/GoogleChrome/omnitone
https://support.google.com/youtube/answer/7278886?hl=en
