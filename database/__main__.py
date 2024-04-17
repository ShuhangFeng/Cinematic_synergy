from flask import Flask, request, jsonify
from pymongo import MongoClient
import hashlib

app = Flask(__name__)

# Connect to MongoDB instances
def get_mongo_client(movie_id):
    # Simple hash-based partitioning
    result = int(hashlib.md5(movie_id.encode()).hexdigest(), 16) % 3  # Assuming 3 MongoDB instances
    if result == 0:
        return MongoClient('mongodb://localhost:27017/')
    elif result == 1:
        return MongoClient('mongodb://localhost:27018/')
    else:
        return MongoClient('mongodb://localhost:27019/')

@app.route('/movies', methods=['POST'])
def create_movie():
    data = request.json
    client = get_mongo_client(data['id'])
    db = client.movies
    db.movies.insert_one(data)
    return jsonify({"status": "success", "data": data}), 201

@app.route('/movies/<movie_id>', methods=['GET'])
def read_movie(movie_id):
    client = get_mongo_client(movie_id)
    db = client.movies
    movie = db.movies.find_one({"id": movie_id})
    if movie:
        return jsonify(movie)
    else:
        return jsonify({"error": "Movie not found"}), 404

@app.route('/movies/<movie_id>', methods=['PUT'])
def update_movie(movie_id):
    data = request.json
    client = get_mongo_client(movie_id)
    db = client.movies
    result = db.movies.update_one({"id": movie_id}, {"$set": data})
    if result.modified_count:
        return jsonify({"status": "success", "data": data})
    else:
        return jsonify({"error": "Update failed"}), 404

@app.route('/movies', methods=['GET'])
def get_all_movies():
    # Assuming three MongoDB instances are used for partitioning
    clients = [MongoClient('mongodb://localhost:27017/'),
               MongoClient('mongodb://localhost:27018/'),
               MongoClient('mongodb://localhost:27019/')]

    all_movies = []
    for client in clients:
        db = client.movies
        # Fetch all movies from the current MongoDB instance
        movies = db.movies.find()
        # Convert MongoDB Cursor to list of dicts
        all_movies.extend(list(movies))

    return jsonify(all_movies)

@app.route('/movies/<movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    client = get_mongo_client(movie_id)
    db = client.movies
    result = db.movies.delete_one({"id": movie_id})
    if result.deleted_count:
        return jsonify({"status": "success"})
    else:
        return jsonify({"error": "Delete failed"}), 404

if __name__ == '__main__':
    app.run(debug=True)
