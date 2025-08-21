import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import QueryPanel from './components/QueryPanel';
import ResultArea from './components/ResultArea';

function App() {
  const [results, setResults] = useState(undefined); // undefined = nessuna query ancora eseguita
  const [resultType, setResultType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');

  const handleResults = ({ data, type, error, pagination, hasSearched }) => {
    console.log("App.js - handleResults ricevuto:", { data, type, error, pagination, hasSearched });

    // Gestisci le risposte di errore (come 404)
    if (error || (data && data.status && data.status !== 200)) {
      setResults({
        error: error || data.message || 'Errore sconosciuto',
        data: [],
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

  const handleSearch = (searchData, executeSearchFn) => {
    setIsLoading(true);
    setCurrentSearch({ ...searchData, executeSearch: executeSearchFn });
  };

  const handlePageChange = async (newPage) => {
    if (!currentSearch || !currentSearch.executeSearch) return;

    setIsLoading(true);
    try {
      const searchWithPage = { ...currentSearch, page: newPage };
      await currentSearch.executeSearch(searchWithPage, handleResults);
      // Assicurati che executeSearch riceva handleResults per aggiornare lo stato
    } catch (error) {
      console.error("Errore nel cambio pagina:", error);
      setIsLoading(false);
    }
  };


  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <QueryPanel
          setResults={handleResults}
          onSearchStart={() => setIsLoading(true)}
          setCurrentSearch={setCurrentSearch}
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