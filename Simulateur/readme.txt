Readme du simulateur basique de bassin versant


*****************************        SIMULATION      **********************************************
Compilation
------------------
gfortran xsimul.f90 -o xsimul.out

produit le fichier executable xsimul.out
(a faire a chaque modification du simulateur)


Execution
---------------
xsimul.out < simul.in

le fichier d'entrée xsimul.in contient le nom des fichiers a utiliser, 
pour l'instant

5						! nbrouds  (nombre entier valant 0 au premier tour)
scenarioNormal.txt			! un exemple de scenario
cartesActions.txt			! les cartes actions disponibles
round1.txt				! les données des actions jouées par les agriculteurs pour un round de 3 ans 


Outputs
------------
+ principalement un fichier contenant les ut et ub par joueur:  newUtUbP1.txt    (par exemple)
+ une courbe des revenus par joueurs, pas finalisée: imgP1.png (par exemple)

Rq: le fichier gnuplot est utilisé pour générer les images est appelé depuis le simulateur. 
il utilisera les fichiers intermédiaires tels que ResultsP1.txt


*****************************        CREATION DE SCENARIO      ************************************
Compilation     (je ne vous ai pas mis cette partie)
------------------
gfortran xscenario.f90 -o xscenario.out

produit le fichier executable xscenario.out
(a faire a chaque modification)


Execution
---------------
xscenario.out

Ce programme utilise les fichiers 

	+ 'spie6_saarbrucken.txt' contenant le "standard precipitation and evaporation index de sarrebruck 
	   (calculé a partir des données de l'ecad et le programme allclimate situé dans PrimBook/Data/Climate)
	   Il sert a determiner les hivers et été normaux, humides et secs. 
	   sur le bassin de la sarre, on peut considérer les hivers froids
	   
	+ 'hotsummers_saarbrucken.txt' contenant des information sur les étés chauds
	    (calculé a partir des données de l'ecad et le programme allclimate situé dans PrimBook/Data/Climate)
	    Il sert à déterminer les étés normaux, chaud, et moins chaud
	    
	- Les hivers sur ce bassin sont considérés froids (il n'y a pas de grande différence, si ce n'est sur les ravageurs)   
	
	+   

