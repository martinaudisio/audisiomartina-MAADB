import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import QueryPanel from './components/QueryPanel';
import ResultArea from './components/ResultArea';

function App() {
  const [results, setResults] = useState(undefined); // undefined = nessuna query ancora eseguita
  const [resultType, setResultType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = ({ data, type, error, pagination, hasSearched }) => {
    console.log("App.js - handleResults ricevuto:", { data, type, error, pagination, hasSearched });
    
    // Gestisci le risposte di errore (come 404)
    if (error || (data && data.status && data.status !== 200)) {
      setResults({
        error: error || data.message || 'Errore sconosciuto',
        data: data || [],
        hasSearched: hasSearched !== undefined ? hasSearched : true // Usa hasSearched se fornito
      });
    } else {
      // Gestisci le risposte di successo
      setResults({
        data: data || [],
        pagination: pagination || null,
        hasSearched: hasSearched !== undefined ? hasSearched : true // Usa hasSearched se fornito
      });
    }
    
    setResultType(type);
    setIsLoading(false);
  };

  const handleSearch = (searchData) => {
    setIsLoading(true);
    // Passa la funzione handleResults al QueryPanel
    // (assumi che QueryPanel chiami questa funzione quando inizia una ricerca)
  };

  const handlePageChange = (newPage) => {
    console.log("Cambio pagina:", newPage);
    setIsLoading(true);
    // Qui dovresti chiamare di nuovo la tua API con la nuova pagina
    // Per ora è solo un placeholder
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <QueryPanel 
          setResults={handleResults} 
          onSearchStart={() => setIsLoading(true)}
        />
        <ResultArea 
          results={results} 
          type={resultType} 
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default App;