import React, { useState, useEffect } from 'react';
import {
  getKnownPeopleById,
  getPostByPersonId,
  getFOF,
  getAvgResponseTime
} from '../api';
import importedIds from '../data/ids.json'; // File JSON con gli ID consigliati

const PersonForm = ({ title, buttonLabel, onResults, setCurrentSearch }) => {
  const [personId, setPersonId] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(importedIds);
  }, []);


  // --- Funzione centrale per la ricerca con paginazione ---
  const executeSearch = async ({ personId: searchId, page = 1 }) => {
    try {
      let result = null;
      let type = '';

      if (title === 'Trova Conoscenti') {
        const pageToUse = page || 1;
        result = await getKnownPeopleById(searchId, pageToUse, 10);
        type = 'person';
      } else if (title === 'Visualizza Contenuti di una Persona') {
        const pageToUse = page || 1;
        result = await getPostByPersonId(searchId, pageToUse, 10);
        type = 'post';
      } else if (title === 'Calcola FOF') {
        const pageToUse = page || 1; 
        result = await getFOF(searchId, pageToUse, 10);
        type = 'fof';
      } else if (title === 'Calcola Tempo Medio di Risposta') {
        result = await getAvgResponseTime(searchId, page, 10);
        type = 'time';
      }

      if (result?.error) {
        onResults({
          data: result.data || [],
          type,
          error: result.error,
          hasSearched: result.hasSearched,
        });
      } else if (result?.data) {
        onResults({
          data: result.data,
          type,
          hasSearched: result.hasSearched,
          pagination: result.pagination,
        });
      } else {
        const normalizedData = Array.isArray(result) ? result : [result];
        onResults({ data: normalizedData, type });
      }
    } catch (err) {
      onResults({
        data: [],
        type: '',
        error: 'Errore nella richiesta',
      });
    }
  };

  const handleSubmit = async () => {
    const idToQuery = personId.trim() || selectedId;

    if (!idToQuery) {
      setError("L'ID non può essere vuoto");
      return;
    }

    const parsedId = parseInt(idToQuery, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setError("L'ID deve essere un numero positivo");
      return;
    }

    setError('');
    setIsLoading(true);
    onResults({ data: [], type: '' });

    // Memorizza i parametri per la paginazione
    const searchParams = {
      personId: parsedId,
      executeSearch,
    };
    setCurrentSearch(searchParams);

    await executeSearch({ personId: parsedId, page: 1 });

    setIsLoading(false);
    setPersonId('');
    setSelectedId('');
  };

  return (
    <div className="person-form-card">
      <div className="form-title">{title}</div>

      <label className="form-label" htmlFor="person-id">ID:</label>
      <input
        className="form-input-short"
        id="person-id"
        type="text"
        value={personId}
        onChange={(e) => {
          setPersonId(e.target.value);
          setError('');
        }}
        disabled={isLoading}
      />
      <label className="form-label">Oppure scegli un ID:</label>
      <select
        className="form-input-short"
        value={selectedId}
        onChange={(e) => {
          setSelectedId(e.target.value);
          setError('');
        }}
        disabled={isLoading || personId.trim() !== ''}
      >
        <option value="">Seleziona un ID</option>
        {ids.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>

      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}

      <button
        className="form-button"
        onClick={handleSubmit}
        disabled={(!personId.trim() && !selectedId) || error !== '' || isLoading}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PersonForm;
