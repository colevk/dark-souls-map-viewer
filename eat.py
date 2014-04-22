#!/usr/bin/env python3
 
# converts the .iv file format used by dksmv-0.2 into .obj
 
from struct import unpack_from
import sys
 
data = open(sys.argv[1],"rb").read()
 
num_models = unpack_from("<I", data)[0]
 
for i in range(num_models):
    out = open("{0}_{1}.obj".format(sys.argv[1],i), "w")

    out.write("# {1} - Model {0}\n".format(i, sys.argv[1]))
    (tris_offset, num_tris, verts_offset, 
        num_verts) = unpack_from("<IIII", data, 16*(i+1))
    num_tris //= 3

    for j in range(num_verts):
        vert = unpack_from("<fff", data, verts_offset + (j * 12))
        out.write("v {0} {1} {2}\n".format(*vert))

    for j in range(num_tris):
        tri = unpack_from("<HHH", data, tris_offset + (j * 6))
        tri = tuple(x + 1 for x in tri)
        out.write("f {0} {1} {2}\n".format(*tri))

    out.close()
data.close()