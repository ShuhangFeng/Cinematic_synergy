import React, { useState } from 'react';
import Papa from 'papaparse';
import MovieAPI from './MovieAPI'; // Assuming MovieAPI is in the same directory

const MovieImporter = () => {
  const [file, setFile] = useState(null);
  const [yearFieldName, setYearFieldName] = useState(''); // Changed from year to yearFieldName
  const [nameFieldName, setNameFieldName] = useState(''); // Changed from name to nameFieldName

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleYearFieldNameChange = (event) => {
    setYearFieldName(event.target.value);
  };

  const handleNameFieldNameChange = (event) => {
    setNameFieldName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const movies = results.data;
          // Instead of finding a single movie, we loop through all movies
          movies.forEach((movie) => {
            // Use dynamic field names for year and name
            const movieYear = movie[yearFieldName];
            const movieName = movie[nameFieldName];
            // Check if both fields are present
            if (movieYear && movieName) {
              MovieAPI.createMovie({ name: movieName, year: movieYear, id: movieName })
                .then((response) => {
                  console.log(`Movie added: ${movieName}, ${movieYear}`, response);
                })
                .catch((error) => {
                  console.error(`Error adding movie: ${movieName}, ${movieYear}`, error);
                });
            }
          });
          alert('Movies import process initiated. Check console for details.');
        }
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            CSV File:
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </label>
        </div>
        <div>
          <label>
            Year Field Name:
            <input type="text" value={yearFieldName} onChange={handleYearFieldNameChange} />
          </label>
        </div>
        <div>
          <label>
            Movie Name Field Name:
            <input type="text" value={nameFieldName} onChange={handleNameFieldNameChange} />
          </label>
        </div>
        <button type="submit">Import Movies</button>
      </form>
    </div>
  );
};

export default MovieImporter;
