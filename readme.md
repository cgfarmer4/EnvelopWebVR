EnvelopWebVR
===================
Perform live or render audio reactive 2D, 3D and VR visuals using data from Ableton Live, Max and E4L. 
=.+.+.=

#### What can I do with this code?
- Quick inspection of spatial audio mixes aligned with graphical object movement. 
(Does not currently support reverberations and reflections from the graphical environment like most game audio SDKs.)
- Perform live audio reactive visuals across multiple devices using WebSockets and WebGL.
- Create, save and export keyframe rendering data with tweening / easing support for WebGL object properties.
- Record Envelop for Live vector movements, channel levels and reassign those values to WebGL object properties.
- Host a UDP <-> WebSocket event parsing server that sends data between Max, Ableton and your web browser of choice.
- Render scene in 4k 360 and merge with B format audio for YouTube, Vimeo and Facebook 360. 

#### Examples

#### Tutorials
[Getting started with WebVR and Spatial Audio] (http://chasefarmer.com/articles/2017-01-09-getting-started-with-webvr-and-spatial-audio/)
[Getting started with WebVR and Spatial Audio part 2] (http://chasefarmer.com/articles/2017-02-16-webvr-and-spatial-audio-part-2/)

#### Future 
- Daydream controller as vector input
- 1080p/2D Render
- Binaural decoder support over WebSocket
- Binaural HRTF visualization
- Scene Timeline
- Two-way OSC messaging of input positioning like Oculus SDK
- MIDI Input / Messaging

#### Known Issues
- Timeline blurry on retina screens. 
- Antialias WebGL Renderer FPS performance on retina
- UDP Server connections limit error.

If you find other issues, please file them on Github or even better open a pull request :D.

#### Related Articles 

https://francois.pitie.net/2016/05/05/360-audio-youtube-upload/
