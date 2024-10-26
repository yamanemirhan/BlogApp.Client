import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="max-w-full mx-auto px-4 py-6 min-h-screen pt-[100px]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
