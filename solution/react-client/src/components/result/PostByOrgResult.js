import React from 'react';

const PostByOrgResult = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4">Nessun post disponibile.</div>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((person) => {
        if (!person || !person.posts) return null;

        const creator = {
          firstName: person.name || '',
          lastName: person.surname || '',
        };

        return person.posts.map((item) => {
          const creationDate = item.creationDate
            ? new Date(item.creationDate).toLocaleString()
            : 'Data non disponibile';

          // Determina il tipo di contenuto
          const itemType = item.content ? 'Post' : 'Post'; // Assume sempre Post per ora
          
          return (
            <div
              key={item._id || item.id}
              className="flex items-start p-4 mb-3 rounded-lg border border-gray-200 shadow-sm bg-white"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
              }}
            >
              {/* Cerchio immagine profilo */}
              <div
                className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#d1d5db',
                  marginRight: '16px',
                  flexShrink: 0,
                }}
              />

              {/* Informazioni post */}
              <div className="flex flex-col flex-1">
                <div className="text-lg font-bold text-gray-900">
                  {creator.firstName} {creator.lastName}
                </div>

                <div className="text-sm text-gray-500">
                  {itemType} – {creationDate}
                </div>

                {item.content ? (
                  <div className="mt-2 text-gray-800 text-base">
                    {item.content}
                  </div>
                ) : (
                  itemType === 'Post' && (
                    <img
                      src="/images/liam-briese-wB7V7mhufy4-unsplash.jpg"
                      alt="placeholder"
                      className="mt-3 w-32 h-32 object-cover rounded-lg shadow-md"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        display: 'block',
                      }}
                    />
                  )
                )}

                {/* Forum title solo per i Post */}
                {itemType === 'Post' && item.forumTitle && (
                  <div className="text-sm text-indigo-600 mt-1 italic">
                    Forum: {item.forumTitle}
                  </div>
                )}

                {/* Card del Parent Post se è un commento - per ora non applicabile ma pronto per future estensioni */}
                {itemType === 'Comment' && item.parentPost?.content && (
                  <div className="flex items-start p-4 mb-3 rounded-lg border border-gray-200 shadow-sm bg-white"
                    style={{
                      display: 'flex',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      alignItems: 'flex-start',
                      padding: '16px',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      backgroundColor: 'white',
                    }}>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                      <div className="text-sm text-gray-500 font-medium mb-1">
                        Reply of:
                      </div>
                      <div className="text-sm text-gray-700">
                        {item.parentPost.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default PostByOrgResult;