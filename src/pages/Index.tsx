// Update this page (the content is just a fallback if you fail to update the page)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '@/lib/storage';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect based on whether profile exists
    const profile = getProfile();
    if (!profile) {
      navigate('/onboarding');
    }
    // If profile exists, Dashboard renders normally via App.tsx route
  }, [navigate]);

  return null;
};

export default Index;
