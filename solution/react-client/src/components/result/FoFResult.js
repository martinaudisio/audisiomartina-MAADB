import React from 'react';
import PersonResult from './PersonResult';

const FoFResult = ({ fofData }) => {
  console.log('FOF Data received:', fofData);

  // Extract the actual FOF array (first element of the received data)
  const processedData = fofData;

  return (
    <div className="fof-result">
      <h4>Friends of Friends (FOF)</h4>
      {processedData && processedData.length > 0 ? (
        <ul className="space-y-2">
          {processedData.map((person) => {
            // Ensure we have a valid person object
            const validPerson = person
              ? {
                id: person.id || '',
                name: person.name || '',
                surname: person.surname || '',
                mutualFriends: person.mutualFriends
              }
              : { id: '', name: 'Invalid <Person', surname: '' };

            return (
              <PersonResult
                key={validPerson.id}
                person={validPerson}
              />
            );
          })}
        </ul>
      ) : (
        <p>Nessun amico di amici trovato</p>
      )}
    </div>
  );
};

export default FoFResult;