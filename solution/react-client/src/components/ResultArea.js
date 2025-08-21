import PersonResult from './result/PersonResult.js';
import PostResult from './result/PostResult.js';
import FOFResult from './result/FoFResult.js';
import TimeResult from './result/TimeResult.js';
import Spinner from 'react-bootstrap/Spinner';
import PostByOrgResult from './result/PostByOrgResult.js';

const ResultArea = ({ results, type, isLoading, onPageChange }) => {

  // estrai il payload reale (gestione paginazione se usata altrove)
  const rawData = results && typeof results === 'object' && 'data' in results ? results.data : results;
  const pagination = results && typeof results === 'object' && 'pagination' in results ? results.pagination : null;
  const hasSearched = results && typeof results === 'object' && 'hasSearched' in results ? results.hasSearched : false;


  // errore: può trovarsi sia in results che in rawData a seconda della API
  const isError = hasSearched && ((results && typeof results === 'object' && 'error' in results) ||
    (rawData && typeof rawData === 'object' && 'error' in rawData));

  // normalizza e rimuovi eventuali elementi null/undefined
  const items = Array.isArray(rawData) ? rawData.filter(i => i != null) :
    rawData == null ? [] : [rawData];

  // FIX: Correzione del confronto isEmpty
  const isEmpty = items.length === 0;

  // DEBUG: Aggiungi questi log
  console.log("results:", results);
  console.log("hasSearched:", hasSearched);
  console.log("rawData:", rawData);
  console.log("items:", items);
  console.log("isEmpty:", isEmpty);
  console.log("isError:", isError);
  console.log("pagination:", pagination);
   console.error("🔴 DEBUG - type:", type);
  console.error("🔴 DEBUG - type === 'postbyorg':", type === 'postbyorg');

  // FIX: paginazione - controlla anche se pagination esiste
  const hasNextPage = pagination && pagination.page && pagination.limit && pagination.total &&
    (pagination.page * pagination.limit < pagination.total);
  const hasPrevPage = pagination && pagination.page && pagination.page > 1;


  return (
    <div className="results-area relative min-h-[200px] p-4 border rounded bg-white overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">Risultati</h3>

      {/* PRIORITÀ 1: Spinner */}
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Stato iniziale */}
          {results === undefined && !hasSearched && (
            <p className="text-gray-500">Effettua una ricerca per vedere i risultati.</p>
          )}

          {/* Errore */}
          {isError && hasSearched && (
            <p className="text-red-600 font-bold">
              Errore: {"Nessun risultato trovato."}
            </p>
          )}


          {/* Risultati */}
          {!isError && hasSearched && /*items.length> 0*/  (
            <>
              {type === 'person' && (
                <div className="space-y-2">
                  {items.map((item, idx) =>
                    item && typeof item === 'object' ? (
                      <PersonResult key={item?.id ?? `person-${idx}`} person={item} />
                    ) : null
                  )}
                </div>
              )}
              {type === 'post' && <PostResult data={items} />}
              {type === 'fof' && <FOFResult fofData={items} />}
              {type === 'time' && <TimeResult timeData={items} />}
              {type === 'postbyorg' && (
                <PostByOrgResult content={items} />
              )}

              {/* Paginazione */}
              {/* Paginazione */}
              {(hasPrevPage || hasNextPage) && onPageChange && (
                <div className="pagination-container">
                  {hasPrevPage && (
                    <button
                      onClick={() => onPageChange(pagination.page - 1)}
                      disabled={isLoading}
                      className={`pagination-btn prev ${isLoading ? 'loading' : ''}`}
                    >
                      Pagina precedente
                    </button>
                  )}
                  
                  <span className="pagination-info">
                    Pagina {pagination.page} di {Math.ceil(pagination.total / pagination.limit)}
                  </span>
                  
                  {hasNextPage && (
                    <button
                      onClick={() => onPageChange(pagination.page + 1)}
                      disabled={isLoading}
                      className={`pagination-btn next ${isLoading ? 'loading' : ''}`}
                    >
                      Prossima pagina
                    </button>
                  )}
                </div>
              )}
            </>
          )}

        </>
      )}
    </div>

  );
}

export default ResultArea;