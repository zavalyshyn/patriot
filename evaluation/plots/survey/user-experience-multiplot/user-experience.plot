set terminal postscript eps color enhanced solid size 7,3
set output 'user-experience.eps'
set border linewidth 1.5
set offset -0.6,-0.6,0,0

set style data histogram

set style fill solid 0.6 border lt -1
set style line 1 lt 1 lc rgb "#0080B0" lw 2

set tics font "Helvetica, 20"
set key font "Helvetica, 19" spacing 1
set grid y
set bmargin 4
set ylabel "Number of participants, %" font "Helvetica,20"
set yrange [ 0 : 65 ] noreverse nowriteback
set grid ytics mytics  # draw lines for each ytics and mytics
set mytics 2           # set the spacing for the mytics
# Margins for each row resp. column
P1MARGIN = "set lmargin at screen 0.06; set rmargin at screen 0.36"
P2MARGIN = "set lmargin at screen 0.36; set rmargin at screen 0.67"
P3MARGIN = "set lmargin at screen 0.67; set rmargin at screen 0.99"


set multiplot layout 1,3 rowsfirst
@P1MARGIN
plot "ease-of-use.data" using 2:xtic(1) ti 'Very easy' ls 1 fill pattern 2 , \
	"" using 3 ti 'Somewhat easy' ls 1 fill pattern 1, \
	"" using 4 ti "Neither easy nor difficult" ls 1 fill pattern 4, \
	"" using 5 ti "Somewhat difficult" ls 1 fill pattern 5, \
	"" using 6 ti 'Difficult' ls 1 fill pattern 6

set format y '';
unset ylabel

@P2MARGIN
plot "policy-definition.data" using 2:xtic(1) ti 'Very clear' ls 1 fill pattern 2 , \
        "" using 3 ti 'Somewhat clear' ls 1 fill pattern 1, \
        "" using 4 ti "Neither clear nor confusing" ls 1 fill pattern 4, \
        "" using 5 ti 'Somewhat confusing' ls 1 fill pattern 5, \
        "" using 6 ti 'Confusing' ls 1 fill pattern 6
@P3MARGIN
plot "usefulness.data" using 2:xtic(1) ti 'Very useful' ls 1 fill pattern 2, \
        "" using 3 ti 'Somewhat useful' ls 1 fill pattern 1, \
        "" using 4 ti "Neither useful nor useless" ls 1 fill pattern 4, \
        "" using 5 ti 'Somewhat useless' ls 1 fill pattern 5, \
        "" using 6 ti 'Useless' ls 1 fill pattern 6

unset multiplot
