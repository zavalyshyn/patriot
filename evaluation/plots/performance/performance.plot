set terminal postscript eps color enhanced solid
set output 'performance.eps'
set size 1,1.5
set border linewidth 1
set xrange [-1:20]
set key at graph 0.15, 0.6 horizontal samplen 1 spacing 3.5
set boxwidth 1
set bars 0.7
set style data histograms
set style histogram errorbars gap 1 lw 2
set style fill solid 0.6 border lt -1
set style line 1 lt 1 lc rgb "#0080B0" lw 2
set tics font "Helvetica, 18"
set yrange[0:800]
unset ytics
set grid y2
set y2tics rotate
set y2label rotate "Execution time (ms)" offset character -1.5, 0 font "Helvetica,22"
#set xlabel rotate by 180 "Apps"
set xtics nomirror rotate scale 0
set label 2 'Inside SGX SCONE' at graph 0.06, 0.6  left rotate by 90 font "Helvetica,20" front
set label 3 'Outside SGX SCONE' at graph 0.125, 0.6 left rotate by 90 font "Helvetica,20" front
plot 'performance.data' using 2:3:xticlabels(1) ls 1 title ' ', '' using 4:5 ls 1 fill pattern 4 title ' '
