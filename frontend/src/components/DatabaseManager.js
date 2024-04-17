import React, { useEffect, useState } from 'react';
import MovieAPI from './MovieAPI'; // Ensure the path is correct

function DatabaseManager() {
  const [movies, setMovies] = useState([]);
  const [movieName, setMovieName] = useState('');
  const [editYear, setEditYear] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State to track selected movie

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = await MovieAPI.getAllMovies();
      setMovies(fetchedMovies);
      const initialEditYear = fetchedMovies.reduce((acc, movie) => ({
        ...acc,
        [movie.id]: movie.year || '' // Ensures a string is always set, even if `movie.year` is undefined
      }), {});
      setEditYear(initialEditYear);
    };
    fetchMovies();
  }, []);

  const refreshMovies = async () => {
    const fetchedMovies = await MovieAPI.getAllMovies();
    setMovies(fetchedMovies);
  };

  const addMovie = async (e) => {
    e.preventDefault();
    const newMovie = { name: movieName, year: '', comments: [], id: movieName };
    await MovieAPI.createMovie(newMovie);
    await refreshMovies(); // Refresh the list after adding
    setMovieName(''); // Reset form
  };
  
  const deleteMovie = async (id) => {
    await MovieAPI.deleteMovie(id).then(refreshMovies);;
    setMovies(movies.filter(movie => movie.id !== id));
    if (id === selectedMovieId) setSelectedMovieId(null); // Deselect if deleted
  };

  const updateMovieYear = async (id) => {
    if (editYear[id]) {
      const updatedMovie = await MovieAPI.updateMovie(id, { year: editYear[id] });
      await refreshMovies();
      // Ensure we're correctly updating the state to reflect the updated movie
      setMovies(currentMovies => currentMovies.map(movie => 
        movie.id === id ? { ...movie, ...updatedMovie } : movie
      ));
      // Reset edit field for the updated movie
      setEditYear(prev => ({ ...prev, [id]: updatedMovie.year || '' }));
    }
  };

  

  const handleInputChange = (e) => {
    setMovieName(e.target.value);
  };

  const handleYearInputChange = (id, e) => {
    e.stopPropagation(); // Prevent event from propagating to parent
    setEditYear({ ...editYear, [id]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClick = (e, movieId) => {
    e.stopPropagation(); // Additional safeguard
    setSelectedMovieId(movieId === selectedMovieId ? null : movieId);
  };

  const filteredMovies = movies.filter(movie =>
    movie.name ? movie.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

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
      <div>
        {filteredMovies.map(movie => (
          <div
            key={movie.id}
            style={{ 
              cursor: 'pointer', 
              color: selectedMovieId === movie.id ? 'red' : 'black', 
              margin: '10px 0' 
            }}
            onClick={(e) => handleClick(e, movie.id)}
          >
            {movie.name} ({movie.year ?? ''})
            {selectedMovieId === movie.id && (
              <div onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="Enter year"
                  value={editYear[movie.id]}
                  onChange={(e) => handleYearInputChange(movie.id, e)}
                  onClick={e => e.stopPropagation()} // Stop propagation on click
                />
                <button onClick={(e) => {e.stopPropagation(); updateMovieYear(movie.id);}}>Update</button>
                <button onClick={(e) => {e.stopPropagation(); deleteMovie(movie.id);}}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatabaseManager;
