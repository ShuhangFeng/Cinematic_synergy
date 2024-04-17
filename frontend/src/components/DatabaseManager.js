import React, { useState } from 'react';
import moviesData from './movies.json';

function DatabaseManager() {
    const [movies, setMovies] = useState(moviesData);
    const [movieName, setMovieName] = useState('');
    const [editYear, setEditYear] = useState(
      moviesData.reduce((acc, movie) => ({ ...acc, [movie.id]: '' }), {})
    );
    const [searchQuery, setSearchQuery] = useState('');
  
    const addMovie = (e) => {
      e.preventDefault();
      const newId = Math.max(0, ...movies.map(movie => movie.id)) + 1; // Avoid ID duplication
      const newMovie = { id: newId, name: movieName, year: '', comments: [] };
      setMovies([...movies, newMovie]);
      setEditYear(prev => ({ ...prev, [newId]: '' }));
      setMovieName(''); // Reset form
    };

  const deleteMovie = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
    setEditYear(prev => {
      const { [id]: value, ...rest } = prev; // Safely remove property without direct mutation
      return rest;
    });
  };

  const updateMovieYear = (id) => {
    if (editYear[id]) {
      setMovies(movies.map(movie => movie.id === id ? { ...movie, year: editYear[id] } : movie));
      setEditYear(prev => ({ ...prev, [id]: '' })); // Reset edit field
    }
  };

  const handleInputChange = (e) => {
    setMovieName(e.target.value);
  };

  const handleYearInputChange = (id, e) => {
    setEditYear({ ...editYear, [id]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMovies = movies.filter(movie => movie.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <h2>Database Manager</h2>
      <form onSubmit={addMovie}>
        <input
          type="text"
          value={movieName}
          onChange={handleInputChange}
          placeholder="Enter movie name"
          required
        />
        <button type="submit">Add Movie</button>
      </form>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search movie"
      />
      <ul>
        {filteredMovies.map(movie => (
          <li key={movie.id}>
            {movie.name} ({movie.year})
            <input
              type="text"
              placeholder="Enter year"
              value={editYear[movie.id]}
              onChange={(e) => handleYearInputChange(movie.id, e)}
            />
            <button onClick={() => updateMovieYear(movie.id)}>Update</button>
            <button onClick={() => deleteMovie(movie.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DatabaseManager;
