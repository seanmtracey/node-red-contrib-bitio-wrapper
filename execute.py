import sys, os, time
os.chdir(sys.argv[1])

import microbit

FUNCTION = sys.argv[2]
VALUE = sys.argv[3]

print(FUNCTION, VALUE)

if FUNCTION == 'scrolling-text':
    microbit.display.scroll(VALUE)

elif FUNCTION == 'image':
    microbit.display.show(microbit.Image(VALUE))
    time.sleep(3)