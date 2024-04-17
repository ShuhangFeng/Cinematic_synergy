import React, { useState } from 'react';
import moviesData from './movies.json';

function UserManager() {
  const [movies, setMovies] = useState(moviesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addComment = (movieId) => {
    const updatedMovies = movies.map(movie => {
      if (movie.id === movieId) {
        const newCommentId = movie.comments.length > 0 ? Math.max(...movie.comments.map(c => c.id)) + 1 : 1;
        const updatedMovie = {
          ...movie,
          comments: [...movie.comments, { id: newCommentId, text: commentText, user: userName }]
        };
        return updatedMovie;
      }
      return movie;
    });
    setMovies(updatedMovies);
    setCommentText('');
    setUserName('');
  };

  const updateComment = (movieId, commentId) => {
    const newText = prompt("Update your comment:");
    if (newText !== null && newText.trim() !== '') {
      setMovies(movies.map(movie => {
        if (movie.id === movieId) {
          return {
            ...movie,
            comments: movie.comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, text: newText };
              }
              return comment;
            })
          };
        }
        return movie;
      }));
    }
  };

  const deleteComment = (movieId, commentId) => {
    setMovies(movies.map(movie => {
      if (movie.id === movieId) {
        return {
          ...movie,
          comments: movie.comments.filter(comment => comment.id !== commentId)
        };
      }
      return movie;
    }));
  };

  return (
    <div>
      <h2>User Manager</h2>
      <input
        type="text"
        placeholder="Search for a movie"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredMovies.length > 0 && (
        filteredMovies.map(movie => (
          <div key={movie.id} style={{ margin: '10px 0' }}>
            <h3
              onClick={() => setSelectedMovieId(selectedMovieId === movie.id ? null : movie.id)}
              style={{ cursor: 'pointer', color: selectedMovieId === movie.id ? 'blue' : 'black' }}
            >
              {movie.name + ', ' + movie.year}
            </h3>
            {selectedMovieId === movie.id && (
              <>
                <ul>
                  {movie.comments.map(comment => (
                    <li key={comment.id}>
                      {comment.text} - {comment.user}
                      <button onClick={() => updateComment(movie.id, comment.id)}>Update</button>
                      <button onClick={() => deleteComment(movie.id, comment.id)}>Delete</button>
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a comment"
                />
                <button onClick={() => addComment(selectedMovieId)}>Add Comment</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserManager;
