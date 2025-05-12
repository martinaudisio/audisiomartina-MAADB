import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import QueryPanel from './components/QueryPanel';
import ResultsArea from './components/ResultArea';

function App() {
  const [results, setResult] = useState([]);
  const [resultType, setResultType] = useState('');

  const handleResults = ({ data, type }) => {
    setResult(data);
    setResultType(type);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <QueryPanel setResults={handleResults} />
        <ResultsArea results={results} type={resultType} />
      </div>
    </div>
  );
}



export default App;
