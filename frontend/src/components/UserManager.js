import React, { useState, useEffect } from 'react';
import MovieAPI from './MovieAPI';

function UserManager() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      const fetchedMovies = await MovieAPI.getAllMovies();
      setMovies(fetchedMovies);
    }
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addComment = async (movieId) => {
    const movieToUpdate = movies.find(movie => movie.id === movieId);
    if (!movieToUpdate) return;
  
    // Ensure movieToUpdate.comments is an array. Default to an empty array if it's not set.
    const comments = movieToUpdate.comments || [];
    const newCommentId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1;
    const newComment = { id: newCommentId, text: commentText, user: userName };
    const updatedComments = [...comments, newComment];
    const updatedMovie = { ...movieToUpdate, comments: updatedComments };
  
    await MovieAPI.updateMovie(movieId, updatedMovie);
    refreshMovies();
  };

  
  const updateComment = (movieId, commentId) => {
    const newText = prompt("Update your comment:");
    if (newText !== null && newText.trim() !== '') {
      const movieToUpdate = movies.find(movie => movie.id === movieId);
      if (!movieToUpdate) return;
  
      const updatedComments = movieToUpdate.comments.map(comment =>
        comment.id === commentId ? { ...comment, text: newText } : comment
      );
      const updatedMovie = { ...movieToUpdate, comments: updatedComments };
  
      MovieAPI.updateMovie(movieId, updatedMovie).then(refreshMovies);
    }
  };
  
  const deleteComment = async (movieId, commentId) => {
    const movieToUpdate = movies.find(movie => movie.id === movieId);
    if (!movieToUpdate) return;

    const updatedComments = movieToUpdate.comments.filter(comment => comment.id !== commentId);
    const updatedMovie = { ...movieToUpdate, comments: updatedComments };

    await MovieAPI.updateMovie(movieId, updatedMovie);
    refreshMovies();
  };

  const refreshMovies = async () => {
    const fetchedMovies = await MovieAPI.getAllMovies();
    setMovies(fetchedMovies);
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
                {(movie.comments && movie.comments.length > 0) ? (
                  <ul>
                    {movie.comments.map(comment => (
                      <li key={comment.id}>
                        {comment.text} - {comment.user}
                        <button onClick={() => updateComment(movie.id, comment.id)}>Update</button>
                        <button onClick={() => deleteComment(movie.id, comment.id)}>Delete</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
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
