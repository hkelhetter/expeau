PROGRAM Xsimul

USE, INTRINSIC :: iso_fortran_env, ONLY : iostat_end

! donnees
! RCAI https://www.bfmtv.com/economie/economie-social/ce-que-gagnent-vraiment-les-agriculteurs_AV-201902220073.html


IMPLICIT NONE

! parameters
INTEGER, PARAMETER :: nbX=89	!number of hexagons on the board
INTEGER, PARAMETER :: nbY=22	!number of simulated years+1
INTEGER, PARAMETER :: nbC=1000  !max number for action Cards
INTEGER, PARAMETER :: nbP=9	!number of players

INTEGER, PARAMETER :: UTinit=30
INTEGER, PARAMETER :: UBinit=30

!
INTEGER :: nbrounds		!number of rounds

! Filenames for the simulation
CHARACTER*50 :: filescenario
CHARACTER*50 :: filerounds
CHARACTER*50 :: filecards

! Arrays related to the board
INTEGER :: idX(nbx)				!cell identifier related
INTEGER :: player(nbx)			!number of the player belonging the cell X
INTEGER :: parcel(nbx)			!numbering the played cells with respect to the player number
INTEGER :: practice(nbx,nbY)		!number of the practice played in the cell X
INTEGER :: infra(nbx,nbY)			!presence of an ecological infrastructure (0 ou 1)
INTEGER :: localmarket(nbx,nbY)	!presence of alocal market (0 ou 1)

! Arrays related to the scenario
INTEGER :: year(nbY)			!numbering the years
INTEGER :: round(nbY)			!corresponding round
INTEGER :: winter(nbY)			!qualifying the winters (1 to 5)
INTEGER :: summer(nbY)			!qualifying the summers (6 to 10)
INTEGER :: pest(nbY)			!presence of a pest (0 or 1)
INTEGER :: marketdev(nbY) 		!market price deviation 

! Arrays related to action cards
CHARACTER*20 :: cpracticename(nbC) 
INTEGER :: ctag(nbC)
DOUBLE PRECISION :: cwork(nbC)
INTEGER :: cinputs(nbC)
INTEGER :: cprod(nbC)
INTEGER :: cpoll(nbC)
INTEGER :: ctechni(nbC)
INTEGER :: cdeviation(nbC,12,5)

! Simulation results
INTEGER :: ut(nbP,nbY)				!units of labor / player
INTEGER :: ub(nbP,nbY)				!units of goods / player
INTEGER :: iut(nbP,nbY)				!invested units of labor / player
INTEGER :: iub(nbP,nbY)				!invested units of goods / player
INTEGER :: yieldplayer(nbP,nbY)		!yield / player
INTEGER :: prodplayer(nbP,nbY)		!production / player
INTEGER :: polplayer(nbP,nbY)			!contamination/player

! Simulation results
!INTEGER :: ut(nbP,nbY)				!units of labor / player
!INTEGER :: ub(nbP,nbY)				!units of goods / player
!INTEGER :: iut(nbP,nbY)				!invested units of labor / player
!INTEGER :: iub(nbP,nbY)				!invested units of goods / player
INTEGER :: yieldboard(0:3,nbY)			!yield / board
INTEGER :: prodboard(0:3,nbY)			!prod / board
INTEGER :: polboard(0:3,nbY)			!contamination/board
CHARACTER*15 :: filename


! local variables
CHARACTER*20 :: winscenario,sumscenario,pestscenario
CHARACTER*50:: pra
INTEGER :: idc,inp,pro,pol,tec,currentidcard,inf
double precision :: wor
INTEGER :: i,j,k,r,y,ierror,idb, ix,play,pratic,lm,ierror1
CHARACTER*80 :: cdummy
LOGICAL:: uttest, ubtest
!==================   READS   =======================================
 WRITE(*,*) ' SETTINGS'

 !read round number
READ(5,*) nbrounds
WRITE(*,*) 'Number of rounds', nbrounds

! Read filenames
READ(5,*) filescenario
WRITE(*,*) 'Scenario file: ',filescenario
READ(5,*) filecards
WRITE(*,*) 'Cards file:    ',filecards	
READ(5,*) filerounds

! Read data issued from the players
idX(:)=0; player(:)=0;   parcel (:)=0; practice(:,:)=0; infra(:,:)=0;
DO r=0,nbrounds
        filerounds(6:6)=char(48+r)
        WRITE(*,*) 'Round file:    ', filerounds
	OPEN(1,file=filerounds)
	REWIND(1)
	READ(1,*,IOSTAT=ierror) cdummy
	SELECT CASE( ierror )
		CASE (0)
			ierror1=0
			DO WHILE (ierror1==0)
				READ(1,*,IOSTAT=ierror1) ix,play,pratic,inf,lm
				IF (ierror1==0) THEN 
					idX(ix)=ix
					player(ix)=play 
					localmarket(ix,y:y+2)=lm
					practice(ix,y:y+2)=pratic
					infra(ix,y:y+2)=inf
				ENDIF
			ENDDO
			y=3*r+1
		CASE( iostat_end )	
		        WRITE(*,*) 'Missing Round files', r+1, 'to ',nbrounds
		        WRITE(*,*) 'Computations run from 0 to ', r 
			nbrounds=r
			EXIT
		CASE DEFAULT
        		WRITE( *, * ) 'Error in reading file'
        		STOP
     	END SELECT 	
	 CLOSE(1)
