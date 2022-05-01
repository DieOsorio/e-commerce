const MessageBox = ({ variant, children }) => {
  return (
    <div className={`alert alert-${variant || "info"}`} role="alert">
      {children}
    </div>
  );
};

export default MessageBox;
