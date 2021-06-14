import Players from '../src/Players.js';
import Actions from '../src/Actions.js';
import Grid from '../src/Grid.js'
import Sim from '../src/Sumulator.js'

await Players.cleanUp(() => console.log("**Players cleaned up**"));

await Actions.cleanUp(() => console.log("**Actions cleaned up**"));

await Grid.cleanUp(() => console.log("**Grid cleaned up**"));

await Sim.cleanUp(() => console.log("**Games folder cleaned up**"));




console.log("All done!");

process.exit(0);



