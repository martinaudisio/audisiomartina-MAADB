import React from 'react';

const PostByOrgResult = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4">Nessun post disponibile.</div>
    );
  }

  return (
    <div className="space-y-6">
      {content.map((person) => {
        if (!person || !person.posts) return null;

        const creator = {
          firstName: person.name || '',
          lastName: person.surname || '',
        };

        return (
          <div key={person.id} className="space-y-4">
            {person.posts.map((item) => {
              const creationDate = item.creationDate
                ? new Date(item.creationDate).toLocaleString()
                : 'Data non disponibile';

              return (
                <div
                  key={item._id || item.id}
                  className="flex items-start p-4 mb-3 rounded-lg border border-gray-200 shadow-sm bg-white"
                >
                  {/* Cerchio immagine profilo */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0" />

                  {/* Informazioni post */}
                  <div className="flex flex-col flex-1">
                    <div className="text-lg font-bold text-gray-900">
                      {creator.firstName} {creator.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.type || 'Post'} – {creationDate}
                    </div>
                    {item.content ? (
                      <div className="mt-2 text-gray-800 text-base">{item.content}</div>
                    ) : (
                      <img
                        src="/images/liam-briese-wB7V7mhufy4-unsplash.jpg"
                        alt="placeholder"
                        className="mt-3 w-32 h-32 object-cover rounded-lg shadow-md"
                        style={{ maxWidth: '100%', maxHeight: '200px', display: 'block' }}
                      />
                    )}
                    {item.forumTitle && (
                      <div className="text-sm text-indigo-600 mt-1 italic">
                        Forum: {item.forumTitle}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PostByOrgResult;
