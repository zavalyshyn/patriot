set terminal postscript eps color enhanced solid
set output 'performance.eps'
set border linewidth 1.5
set offset -0.4,-0.4,0,0
set size 0.9,1
set style data histograms
set style fill solid 1 border -1
set style histogram errorbars gap 1 lw 1
set tics font "Helvetica, 18"
set key font "Helvetica,20" spacing 3.5
set grid y
set ylabel "Execution time (ms)" offset character -1.5, 0 font "Helvetica,22"
set xlabel "Use cases" offset -2,-2 font "Helvetica,22"
set bmargin 6
set yrange [ 0 : 300 ] noreverse nowriteback
plot "performance.data" using 2:3:xtic(1) ti 'Inside SGX SCONE' lc rgb "#444444", \
     "" using 4:5 ti 'Outside SGX SCONE' lw 1 lt 3 lc rgb "#AAAAAA"
