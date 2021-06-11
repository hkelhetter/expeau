import { Link } from 'react-router-dom';
import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
export default class GameOver extends React.Component {
    MyLink = <Link to="/"></Link>
    render() {
        return (

            <div className="App-header">

                <Typography>Merci d'avoir Joué</Typography>

                <Button component={Link} to="/" variant="contained" color="primary">
                    Rejouer
                </Button>
            </div>
        )
    }
}