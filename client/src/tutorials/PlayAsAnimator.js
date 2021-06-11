import { Typography } from "@material-ui/core"
import React from "react"
export default class PlayAsAnimator extends React.Component {
    render() {
        return (
            <>
                <Typography>Dans cette partie vous allez apprendre comment jouer le role d'animateur</Typography>
                <Typography>Votre interface est décomposée en 3 partie</Typography>
                <Typography variant="h3">La carte</Typography>
                <Typography>En cliquant sur les cases des la cartes vous pouvez effectuer des changements </Typography>
                <Typography>Il est possible de transformer une forêt en ville ou en zone agricole par exemple</Typography>
                <Typography variant="h3">Le formulaire de transformation</Typography>
                <Typography>Après avoir selectionné les changements à faire sur les cases que vous désirez, validez le tout en cliquant sur le bouton "commencer la partie" ou "terminer le tour"</Typography>
                <Typography variant="h3">Les boutons de contrôle</Typography>
                <Typography>Au début de la partie, avant que les autres joueurs puissent jouer, il vous est possible de modifier la carte.
                    Faîtes vous modification et cliquez sur le bouton "commencer la partie" Après avoir cliqué dessus, un autre bouton apparaît : terminer le tour.
                    Cliquez dessus lorsque les joueurs ont fini de joueur pour passer au tour suivant. Vous pouvez à tout moment cliquer sur le bouton "terminer la partie" pour arrêter de jouer</Typography>

            </>
        )
    }
}