ENDDO


!==================   Verification du fichier round sans les 000   ====================================
DO i=1,89
	WRITE(*,*) idX(i), player(i), practice(i,1),infra(i,1),localmarket(i,1)
ENDDO


 ! Read scenario data
OPEN(1,file=filescenario)
REWIND(1)
READ(1,*) cdummy
year(:)=0; round(:)=0; winter(:)=0; summer(:)=0; pest(:)=0;
DO i=1,21
	READ(1,*) year(i), round(i), winter(i), summer(i), pest(i)
ENDDO
 CLOSE(1)
	
! Read action cards 
OPEN(1,file=filecards)
REWIND(1)
READ(1,*) cdummy
DO 
	READ(1,*,IOSTAT=ierror) pra,idc,wor,inp,pro,pol,tec
	SELECT CASE( ierror )
		CASE (0)
			IF (idc > 100) THEN
				cpracticename(idc)=pra; ctag(idc)=idc; cwork(idc)=wor; cinputs(idc)=inp; cprod(idc)=pro; cpoll(idc)=pol; ctechni(idc)=tec
				currentidcard=idc
			ELSE
				cdeviation(currentidcard,idc,1)=wor;
				cdeviation(currentidcard,idc,2)=inp;
				cdeviation(currentidcard,idc,3)=pro;
				cdeviation(currentidcard,idc,4)=pol;
				cdeviation(currentidcard,idc,5)=0;
			ENDIF
		CASE( iostat_end )	
			EXIT
		CASE DEFAULT
        		WRITE( *, * ) 'Error in reading file'
        		STOP
     	END SELECT 	
ENDDO
 CLOSE(1)
 
 WRITE(*,*) ' '
 WRITE(*,*) ' SIMULATOR'
!==================   SIMULATOR   ====================================
! Initialization
!nbcells=zeros(1,9);
ub(:,:)=0; ub(:,1)=UBinit
ut(:,:)=UTinit;
yieldplayer(:,:)=0;
prodplayer(:,:)=0;
polplayer(:,:)=0;
yieldboard(:,:)=0;
polboard(:,:)=0;
iut(:,:)=0; iub(:,:)=0;
yieldplayer(:,:)=0
! Simulator
DO r=0,nbrounds-1				    !loop on the rounds
		
	DO y=3*r+1,3*(r+1)				!loop on the years
		WRITE(*,*)'==============================================='
		WRITE(*,*) 'ROUND',r,  '		Year ',y
		IF (winter(y)==1) 		winscenario='Normal winter /'
		IF (winter(y)==2) 		winscenario='Hot dry winter / '
		IF (winter(y)==3) 		winscenario='Hot wet winter / '	
		IF (winter(y)==4) 		winscenario='Cold dry winter / '
		IF (winter(y)==5) 		winscenario='Cold wet winter / '	
		IF (summer(y)==6) 	sumscenario='Normal summer / '
		IF (summer(y)==7) 	sumscenario='Hot dry summer / '
		IF (summer(y)==8) 	sumscenario='Hot wet summer / '	
		IF (summer(y)==9) 	sumscenario='Cold dry summer / '
		IF (summer(y)==10) 	sumscenario='Cold wet summer / '	
		pestscenario=''
		IF (pest(y)==1)		pestscenario='Pest /'
				
		WRITE(*,*) 'Scenario: 	', winscenario, sumscenario,pestscenario
		
		WRITE(*,*) 'Player:     ', 1,2,3,4,5,6,7,8,9,'|     Watershed     Board 1     Board 2     Board 3'

	 	DO i=1,89			!loop on the cells
	 	
			IF (player(i) > 0) THEN
			   !nbcells(player(i))=nbcells(player(i))+1;

                          uttest=iut(player(i),y)+cwork(practice(i,y)) <=ut(player(i),y); 
                          ubtest=iub(player(i),y)+cinputs(practice(i,y)) <=ub(player(i),y); 
                          IF (uttest.AND.ubtest) THEN
				   iut(player(i),y)    = iut(player(i),y)     + cwork(practice(i,y));
				   iub(player(i),y)    = iub(player(i),y)     + cinputs(practice(i,y));
				   yieldplayer(player(i),y) = yieldplayer(player(i),y)  +cprod(practice(i,y));
				   polplayer(player(i),y)= polplayer(player(i),y) + cpoll(practice(i,y));

				   ! account for winter/summer/pest aleas
				   ! assume that winter is encoded using 1..5
				   !             summer is encoded using 6..10
				   !             pest is encoded as 11
				   
				   ! /!\ "-" for ut and ub           
				   iut(player(i),y)    = iut(player(i),y) &              	!on work: cdeviation(x,x,1)
				       +cdeviation(practice(i,y),winter(y),1) +cdeviation(practice(i,y),summer(y),1) +cdeviation(practice(i,y),11,1); 
				   iub(player(i),y)    = iub(player(i),y) &		   	!on inputs: cdeviation(x,x,2)
				       +cdeviation(practice(i,y),winter(y),2) +cdeviation(practice(i,y),summer(y),2) +cdeviation(practice(i,y),11,2); 
				       
				   !  /!\ "+" for yield and pollution	
				   yieldplayer(player(i),y) = yieldplayer(player(i),y) &	 	! on production cdeviation(x,x,3)
				       -cdeviation(practice(i,y),winter(y),3) -cdeviation(practice(i,y),summer(y),3) 
				   IF (pest(y)==1) THEN
				   	yieldplayer(player(i),y) = yieldplayer(player(i),y) + cdeviation(practice(i,y),11,3);
				   ENDIF 
				   polplayer(player(i),y)= polplayer(player(i),y) &	! on pollution cdeviation(x,x,4)
				       -cdeviation(practice(i,y),winter(y),4) -cdeviation(practice(i,y),summer(y),4) -cdeviation(practice(i,y),11,4); 
				       
				   ! account for market deviations
				   yieldplayer(player(i),y) = yieldplayer(player(i),y) + marketdev(y);
			   ENDIF
			ENDIF
	    	ENDDO
	    	
	    	DO i=1,nbP   !summation on sub-boards
			idb=mod(i,3)+1
			yieldboard(idb,y) = yieldboard(idb,y) + yieldplayer(i,y) 	!yield / board
			polboard(idb,y) = polboard(idb,y) + polplayer(i,y)		!contamination/board
		ENDDO
	    	
	    	!watershed sum
	    	yieldboard(0,y)=sum(yieldboard(1:3,y))
	    	polboard(0,y)=sum(polboard(1:3,y))
	   	write(*,*) '---'
		WRITE(*,*) 'Current UB: ', ub(:,y)   
	    	WRITE(*,*) 'Invested UB:',-iub(:,y),'|'    	
	    	WRITE(*,*) 'Res. Yield: ',yieldplayer(:,y),'|',yieldboard(:,y)
	    	ub(:,y+1) = ub(:,y)-iub(:,y)+yieldplayer(:,y)
	    	WRITE(*,*) 'Res. UB:    ', ub(:,y+1),'|' 	
	   	write(*,*) '---'	    	
	    	WRITE(*,*) 'Res. Poll.: ', polplayer(:,y),'|',  polboard(:,y)
	    	write(*,*) '---'
	   	!WRITE(*,*) 'Current UT: ', ut(:,y)
	   	!WRITE(*,*) 'Invested UT:', -iut(:,y),'|'  
	ENDDO			!end of the loop on the years
	
