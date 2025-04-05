import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Development-only component that provides helper buttons 
 * for authentication during development
 */
const DevAuthHelper: React.FC = () => {
  const auth = useAuth();
  console.log("DevAuthHelper: Environment mode =", import.meta.env.MODE);
  console.log("DevAuthHelper: Current user =", auth.currentUser);
  console.log("DevAuthHelper: Mock login function =", !!auth.loginWithMockUser);
  
  // Only hide when already logged in
  if (auth.currentUser) {
    console.log("User is already logged in, hiding DevAuthHelper");
    return null;
  }

  return (
    <Card className="mb-4 bg-yellow-50 border-yellow-300 max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-yellow-800">Development Mode</CardTitle>
        <CardDescription className="text-xs text-yellow-700">
          Authentication helpers for development testing
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs text-yellow-700 mb-2">
          Use these options to quickly test the app without configuring Firebase.
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs border-yellow-500 text-yellow-700 hover:bg-yellow-100"
          onClick={() => auth.loginWithMockUser?.()}
        >
          Use Test User
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DevAuthHelper;