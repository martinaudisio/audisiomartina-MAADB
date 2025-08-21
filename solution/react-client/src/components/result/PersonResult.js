import React from 'react';

const PersonResult = ({ person }) => {
  const personData = person.data || {};
  const {
    id = '',
    name = '',
    surname = '', 
    mutualFriends = null
  } = person || {};

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backgroundColor: 'white'
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#d1d5db',
    marginRight: '16px',
    flexShrink: 0
  };

  const nameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937'
  };

  const idStyle = {
    fontSize: '14px',
    color: '#6b7280'
  };

  return (
    <div 
      className="flex items-center p-4 mb-3 rounded-lg border border-gray-200 shadow-sm bg-white" 
      style={cardStyle}
    >
      {/* Cerchio per l'immagine profilo */}
      <div 
        className="w-12 h-12 bg-gray-300 rounded-full mr-4" 
        style={avatarStyle}
      ></div>
      
      {/* Info della persona */}
      <div className="flex flex-col">
        <div 
          className="text-lg font-bold text-gray-900" 
          style={nameStyle}
        >
          {name} {surname}
        </div>
        {id && (
          <div 
            className="text-sm text-gray-500" 
            style={idStyle}
          >
          ID:{id}
          </div>
        )}
        {mutualFriends !== null && (
          <div className="text-sm text-gray-600 mt-1">
            Amici in comune:{mutualFriends}
          </div>)}
      </div>
    </div>
  );
};

export default PersonResult;