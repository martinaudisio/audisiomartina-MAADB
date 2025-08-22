import React, { useMemo, useState } from 'react';
import { getPostByCreatorOrganization } from '../api';

// Import statico dei JSON (più semplice/robusto rispetto a dynamic import)
import companyIds from '../data/company_ids.json';
import universityIds from '../data/university_ids.json';

const PAGE_SIZE = 10;

const OrganizationPostForm = ({ title, buttonLabel, onResults, setCurrentSearch }) => {
  const [orgType, setOrgType] = useState('');         // 'Company' | 'University'
  const [orgId, setOrgId] = useState('');             // input manuale
  const [selectedOrgId, setSelectedOrgId] = useState(''); // tendina IDs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Normalizza la forma dei file JSON (array semplice o oggetto con chiave .ids / .company_ids / .university_ids)
  const normalizeIds = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (!raw || typeof raw !== 'object') return [];
    return (
      raw.ids ||
      raw.company_ids ||
      raw.university_ids ||
      []
    );
  };

  // Cambia dinamicamente le opzioni ID in base a orgType
  const orgOptions = useMemo(() => {
    if (orgType === 'Company') return normalizeIds(companyIds);
    if (orgType === 'University') return normalizeIds(universityIds);
    return [];
  }, [orgType]);

  // Funzione usata anche dalla paginazione (App -> onPageChange)
  const executeSearch = async ({ orgType: type, orgId: id, page = 1 }) => {
    try {
      const result = await getPostByCreatorOrganization(type, id, page, PAGE_SIZE);

      // Convenzione di risposta allineata al tuo handleResults in App.js
      if (result?.error || (result?.data && result?.data.status && result.data.status !== 200)) {
        onResults({
          data: result?.data || [],
          type: 'postbyorg',
          error: result?.error || result?.data?.message || 'Errore sconosciuto',
          hasSearched: result?.hasSearched ?? true,
        });
      } else if (result?.data) {
        onResults({
          data: result.data,
          type: 'postbyorg',
          pagination: result.pagination,
          hasSearched: result?.hasSearched ?? true,
        });
      } else {
        const normalized = Array.isArray(result) ? result : [result];
        onResults({ data: normalized, type: 'post', hasSearched: true });
      }
    } catch (e) {
      onResults({
        data: [],
        type: 'post',
        error: 'Errore nella richiesta',
        hasSearched: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (!orgType) {
      setError('Seleziona il tipo di organizzazione.');
      return;
    }

    const idToQueryStr = orgId.trim() || selectedOrgId;
    if (!idToQueryStr) {
      setError('Inserisci o seleziona un Organization ID.');
      return;
    }

    const parsedId = parseInt(idToQueryStr, 10);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      setError('Organization ID deve essere un numero intero positivo.');
      return;
    }

    setError('');
    setIsLoading(true);
    // Reset visuale dei risultati mentre carica
    onResults({ data: [], type: '' });

    // Memorizza parametri per la paginazione
    const searchParams = {
      orgType,
      orgId: parsedId,
      executeSearch, // usato da App.handlePageChange
    };
    setCurrentSearch(searchParams);

    await executeSearch({ orgType, orgId: parsedId, page: 1 });

    setIsLoading(false);
    // (facoltativo) pulisci i campi
    setOrgId('');
    setSelectedOrgId('');
  };

  return (
    <div className="person-form-card">
      <div className="form-title">{title}</div>

      {/* Selezione tipo organizzazione */}
      <label className="form-label" htmlFor="org-type">Tipo di organizzazione:</label>
      <select
        id="org-type"
        className="form-input-short"
        value={orgType}
        onChange={(e) => {
          setOrgType(e.target.value);
          setSelectedOrgId('');
          setError('');
        }}
        disabled={isLoading}
      >
        <option value="">Seleziona</option>
        <option value="Company">Company</option>
        <option value="University">University</option>
      </select>

      {/* Campo manuale per Organization ID */}
      <label className="form-label" htmlFor="org-id">Organization ID (manuale):</label>
      <input
        className="form-input-short"
        id="org-id"
        type="text"
        value={orgId}
        onChange={(e) => {
          setOrgId(e.target.value);
          setError('');
        }}
        disabled={isLoading}
      />

      {/* Tendina IDs dipendente dal tipo */}
      <label className="form-label">Oppure scegli un Organization ID:</label>
      <select
        className="form-input-short"
        value={selectedOrgId}
        onChange={(e) => {
          setSelectedOrgId(e.target.value);
          setError('');
        }}
        disabled={isLoading || !orgType || orgId.trim() !== ''}
      >
        <option value="">
          {orgType ? `Seleziona un ID ${orgType}` : 'Seleziona prima il tipo'}
        </option>
        {orgOptions.map((id) => (
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
          isLoading ||
          !orgType ||
          (!orgId.trim() && !selectedOrgId) ||
          !!error
        }
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default OrganizationPostForm;
