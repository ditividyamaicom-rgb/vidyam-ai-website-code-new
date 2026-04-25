
import neo4j from 'neo4j-driver';

//prod
const driver = neo4j.driver(
    'neo4j+s://fba22ace.databases.neo4j.io',
    neo4j.auth.basic('neo4j', '8XBuhOS47QOKwA4fCG6x3JKUtCxAawnx7cBq9i3o5SA')
  );


//dev
// const driver = neo4j.driver(
//     'neo4j+s://cbff9fe2.databases.neo4j.io',
//     neo4j.auth.basic('neo4j', 'prBlGZ7JS-nFcBaGZs0HHMQ6oG_rxiArm16YJXcC5sI')
//   );

export {driver};


