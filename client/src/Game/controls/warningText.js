import Typography from '@material-ui/core/Typography';

/* 
    Function : warningText

    Syntax  : warningText(text)

    Output :  <Typography>{text}</Typography> 

    Description : return text in red

    Author : Hugo KELHETTER
    
*/
function warningText(text) {
    return <Typography className="warning">{text}</Typography>
}
export default warningText