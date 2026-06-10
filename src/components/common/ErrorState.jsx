const ErrorState = ({ message = "Something went wrong" }) => (
  <div className="state state-error" role="alert">
    {message}
  </div>
);

export default ErrorState;
