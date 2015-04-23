##Dark Souls Map Viewer

WebGL/three.js implementation of a map viewer for _Dark Souls_ and _Dark Souls 2_, using the games' collision data.

###Details

Inspired by Vlad001's [dksmv](http://forum.xentax.com/viewtopic.php?f=16&t=7876&start=60), from which I took the extracted map files for _Dark Souls_ (rehosted by Kayin Nasaki [here](http://kayin.pyoko.org/?p=2218)). There is also the [Dark Souls Map Explorer](http://kayin.pyoko.org/?p=2249), created by Kayin Nasaki. The map files for _Dark Souls 2_ were extracted by [Ispohr](http://www.reddit.com/r/DarkSouls2/comments/21kxov/dark_souls_2_map_viewer/). The .iv file format was deciphered by looking at Allanlw's [eat.py](https://gist.github.com/allanlw/8214620). Wireframe rendering taken from [Florian Boesch's guide](http://codeflow.org/entries/2012/aug/02/easy-wireframe-display-with-barycentric-coordinates/) and from [B&aelig;rentze et al](http://webstaff.itn.liu.se/~andyn/courses/tncg08/sketches06/sketches/0505-baerentzen.pdf).

The font used in the icons is Optimus Princeps Semi Bold.

###.iv File Format
The .iv file format stores a number of triangle meshes together in index array format.

First 4 bytes: uint32 containing number of chunks.<br>
Next 12 bytes: 3 float32s, use unknown.<br>
Next 16 * (number of chunks) bytes: 4 uint32s containing:

 - Byte offset for start of vertex index data.
 - Number of indices.
 - Byte offset for start of vertex position data.
 - Number of vertices.

Vertex index data, 2 * (number of indices) bytes: 1 uint16 per index.<br>
Vertex position data, 12 * (number of vertices) bytes: 3 float32s per vertex.

###License

This content is released under the MIT License.
