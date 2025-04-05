import { useEffect } from "react";
import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import NotFound from "./pages/not-found";
import { useAuth } from "./context/AuthContext";
import FirebaseTest from "./components/FirebaseTest";
import DevAuthHelper from "./components/DevAuthHelper";
import MockLogin from "./components/MockLogin";
import AuthRedirectHandler from "./components/AuthRedirectHandler";

function App() {
  const { checkAuthState } = useAuth();

  useEffect(() => {
    // Check authentication state on app load
    checkAuthState();
  }, [checkAuthState]);

  const { currentUser } = useAuth();
  
  return (
    <div className="app-container">
      {/* Handle Firebase Auth Redirects */}
      <AuthRedirectHandler />
      
      {/* Show MockLogin when not logged in */}
      {!currentUser && <MockLogin />}
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/firebase-test" component={FirebaseTest} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
