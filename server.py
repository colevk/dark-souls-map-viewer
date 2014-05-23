#!/usr/bin/env python

from __future__ import print_function

import sys, os

try:
    # python 2
    from SimpleHTTPServer import SimpleHTTPRequestHandler, test
    from BaseHTTPServer import HTTPServer
except ImportError:
    # python 3
    from http.server import SimpleHTTPRequestHandler, HTTPServer, test

class GzipHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Request handler with support for some gzipped files.

    We want to save space with the .iv files, so send them gzipped.
    This overrides the default headers only for .iv files.
    """

    def end_headers(self):
        self.send_content_encoding_headers()
        SimpleHTTPRequestHandler.end_headers(self)

    def send_content_encoding_headers(self):
        if self.path.endswith('.iv'):
            self.send_header('Content-Encoding', 'gzip')


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.realpath(sys.argv[0])))

    print('\nGo to http://localhost:8000 to view.')
    print('Type Ctrl-C to quit.\n')

    try:
        test(GzipHTTPRequestHandler, HTTPServer)
    except KeyboardInterrupt:
        print('\nExiting.')
