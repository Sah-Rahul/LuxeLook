const Layout = ({ children }) => {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        {children}
      </div>
    </>
  );
};

export default Layout;
