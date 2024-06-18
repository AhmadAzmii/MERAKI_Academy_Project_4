
return (
    <div className="UserDashboard">
      <h2>User Dashboard</h2>
      <div className="select-container">
        <select className="custom-select" onChange={handleSpecialistChange}>
          <option value="">All Posts</option>
          {providerInfo.map((post) => (
            <option key={post._id} value={post.specialist.name}>
              {post.specialist.name}
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        {filteredProviderInfo.map((post) => (
          <div key={post._id} className="card mb-3">
            <div className="card-body">
              <h2 className="card-title text-center">{post?.author?.userName}</h2>
              <h2 className="card-subtitle mb-2 text-muted text-center">
                {post.specialist.name}
              </h2>
              <h3 className="mt-3">{post.title}</h3>
              <p className="card-text">{post.description}</p>
              <ul className="list-group">
                <li className="list-group-item">
                  Availability: {post.availability}
                </li>
                <li className="list-group-item">
                  Experience: {post.experience}
                </li>
              </ul>
              {post.reviews.map((review, i) => (
                <div key={i} className="card mt-3">
                  <div className="card-body">
                    <h4 className="card-title">Review: {review.review}</h4>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              ))}
              <div className="mt-3">
                <input
                  className="form-control review-input"
                  type="text"
                  placeholder="Review..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                />
                <StarRating rating={rating} setRating={setRating} />
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleReview(post._id)}
                >
                  Add review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showLoginPopup && (
        <div className="login-popup">
          <div className="popup-content">
            <p>You need to login first to perform this action.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );