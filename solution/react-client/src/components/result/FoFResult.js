import React from 'react';
import PersonResult from './PersonResult';

const FoFResult = ({ fofData, totalFoF }) => {
  console.log('FOF Data received:', fofData, "TotalFoF:", totalFoF);

  return (
    <div className="fof-result">
      <h4>Friends of Friends (FoF) Results</h4>
      <h5 className="mb-4"> 
        Numero totale di amici di amici: {totalFoF}
      </h5>

      {fofData && fofData.length > 0 ? (
        <ul className="space-y-2">
          {fofData.map((person) => (
            <PersonResult key={person.id} person={person} />
          ))}
        </ul>
      ) : (
        <p>Nessun amico di amici trovato</p>
      )}
    </div>
  );
};

export default FoFResult;