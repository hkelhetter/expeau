PROGRAM Xsimul

USE, INTRINSIC :: iso_fortran_env, ONLY : iostat_end

IMPLICIT NONE

! parameters
INTEGER, PARAMETER :: nbX=89	!number of hexagons on the board
INTEGER, PARAMETER :: nbY=21	!number of simulated years
INTEGER, PARAMETER :: nbC=1000  !max number for action Cards
INTEGER, PARAMETER :: nbP=9	!number of players

!
INTEGER :: nbrounds		!number of rounds

! Filenames for the simulation
CHARACTER*20 :: filescenario
CHARACTER*20 :: filerounds
CHARACTER*20 :: filecards

! Arrays related to the board
INTEGER :: idX(nbx)				!cell identifier related
INTEGER :: player(nbx)			!number of the player belonging the cell X
INTEGER :: dispnb(nbx)			!numbering the played cells with respect to the player number
INTEGER :: practice(nbx)			!number of the practice played in the cell X
INTEGER :: infra(nbx)			!presence of an ecological infrastructure (0 ou 1)

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
INTEGER :: cwork(nbC)
INTEGER :: cinputs(nbC)
INTEGER :: cprod(nbC)
INTEGER :: cpoll(nbC)
INTEGER :: ctechni(nbC)
INTEGER :: cdeviation(nbC,11,5)

! Simulation results
INTEGER :: ut(nbP)				!units of labor / player
INTEGER :: ub(nbP)				!units of goods / player
INTEGER :: iut(nbP)				!invested units of labor / player
INTEGER :: iub(nbP)				!invested units of goods / player
INTEGER :: yieldplayer(nbP)		!yield / player
INTEGER :: prodplayer(nbP)		!production / player
INTEGER :: polplayer(nbP)			!contamination/player
INTEGER :: polsuboard(3)			!contamination / sub-board
INTEGER :: polwat				!watershed contamination

! local variables
CHARACTER*31:: pra
INTEGER :: idc,wor,inp,pro,pol,tec,currentidcard
INTEGER :: i,j,k,r,y,ierror
CHARACTER*80 :: cdummy
LOGICAL:: uttest, ubtest
!==================   READS   =======================================
!read round number
nbrounds=1

! Read filenames
READ(5,*) filescenario
READ(5,*) filecards
READ(5,*) filerounds

! Read data issued from the players
OPEN(1,file=filerounds)
REWIND(1)
READ(1,*) cdummy
idX(:)=0; player(:)=0; dispnb(:)=0; practice(:)=0; infra(:)=0;
DO i=1,89
	READ(1,*) idX(i), player(i), dispnb(i), practice(i), infra(i)
ENDDO
 CLOSE(1)
 
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
			!write(*,*) pra,idc,wor,inp,pro,pol,tec
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
 
!==================   SIMULATOR   ====================================
! Initialization
!nbcells=zeros(1,9);
ub(:)=100;
yieldplayer(:)=0;
prodplayer(:)=0
! Simulator

WRITE(*,*) 'Initializations'
WRITE(*,*) 'Player:       ', 1,2,3,4,5,6,7,8,9
WRITE(*,*) '           UT:', ut(:)
WRITE(*,*) '           UB:', ub(:)    	
WRITE(*,*) 'Initial poll.:', polplayer(:)   
		
write(*,*) 'Deviation de la pratique ', practice(1)
do i=1,11
	write(*,*) i,':',cdeviation(practice(1),i,:)
enddo	
		
DO r=1,nbrounds				    !loop on the rounds


!Investment phase



!Results


	 DO y=3*(r-1)+1,3*r				!loop on the years
	 
	        !yearly initializations
		ut(:)=35;
		iut(:)=0; iub(:)=0;
		yieldplayer(:)=0
	 	DO i=1,89			!loop on the cells
	 	
			IF (player(i) > 0) THEN
			   !nbcells(player(i))=nbcells(player(i))+1;

                          uttest=iut(player(i))+cwork(practice(i)) <=ut(player(i)); 
                          ubtest=iub(player(i))+cinputs(practice(i)) <=ub(player(i)); 
                          IF (uttest.AND.ubtest) THEN
				   iut(player(i))    = iut(player(i))     + cwork(practice(i));
				   iub(player(i))    = iub(player(i))     + cinputs(practice(i));
				   yieldplayer(player(i)) = yieldplayer(player(i))  +cprod(practice(i));
				   polplayer(player(i))= polplayer(player(i)) + cpoll(practice(i));

				   ! account for winter/summer/pest aleas
				   ! assume that winter is encoded using 1..5
				   !             summer is encoded using 6..10
				   !             pest is encoded as 11
				   
				   ! /!\ "-" for ut and ub           
				   iut(player(i))    = iut(player(i)) &              	!on work: cdeviation(x,x,1)
				       +cdeviation(practice(i),winter(y),1) +cdeviation(practice(i),summer(y),1) +cdeviation(practice(i),11,1); 
				   iub(player(i))    = iub(player(i)) &		   	!on inputs: cdeviation(x,x,2)
				       +cdeviation(practice(i),winter(y),2) +cdeviation(practice(i),summer(y),2) +cdeviation(practice(i),11,2); 
				       
				   !  /!\ "+" for yield and pollution	
				   yieldplayer(player(i)) = yieldplayer(player(i)) &	 	! on production cdeviation(x,x,3)
				       -cdeviation(practice(i),winter(y),3) -cdeviation(practice(i),summer(y),3) 
				   IF (pest(y)==1) THEN
				   	yieldplayer(player(i)) = yieldplayer(player(i)) + cdeviation(practice(i),11,3);
				   ENDIF 
				   polplayer(player(i))= polplayer(player(i)) &	! on pollution cdeviation(x,x,4)
				       -cdeviation(practice(i),winter(y),4) -cdeviation(practice(i),summer(y),4) -cdeviation(practice(i),11,4); 
				       
				   ! account for market deviations
				   yieldplayer(player(i)) = yieldplayer(player(i)) + marketdev(y);
			   ENDIF
			ENDIF
	    	ENDDO
	    
	    	WRITE(*,*) 'ROUND',r
	    	WRITE(*,*) 'Year ',y
	    	WRITE(*,*) 'Player:       ', 1,2,3,4,5,6,7,8,9
	    	WRITE(*,*) 'Invested UT:  ', iut(:)
	    	WRITE(*,*) 'Invested UB:  ',iub(:)    	
	    	WRITE(*,*) 'Result  Yield:',yieldplayer(:)
	    	WRITE(*,*) 'Result  Poll.:', polplayer(:)   
		ub(:) = ub(:)-iub(:)+yieldplayer(:)
		WRITE(*,*) 'Result     UB:', ub(:)    	
	ENDDO			!end of the loop on the years
ENDDO			     !end of the loop on the rounds
	
END PROGRAM Xsimul
