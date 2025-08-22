import React, { useState, useEffect } from 'react';
import { getPeopleByTagAndLocation } from '../api';
import tagIds from '../data/tag_ids.json';
import placeIds from '../data/place_ids.json';

const TagLocationForm = ({ title, buttonLabel, onResults }) => {
  const [tagId, setTagId] = useState('');
  const [selectedTagId, setSelectedTagId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setTags(tagIds);
    setPlaces(placeIds);
  }, []);

  const handleSubmit = async () => {
    const tagToQuery = tagId.trim() || selectedTagId;
    const locationToQuery = locationId.trim() || selectedLocationId;

    if (!tagToQuery || !locationToQuery) {
      setError('Entrambi gli ID devono essere compilati');
      return;
    }

    const parsedTagId = parseInt(tagToQuery, 10);
    const parsedLocationId = parseInt(locationToQuery, 10);

    if (
      isNaN(parsedTagId) || parsedTagId <= 0 ||
      isNaN(parsedLocationId) || parsedLocationId <= 0
    ) {
      setError('Entrambi gli ID devono essere numeri positivi');
      return;
    }

    setError('');
    setIsLoading(true);
    onResults({ data: [], type: '' });

    try {
      const result = await getPeopleByTagAndLocation(parsedTagId, parsedLocationId);
      
      // FIX: Gestione corretta dei risultati
      if (result?.error) {
        // Passa l'errore nel campo 'error', non nel campo 'data'
        onResults({ 
          data: result.data || [], 
          type: 'person',
          error: result.error,
          hasSearched: result.hasSearched 
        });
      } else if (result?.data) {
        // Successo: passa solo l'array dei dati
        onResults({ 
          data: result.data, 
          type: 'person',
          hasSearched: result.hasSearched 
        });
      } else {
        // Fallback per risultati inaspettati
        const normalizedData = Array.isArray(result) ? result : [result];
        onResults({ data: normalizedData, type: 'person' });
      }
    } catch (err) {
      onResults({ 
        data: [], 
        type: 'person', 
        error: 'Errore nella richiesta' 
      });
    } finally {
      setIsLoading(false);
      setTagId('');
      setSelectedTagId('');
      setLocationId('');
      setSelectedLocationId('');
    }
  };

  return (
    <div className="person-form-card">
      <div className="form-title">{title}</div>

      <label className="form-label" htmlFor="tag-id">Tag ID:</label>
      <input
        className="form-input-short"
        id="tag-id"
        type="text"
        value={tagId}
        onChange={(e) => {
          setTagId(e.target.value);
          setError('');
        }}
        disabled={isLoading}
      />
      <label className="form-label">Oppure scegli un Tag ID:</label>
      <select
        className="form-input-short"
        value={selectedTagId}
        onChange={(e) => {
          setSelectedTagId(e.target.value);
          setError('');
        }}
        disabled={isLoading || tagId.trim() !== ''}
      >
        <option value="">Seleziona un Tag ID</option>
        {tags.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>

      <label className="form-label" htmlFor="location-id">Location ID:</label>
      <input
        className="form-input-short"
        id="location-id"
        type="text"
        value={locationId}
        onChange={(e) => {
          setLocationId(e.target.value);
          setError('');
        }}
        disabled={isLoading}
      />
      <label className="form-label">Oppure scegli una Location ID:</label>
      <select
        className="form-input-short"
        value={selectedLocationId}
        onChange={(e) => {
          setSelectedLocationId(e.target.value);
          setError('');
        }}
        disabled={isLoading || locationId.trim() !== ''}
      >
        <option value="">Seleziona una Location ID</option>
        {places.map((id) => (
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
        disabled={
          (!tagId.trim() && !selectedTagId) ||
          (!locationId.trim() && !selectedLocationId) ||
          error !== '' ||
          isLoading
        }
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default TagLocationForm;