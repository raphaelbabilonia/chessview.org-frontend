const LoadingState = ({ label = "Loading" }) => (
  <div className="state state-loading" role="status">
    <span className="spinner" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default LoadingState;
