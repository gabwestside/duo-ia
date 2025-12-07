import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);

      const fadeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 600);

      return () => clearTimeout(fadeTimer);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen isFadingOut={isFadingOut} />;
  }

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
