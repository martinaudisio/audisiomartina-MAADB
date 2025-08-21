import React from 'react';

const TimeResult = ({ timeData }) => {
  console.log('Time Data received:', timeData);

  // Extract the first item from the array
  const processedData = Array.isArray(timeData) && timeData.length > 0 
    ? timeData[0] 
    : null;

  if (!processedData) {
    return (
      <div 
        className="p-4 mb-3 rounded-lg border border-gray-200 shadow-sm bg-white"
        style={{
          padding: '16px',
          marginBottom: '12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white'
        }}
      >
        <p className="text-gray-700">Nessun dato sul tempo di risposta disponibile</p>
      </div>
    );
  }

  const { formatted, averageReplyTimeSeconds } = processedData;

  // Stili inline come backup nel caso in cui Tailwind non funzioni correttamente
  const cardStyle = {
    padding: '16px',
    mariginTop: '12px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backgroundColor: 'white'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '12px'
  };

  const detailStyle = {
    fontSize: '16px',
    color: '#4b5563',
    marginBottom: '8px'
  };

  const secondsStyle = {
    fontSize: '14px',
    color: '#6b7280',
    fontStyle: 'italic'
  };

  return (
    <div 
      className="p-4 mb-3 rounded-lg border border-gray-200 shadow-sm bg-white"
      style={cardStyle}
    >
      <h4 
        className="text-lg font-bold text-gray-900 mb-3"
        style={titleStyle}
      >
        Tempo di Risposta
      </h4>
      
      {formatted ? (
        <div>
          <p 
            className="text-base text-gray-700 mb-2"
            style={detailStyle}
          >
            {formatted.days} giorni, {formatted.hours} ore, {formatted.minutes} minuti, {formatted.seconds} secondi
          </p>
          <p 
            className="text-sm text-gray-500 italic"
            style={secondsStyle}
          >
            ({averageReplyTimeSeconds.toFixed(2)} secondi)
          </p>
        </div>
      ) : (
        <p className="text-gray-700">Formato tempo non disponibile</p>
      )}
    </div>
  );
};

export default TimeResult;