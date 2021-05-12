import React, { Component } from 'react'
import "./tuto.css"
//import image from './bassin.png'
export default class Tutoriel extends Component {

    render() {
        return (
            <div id="tuto">
                <h1>Tutoriel</h1>
                <div>
                    Bienvenue dans exp - eau.
                <div>
                        Il existe 3 types de rôles différents.
                    < ul >
                            <li>-L’agriculteur</li>
                            <li>-L’élu</li>
                            <li>-Le gestionnaire</li>
                        </ul >

                        <h2> L’agriculteur :</h2>

                        <p>
                            Les agriculteurs sont répartis sur les différents sous bassins. Un agriculteur ne peut voir que le sous bassin au quel il appartient.
                            Il va devoir gérer sa production en veillant sur ses unités de bien (UB) et ses unités de temps (UT).
                            Ces deux ressources lui permettront de jouer des cartes actions permettant une reconversion de ses terres dans un autre modèle de production ou mettre en place de nouvelles infrastructures.
                            Il devra veiller au bonheur ainsi que ses émissions de polluants par l’utilisation de pesticides.
                            Son travail sera aussi affecté par la météo qui peut mettre en péril sa production.
                            Attention, si le joueur utilise toutes ses ressources et que le production de se passe pas bien il risque de devoir faire un prêt.
                    </p>
                        <div id="bassin">
                            <div id="text">
                                <h2>Le bassin versant :</h2>
                                <p>
                                    Une partie se passe sur une carte d’un bassin versant divisée en hexagones. Ces hexagones ont tous une fonction reconnaissable par la couleur de fond. Ville en rouge, forêt en vert, lac en bleu, agriculture en beige. Les cases agricultures sont attribuées à un agriculteur. Chaque case contient des informations écrite. En haut, l’identifiant de la case et en bas l’agriculteur attribué. Une couleur est ajoutée pour plus de clarté. Un cour d’eau représenté par un trait bleu passe sur chaque case et sa couleur témoigne de son état. Si le cours est bleu clair, cela signifie qu’il n’est pas assez irrigué pour former une rivière. Les cours d’eau jouent un rôle important notamment dans le déversement de polluants émis par les agriculteurs.
                                    En cliquant sur une case vous étant attribuées, vous verrez apparaître dans le menu des informations sur cette case ainsi que les actions faisable dessus. Il vous est possible d’apporter des modifications à une unique case ou de changer votre sous bassin entier.
                     </p>
                            </div>
                            <img src={process.env.PUBLIC_URL + '/bassin.png'} />

                        </div>
                        <h2>                       Les cartes actions :</h2>
                        <p> Chaque joueur dispose de cartes actions qu’il peut jouer pour gagner des bonus.
                        
                            Les cartes d’agricultures :

                            Les agriculteurs ont des cartes qui permettent d’affecter leurs productions. Un agriculteur peut alors faire passer un agriculture de bovins en plein air à un élevage en batterie, et inversement. Il est indiqué sur chaque carte le travail et l’intrant qui représentent respectivement le coût en unité de travail et de bien.

                            Chaque actions présentent des coût et des gains qui peuvent être altérés par des évènements extérieurs tels que la météo. Attention à garder assez de ressources en cas de coup dur.
                        </p>
                        <h2>Déroulement d’une partie :</h2>
                        <p>
                            Une partie se déroule en 7 tours
                            Chaque tour se déroule de la façon suivante :
                    </p>
                        <ol>
                            <li>Vous prenez connaissance de vos ressources (UT et UB) au début du tour.</li>
                            <li>Vous avez un temps de réflexion pour définir une stratégie avec vos cartes actions.</li>
                            <li>Vous saisissez vos différentes actions.</li>
                            <li>Lorsque tous les joueurs ont joué, vous recevez un récapitulatif des éléments extérieurs.</li>
                            <li>Une réunion entre tous les joueurs est organisée où vous pourrez discuter.</li>
                            <li>Un formulaire vous est soumis pour y entrer votre ressenti sur l’état de votre partie.</li>
                            <li>Vous recevez vos gain du tour.</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}
