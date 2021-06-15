set xrange[1:21]
set xlabel 'Années'

set key font ",30"
set xtics font ",24" 
set ytics font ",24" 

set title 'Results: Agri 1' font ",30"
plot 'ResultsP1.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP1.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP1.png'
set key left top
replot


set title 'Results: Agri 2' font ",30"
plot 'ResultsP2.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP2.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP2.png'
set key left top
replot

set title 'Results: Agri 3' font ",30"
plot 'ResultsP3.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP3.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP3.png'
set key left top
replot

set title 'Results: Agri 4' font ",30"
plot 'ResultsP4.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP4.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP4.png'
set key left top
replot

set title 'Results: Agri 5' font ",30"
plot 'ResultsP5.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP5.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP5.png'
set key left top
replot

set title 'Results: Agri 6' font ",30"
plot 'ResultsP6.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP6.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP6.png'
set key left top
replot

set title 'Results: Agri 7' font ",30"
plot 'ResultsP7.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP7.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP7.png'
set key left top
replot

set title 'Results: Agri 8' font ",30"
plot 'ResultsP8.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP8.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP8.png'
set key left top
replot

set title 'Results: Agri 9' font ",30"
plot 'ResultsP9.txt' using 2:5 w l title 'UB' lt rgb "blue" lw 2,  'ResultsP9.txt' using 2:7 title 'Revenu' w l lt rgb "green" lw 2
set terminal png size 1500,500
set output 'imgP9.png'
set key left top
replot



