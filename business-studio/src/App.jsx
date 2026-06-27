import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import LandingPage from "./Pages/LandingPage";
import AuthPage from "./Pages/AuthPage";
import Dashboard from "./Pages/Dashboard";
import StudioBuilder from "./Pages/StudioBuilder";
import Gallery from "./Pages/Gallery";
import SiteView from "./Pages/SiteView";

const API =
  import.meta.env.VITE_API_URL ||
  "https://business-studio-7tqf.onrender.com";

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function AppLayout({ user, onLogout, children, hideFooter }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar user={user} onLogout={onLogout} />

      <main style={{ flex: 1 }}>
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.status === "success") {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    checkLogin();
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
  }

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          className="spinner"
          style={{
            width: 40,
            height: 40,
            borderWidth: 3,
          }}
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <LandingPage />
            </AppLayout>
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage mode="login" onLogin={setUser} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage mode="signup" onLogin={setUser} />
            )
          }
        />

        <Route
          path="/gallery"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <Gallery />
            </AppLayout>
          }
        />

        <Route
          path="/site/:subdomain"
          element={<SiteView />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/studio/:id"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user}
                onLogout={handleLogout}
                hideFooter
              >
                <StudioBuilder user={user} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <div style={{ textAlign: "center", padding: 80 }}>
                <h1>404</h1>
                <h2>Page not found</h2>
              </div>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}