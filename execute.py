import sys, os
os.chdir(sys.argv[1])

import microbit

FUNCTION = sys.argv[2]
VALUE = sys.argv[3]

print(FUNCTION, VALUE)

microbit.display.scroll(VALUE)
