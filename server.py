#!/usr/bin/env python

from __future__ import print_function

import os

try:
    # python 2
    from SimpleHTTPServer import SimpleHTTPRequestHandler
    from BaseHTTPServer import HTTPServer
    import SimpleHTTPServer
    test = SimpleHTTPServer.test
except ImportError:
    # python 3
    from http.server import SimpleHTTPRequestHandler
    from http.server import HTTPServer
    import http.server
    test = http.server.test

class GzipHTTPRequestHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        """Common code for GET and HEAD commands.

        We want to save space with the .iv files, so send them gzipped.
        This overrides the default headers only for .iv files.

        """
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            if not self.path.endswith('/'):
                self.send_response(301)
                self.send_header("Location", self.path + "/")
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
            else:
                return self.list_directory(path)
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except IOError:
            self.send_error(404, "File not found")
            return None
        self.send_response(200)

        # This part here is the only difference from the base class
        if self.path.endswith(".iv"):
            self.send_header("Content-type", "application/octet-stream")
            self.send_header("Content-Encoding", "gzip")
        else:
            self.send_header("Content-type", ctype)
        # No more differences after this

        fs = os.fstat(f.fileno())
        self.send_header("Content-Length", str(fs[6]))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()
        return f

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.realpath(__file__)))

    print("\nGo to http://localhost:8000 to view.")
    print("Type Ctrl-C to quit.\n")

    try:
        test(GzipHTTPRequestHandler, HTTPServer)
    except KeyboardInterrupt:
        print("\nExiting.")
