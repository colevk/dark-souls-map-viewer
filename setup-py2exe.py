from distutils.core import setup
import py2exe, sys, os, shutil

sys.argv.append('py2exe')

# Creates a single exe file with the python interpreter included.
setup(
    options = { 'py2exe': {
        'bundle_files': 1,
        'optimize': 2,
        'compressed': True
    }},
    console = [{ 'script': 'server.py' }],
    zipfile = None,
)

# Remove build directories and move exe into place.
os.chdir(os.path.dirname(os.path.realpath(sys.argv[0])))
if (os.path.isfile('launch-win.exe')):
    os.remove('launch-win.exe')
shutil.move('dist/server.exe', 'launch-win.exe')
shutil.rmtree('dist')
shutil.rmtree('build')