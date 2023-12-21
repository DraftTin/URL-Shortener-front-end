import { useState } from "react";

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [expiry, setExpiry] = useState("");
  const [rateLimit, setRateLimit] = useState(0);
  const [rateReset, setRateReset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await fetch("/api/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: originalUrl }),
      });
      const data = await response.json();
      if (data.error != null) {
        console.error(data.error);
        setError(data.error);
      } else {
        setShortenedUrl(data.short);
        setExpiry(data.expiry);
        setRateLimit(data.rate_limit);
        setRateReset(data.rate_limit_reset);
      }
    } catch (err) {
      setError(String(err));
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <div className="inputContainer">
      <div>
        <h1>
          URL <span>Shortener</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Paster a link to shorten it"
            />
            <button
              className="btn btn-outline-secondary"
              type="submit"
              id="button-addon2"
            >
              SHORTEN
            </button>
          </div>
        </form>
      </div>
      {loading && <p className="noData">Loading</p>}
      {error && <p className="noData">Something went wrong</p>}
      {shortenedUrl && !loading && (
        <div className="result">
          <p>
            Shortened URL:
            <span> {shortenedUrl}</span>
          </p>
          <p>Expiry: {expiry}</p>
          <p>Rate Remaining: {rateLimit}</p>
          <p>Rate Remaining Reset: {rateReset} minutes</p>
        </div>
      )}
    </div>
  );
}

export default UrlShortener;
