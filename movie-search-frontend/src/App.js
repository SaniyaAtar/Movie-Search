import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; 

const BACKEND_URL = "http://localhost:5000";

const quotes = [
  "The movies are the only business where you can go out front and applaud yourself.",
  "Cinema is a matter of what's in the frame and what's out.",
  "Every great film should seem new every time you see it.",
  "Movies touch our hearts and awaken our vision.",
  "The power of cinema lies in its ability to evoke emotions."
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const searchMovies = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${BACKEND_URL}/api/movies`, {
        params: { title: searchTerm },
      });
      setMovies(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${BACKEND_URL}/api/movie/${id}`);
      setSelectedMovie(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch movie details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="container mt-5">
        <h1 className="text-center text-white">Movie Search App</h1>

       
        <div className="text-center text-white mb-4">
          <em>"{quote}"</em>
        </div>

        
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter movie title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={searchMovies}>
            Search
          </button>
        </div>

      
        {error && <div className="alert alert-danger">{error}</div>}

       
        {loading && <div className="text-center text-white">Loading...</div>}

        {movies.length > 0 && (
          <div className="row">
            {movies.map((movie) => (
              <div className="col-md-3 mb-4" key={movie.imdbID}>
                <div className="card h-100">
                  <img
                    src={movie.Poster}
                    className="card-img-top"
                    alt={movie.Title}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{movie.Title}</h5>
                    <p className="card-text">Year: {movie.Year}</p>
                    <button
                      className="btn btn-secondary mt-auto"
                      onClick={() => fetchMovieDetails(movie.imdbID)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMovie && (
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedMovie.Title}</h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedMovie(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <img
                    src={selectedMovie.Poster}
                    className="img-fluid mb-3"
                    alt={selectedMovie.Title}
                  />
                  <p>
                    <strong>Plot:</strong> {selectedMovie.Plot}
                  </p>
                  <p>
                    <strong>Rating:</strong> {selectedMovie.imdbRating}
                  </p>
                  <p>
                    <strong>Release Year:</strong> {selectedMovie.Year}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
