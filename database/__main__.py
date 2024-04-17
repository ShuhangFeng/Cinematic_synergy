from flask import Flask, request, Response
from pymongo import MongoClient
from bson import ObjectId
import bson.json_util as json_util
import hashlib

app = Flask(__name__)

def get_mongo_client(movie_id):
    hash_input = str(movie_id).encode()
    result = int(hashlib.md5(hash_input).hexdigest(), 16) % 3  # Assuming 3 MongoDB instances
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
    inserted_id = db.movies.insert_one(data).inserted_id
    data['_id'] = str(inserted_id)
    return Response(json_util.dumps({"status": "success", "data": data}), mimetype='application/json'), 201

@app.route('/movies/<movie_id>', methods=['GET'])
def read_movie(movie_id):
    client = get_mongo_client(movie_id)
    db = client.movies
    movie = db.movies.find_one({"id": movie_id})
    if movie:
        return Response(json_util.dumps(movie), mimetype='application/json')
    else:
        return Response(json_util.dumps({"error": "Movie not found"}), mimetype='application/json'), 404

@app.route('/movies/<movie_id>', methods=['PUT'])
def update_movie(movie_id):
    data = request.json

    data.pop('_id', None)
    
    client = get_mongo_client(movie_id)
    db = client.movies
    result = db.movies.update_one({"id": movie_id}, {"$set": data})
    if result.modified_count:
        return Response(json_util.dumps({"status": "success", "data": data}), mimetype='application/json')
    else:
        return Response(json_util.dumps({"error": "Update failed"}), mimetype='application/json'), 404

@app.route('/movies', methods=['GET'])
def get_all_movies():
    clients = [
        MongoClient('mongodb://localhost:27017/'),
        MongoClient('mongodb://localhost:27018/'),
        MongoClient('mongodb://localhost:27019/')
    ]
    all_movies = []
    for client in clients:
        db = client.movies
        movies = db.movies.find()
        all_movies.extend(movies)
    return Response(json_util.dumps(all_movies), mimetype='application/json')

@app.route('/movies/<movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    client = get_mongo_client(movie_id)
    db = client.movies
    result = db.movies.delete_one({"id": movie_id})
    if result.deleted_count:
        return Response(json_util.dumps({"status": "success"}), mimetype='application/json')
    else:
        return Response(json_util.dumps({"error": "Delete failed"}), mimetype='application/json'), 404

if __name__ == '__main__':
    app.run(debug=True)
