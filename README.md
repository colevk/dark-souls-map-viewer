##Dark Souls Map Viewer

WebGL/three.js implementation of a map viewer for _Dark Souls_ and _Dark Souls
2_, using the games' collision data.

###Usage

Run either `launch` or `server.py` and then go to
[http://localhost:8000](http://localhost:8000) in any web browser. They do the
same thing, but `launch` can be run directly from the Finder if you're on Mac.
Chrome is recommended, but it has been tested on Chrome, Firefox, and Safari
for OSX, and Chrome for Windows.

###Caveats

Doesn't work in Internet Explorer. Only Chrome and Firefox support pointer lock
controls, so in other browsers it's slighly awkward to move the camera. Some
browsers or computers might not support WebGL antialiasing, in which case
everything looks bad.

###Details

Inspired by Vlad001's
[dksmv](http://forum.xentax.com/viewtopic.php?f=16&t=7876&start=60), from which
I took the extracted map files for _Dark Souls_. Rehosted by Kayin Nasaki
[here](http://kayin.pyoko.org/?p=2218). There is also the [Dark Souls Map
Explorer](http://kayin.pyoko.org/?p=2249), created by Kayin Nasaki.

The map files for _Dark Souls 2_ were extracted by
[Ispohr](http://www.reddit.com/r/DarkSouls2/comments/21kxov/dark_souls_2_map_vie
wer/).

The .iv file format was deciphered by looking at Allanlw's
[eat.py](https://gist.github.com/allanlw/8214620).

Wireframe rendering taken from [Florian Boesch's
guide](http://codeflow.org/entries/2012/aug/02/easy-wireframe-display-with-baryc
entric-coordinates/) and from [B&#230;rentze et
al](http://webstaff.itn.liu.se/~andyn/courses/tncg08/sketches06/sketches/0505-ba
erentzen.pdf).

This content is released under the MIT License.