ENDDO
	
	
	WRITE(*,*)'OUTPUT FILES'
	! file containing the current UT and UB values to be used for the next round
	! note that returning UB could be sufficient since the UT are set to a constant
	filename='newUtUbP1.txt'
	DO i=1,9
		filename(9:9)=char(48+i)
		write(*,*) filename
		OPEN(1,FILE=filename)
		REWIND(1)
		WRITE(1,*) '	  UT          UB'	
		WRITE(1,*) 	UT(i,y-1),	   UB(i,y)	 
		CLOSE(1)
	ENDDO
		     !end of the loop on the rounds

! save results
DO i=1,nbP
	filename='ResultsP1.txt'
	filename(9:9)=char(48+i)
	write(*,*) filename
	OPEN(1,FILE=filename)
	REWIND(1)
	WRITE(1,*) '	Player	   Year		  UT	      IUT	  UB	      IUB	Yield	     Poll'	
	DO y=1,22
	 	WRITE(1,*) i, y, ut(i,y), iut(i,y),ub(i,y),iub(i,y),Yieldplayer(i,y),polplayer(i,y)
	ENDDO      
	CLOSE(1)
	

ENDDO    

            
DO i=0,3
	filename='ResultsB1.txt'
	filename(9:9)=char(48+i)
	write(*,*) filename
	OPEN(1,FILE=filename)
	REWIND(1)
	WRITE(1,*) '	Board	   Year		Yield	     Poll'	
	DO y=1,22
	 	WRITE(1,*) i, y, Yieldboard(i,y),polboard(i,y)
	ENDDO      
	CLOSE(1)
ENDDO  

!update parcel property
!OPEN(2,file='mapChange')
!REWIND(2)
!OPEN(1,file=filerounds)!
!	REWIND(1)
!	READ(1,*,IOSTAT=ierror) cdummy
!	SELECT CASE( ierror )
!		CASE (0)
!			DO i=1,89
!				READ(1,*) idX(i), player(i), parcel(i), prati, inf
!				y=3*r+1
!				practice(i,y:y+2)=prati
!				infra(i,y:y+2)=inf
!			ENDDO
!		CASE( iostat_end )	
!			nbrounds=r
!			EXIT
!		CASE DEFAULT
 !       		WRITE( *, * ) 'Error in reading file'
  !      		STOP
   !  	END SELECT 	
	!
	 !CLOSE(1)

call system('gnuplot plotUB.gnu') 
	
END PROGRAM Xsimul
