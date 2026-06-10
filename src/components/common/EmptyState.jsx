const EmptyState = ({ title = "Nothing here yet", children }) => (
  <div className="state state-empty">
    <strong>{title}</strong>
    {children ? <p>{children}</p> : null}
  </div>
);

export default EmptyState;
