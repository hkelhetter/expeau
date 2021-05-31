Readme du simulateur basic de bassin versant

Compilation
------------------
gfortran xsimul.f90 > xsimul.out

produit le fichier executable xsimul.out
(a faire a chaque modification du simulateur)


Execution
---------------
xsimul.out < simul.in

le fichier d'entrée xsimul.in contient le nom des fichiers a utiliser, 
pour l'instant

scenarioNormal.txt			! un exemple de scenario
cartesActions.txt			! les cartes actions disponibles
round1.txt				! les données des actions jouées par les agriculteurs pour un round de 3 ans 


TO DO
---------
il me reste a gérer plusieurs rounds avec plusieurs fichiers qui vont porter 
