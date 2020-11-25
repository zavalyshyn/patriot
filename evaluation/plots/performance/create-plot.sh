#!/bin/sh

gnuplot performance.plot

gs -sDEVICE=eps2write -sOutputFile=app-performance.eps -dEPSCrop -c "<</Orientation 3>> setpagedevice" -f performance.eps -c quit
