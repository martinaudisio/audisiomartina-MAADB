import React from 'react';

const PostCard = ({ author, content, image }) => {
  return (
    <div className="post-card">
      <img src={image} alt="user" className="avatar" />
      <div>
        <p><strong>Autore: {author}</strong></p>
        <p>Contentua: {content}</p>
      </div>
    </div>
  );
};

export default PostCard;
