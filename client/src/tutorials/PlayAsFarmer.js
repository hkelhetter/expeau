import React from "react"
import { Typography } from "@material-ui/core"
export default class PlayAsFarmer extends React.Component {
    render() {
        return (
            <>
                <Typography>Dans cette partie vous allez apprendre comment jouer le role d'animateur</Typography>
                <Typography>Votre interface est décomposée en 2 partie</Typography>
                <Typography variant="h3">Le menu</Typography>
                <Typography >Vous y retrouvez les informations importantes telles que le tour actuel, votre rôle, et votre identifiant et les moyens de modifier vos productions.
                    Votre identifiant vous indique sur quelles cases vous avez le droit d'interagir. Si votre identifiant est le 1, vous pouvez jouer avec les cases allant de 10 à 19.
                </Typography>
                <Typography variant="h3">La carte</Typography>
                <Typography>Vous pouvez cliquer sur les cases agricoles de la carte qui vous appartient.
                    Une fois cela fait, un formulaire apparait dans le menu vous permettant de changer l'activité de la case selectionnée ou de toutes celles sous votre contrôle. N'oubliez pas valider vos choix et de finir le tour</Typography>
            </>
        )
    }
}