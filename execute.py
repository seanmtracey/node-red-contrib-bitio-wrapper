import sys, os, time
os.chdir(sys.argv[1])

import microbit

FUNCTION = sys.argv[2]
VALUE = sys.argv[3]
TIME_TO_DISPLAY = float(sys.argv[4])

print(FUNCTION, VALUE)

if FUNCTION == 'scrolling-text':
    microbit.display.scroll(VALUE)

elif FUNCTION == 'image':
    microbit.display.show(microbit.Image(VALUE))
    time.sleep(TIME_TO_DISPLAY)