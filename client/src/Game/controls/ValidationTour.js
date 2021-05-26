

import React from 'react'

class ValidationTour extends React.Component {

    constructor(props) {
        super(props)
        this.state = { validated: false }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    /* 
        Function : handleSubmit
     
        Syntax  : handleSubmit()
     
        Description : compare the objects origin and updated from the props and 
                        create a new object containing all the differences
        
        Authore : Hugo KELHETTER
    */
    handleSubmit() {
        /*         const origin = this.props.origin
                const updated = this.props.updated
        
                this.setState({ validated: true })
                let log = {}
                for (const index in origin) {
                    let subLog = {}
                    for (const entry in origin[index]) {
                        if (origin[index][entry] !== updated[index][entry]) subLog.activity = updated[index][entry]
                    }
                    if (Object.entries(subLog).length !== 0) log[index] = subLog
        
                } */
        /*         let a = [{ hexID: 13, action: "swapActivity", typeAction: 0 }]
                        socket.emit("addActions", a, 1) */
        const csv = this.generateCSV(this.props.actions)
    }
    /* 
        Function : generateCSV 
        
        Syntax  : csvData=generateCSV(data)
        
        Input   : data : an object to convert
            
        Outputs : csvData : input object with csv format
    
        Description : convert an object to csv format
      
        Authore : Hugo KELHETTER
    */
    generateCSV(data) {
        let str = ""
        console.log(Object.keys(data))
        if (data !== undefined) {
            str = Object.keys(data) + "\n";


            str += Object.values(data) + "\n";
        }
        console.log(str)
        return str;
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tour !== this.props.tour) this.setState({ validated: false })
    }

    render() {

        return (
            <>
                {this.state.validated ? <p>Nombre de joueurs prêts : nb joueurs prêts/ nb joueurs totaux</p> :
                    <button onClick={this.handleSubmit}>Finir le tour</button>}
            </>
        )
    }
}
export default ValidationTour