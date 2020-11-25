set terminal postscript eps color enhanced solid size 7,3
#set size 7,1
set output 'privacy-preferences.eps'
set border linewidth 1.5
set offset -0.7,-0.5
set style data histogram

set style fill solid 1 border lt -1
set style line 1 lt 1 lc rgb "#0080B0" lw 2

set tics font "Helvetica, 20"

set xtics offset 5 # makes xtic labels centered

set key font "Helvetica, 19" spacing 1
set grid y
set bmargin 4
set ylabel "Number of participants, %" font "Helvetica,20"
set yrange [ 0 : 110 ] noreverse nowriteback
set grid ytics mytics  # draw lines for each ytics and mytics
set mytics 2           # set the spacing for the mytics
# Margins for each row resp. column
P1MARGIN = "set lmargin at screen 0.07; set rmargin at screen 0.37"
P2MARGIN = "set lmargin at screen 0.37; set rmargin at screen 0.68"
P3MARGIN = "set lmargin at screen 0.68; set rmargin at screen 0.99"

set multiplot layout 1,3 rowsfirst
@P1MARGIN
plot "nanny-babycam.data" using 2:xtic(1) ti 'No, never' ls 1 fill pattern 2 , \
	"" using 3 ti 'Only when babysitting' ls 1 fill pattern 1, \
	"" using 4 ti "Yes, always" ls 1 fill pattern 4

set format y '';
unset ylabel

@P2MARGIN
#set offset -0.65,-0.65
plot "motion-internet.data" using 2:xtic(1) ti 'No, never' ls 1 fill pattern 2 , \
	"" using 3 ti 'Only to sec. comp.' ls 1 fill pattern 1, \
	"" using 4 ti "Only to sec. comp. \\& away" ls 1 fill pattern 4, \
	"" using 5 ti 'Yes, always' ls 1 fill pattern 5

@P3MARGIN
#set offset -0.7,-0.5
plot "motion-lights.data" using 2:xtic(1) ti 'No, never' ls 1 fill pattern 2, \
        "" using 3 ti "Only when I'm at home" ls 1 fill pattern 1, \
        "" using 4 ti "Yes, always" ls 1 fill pattern 4

unset multiplot
