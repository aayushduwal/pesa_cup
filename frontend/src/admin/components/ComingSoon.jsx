import "../css/Admin.css";

export default function ComingSoon({ title, description, apiHint }) {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="admin-coming-soon">
        <p>
          This page hasn't been built out yet — the API client is ready to use.
        </p>
        {apiHint && <code>{apiHint}</code>}
      </div>
    </div>
  );
}
