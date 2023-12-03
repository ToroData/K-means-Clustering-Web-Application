from flask import Flask, render_template, request, jsonify
from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run-kmeans', methods=['POST'])
def run_kmeans():
    data = request.json['data']
    n_clusters = request.json['n_clusters']
    kmeans = KMeans(n_clusters=n_clusters)
    kmeans.fit(data)
    centers = kmeans.cluster_centers_.tolist()
    labels = kmeans.labels_.tolist()
    return jsonify({"labels": labels, "centers": centers})

if __name__ == '__main__':
    app.run(debug=True)
