<h3>See the weather in your city</h3>
{weather && (
  <div className="weather-card-container">
    <div className="weather-card">
      <div className="weather-card-body">
        <div className="row">
          <div className="col-md-6 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a City"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-4">
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <h6>{weather.name}</h6>
          <h6>{new Date().toLocaleTimeString()}</h6>
        </div>
        <div className="text-center mt-5 mb-4">
          <h6 className="display-4 mb-0 font-weight-bold">
            {weather.main.temp}°C
          </h6>
          <span className="small text-muted">
            {weather.weather[0].description}
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="weather-details">
            <div>
              <i className="fas fa-wind text-muted"></i>
              <span className="ms-1">{weather.wind.speed} km/h</span>
            </div>
            <div>
              <i className="fas fa-tint text-muted"></i>
              <span className="ms-1">{weather.main.humidity}%</span>
            </div>
            <div>
              <i className="fas fa-sun text-muted"></i>
              <span className="ms-1">{weather.clouds.all}%</span>
            </div>
          </div>
          <div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              width="100px"
              alt="Weather icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}