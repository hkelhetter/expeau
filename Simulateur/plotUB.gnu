set xrange[1:21]
set xlabel 'Années'

plot 'ResultsP1.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP1.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP1.png'
set key left top
replot

plot 'ResultsP2.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP2.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP2.png'
set key left top
replot

plot 'ResultsP3.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP3.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP3.png'
set key left top
replot

plot 'ResultsP4.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP4.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP4.png'
set key left top
replot

plot 'ResultsP5.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP5.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP5.png'
set key left top
replot

plot 'ResultsP6.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP6.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP6.png'
set key left top
replot

plot 'ResultsP7.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP7.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP7.png'
set key left top
replot

plot 'ResultsP8.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP8.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP8.png'
set key left top
replot

plot 'ResultsP9.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP9.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP9.png'
set key left top
replot



