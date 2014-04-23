#!/usr/bin/env python

import os

import SimpleHTTPServer
import BaseHTTPServer

class GzipHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
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

    print "Type Ctrl-C to quit."

    SimpleHTTPServer.test(GzipHTTPRequestHandler, BaseHTTPServer.HTTPServer)
