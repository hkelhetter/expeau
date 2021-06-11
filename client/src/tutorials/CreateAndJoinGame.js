import React from "react";
import { Typography } from "@material-ui/core";
export default class CreateAndJoinGame extends React.Component {
    render() {
        return (
            <>
                <Typography>Bonjour et bienvenue dans expeau !</Typography>
                <Typography>Ici vous allez apprendre comment créer et rejoindre une partie</Typography>
                <Typography variant="h3">Créer une partie</Typography>
                <ul>
                    <li>Appuyez sur le bouton "creer la partie" sur la page d'accueil</li>
                    <li>Complétez les champs du formulaire</li>
                    <li>Cliquez sur le bouton "créer"</li>
                    <li>Donnez le code de connexion qui s'affiche sur votre écran et attendez que les autres joueurs se connectent</li>
                    <li>Une fois que tous les joueurs se sont connectés, cliquez sur "commencer la partie" pour pouvoir jouer</li>
                </ul>

                <Typography variant="h3">Se connecter à une partie</Typography>
                <ul>
                    <li>Appuyez sur le bouton "rejoindre la partie" sur la page d'accueil</li>
                    <li>Complétez les champs du formulaire</li>
                    <li>Cliquez sur le bouton "rejoindre la partie"</li>
                </ul>

                <Typography variant="h3">Se reconnecter suite à une déconnexion</Typography>
                <ul>
                    <li>Appuyez sur le bouton "reconnexion à la partie en cours" sur la page d'accueil</li>
                    <li>Indiquez le code de la partie</li>
                    <li>Cliquez sur le bouton "chercher les joueurs"</li>
                    <li>Choisissez votre nom dans la liste ci-dessous</li>
                    <li>Cliquez sur le bouton rejoindre</li>
                </ul>
            </>
        )
    }
}