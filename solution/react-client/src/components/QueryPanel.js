import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import TagLocationForm from './TagLocationForm';
import PersonForm from './PersonForm';
import OrganizationPostForm from './OrganizationPostForm';

const QueryPanel = ({ setResults, setCurrentSearch  }) => {
  return (
    <div className="query-panel scrollable">
      <CollapsibleSection title="Query Parametriche di Lookup">
        <PersonForm
          title="Trova Conoscenti"
          buttonLabel="Esegui"
          onResults={setResults}
          setCurrentSearch={setCurrentSearch}
        />
        <PersonForm
          title="Visualizza Contenuti di una Persona"
          buttonLabel="Esegui"
          onResults={setResults}
          setCurrentSearch={setCurrentSearch}
        />
        <TagLocationForm
          title="Visualizza persone in base a Interessi e Posizione"
          buttonLabel="Esegui"
          onResults={setResults}
          setCurrentSearch={setCurrentSearch}
        />
        <OrganizationPostForm
          title="Visualizza Post di una Persona in base all'Organizzazione"
          buttonLabel="Esegui"
          onResults={setResults}
          setCurrentSearch={setCurrentSearch}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Query Analitiche">
        <PersonForm
          title="Calcola FOF"
          buttonLabel="Esegui"
          onResults={setResults}
          setCurrentSearch={setCurrentSearch}
        />
        <PersonForm
          title="Calcola Tempo Medio di Risposta"
          buttonLabel="Esegui"
          onResults={setResults}
          setCurrentSearch={setCurrentSearch}
        />
      </CollapsibleSection>
    </div>
  );
};

export default QueryPanel;
