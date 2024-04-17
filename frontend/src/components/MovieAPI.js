// /frontend/src/components/MovieAPI.js

class MovieAPI {
    static baseURL = '/movies';

    static async createMovie(movieData) {
        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData),
        });
        return response.json();
    }

    static async getMovie(movieId) {
        const response = await fetch(`${this.baseURL}/${movieId}`);
        return response.json();
    }

    static async updateMovie(movieId, movieData) {
        const response = await fetch(`${this.baseURL}/${movieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData),
        });
        return response.json();
    }

    static async getAllMovies() {
        const response = await fetch(this.baseURL);
        return response.json();
    }

    static async deleteMovie(movieId) {
        const response = await fetch(`${this.baseURL}/${movieId}`, {
            method: 'DELETE',
        });
        return response.json();
    }
}

export default MovieAPI;



