import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function GuestSignIn() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    document.title = "Spawn - Guest Sign-In";
  }, []);

  const handleContinue = async (e) => {
    e.preventDefault();
    // Form validation
    if (!name.trim() || !email.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      // In a real app, you would send a request to the server
      console.log("Guest sign-in with:", { name, email, inviteId });
      
      // Mock successful sign-in
      // Redirect to the onboarding page after successful sign-in
      // This would be replaced with actual logic in a real app
      navigate('/onboarding'); // Redirect to onboarding
    } catch (error) {
      console.error('Error signing in:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Gradient background style
  const bgGradient = {
    background: `radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)`,
    minHeight: '100vh',
  };

  return (
    <div style={bgGradient} className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg overflow-hidden mx-auto">
        {/* Back button */}
        <div className="p-6 pb-2">
          <Link to={`/invite/${inviteId}`} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
        
        {/* Logo */}
        <div className="px-6 pt-2 text-center">
          <div className="text-spawn-purple text-3xl font-bold relative inline-block">
            spawn
            <span className="absolute text-spawn-purple text-2xl" style={{ right: "-12px", top: "-5px" }}>⭐</span>
          </div>
        </div>
        
        {/* Form */}
        <div className="px-6 pt-6 pb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Guest Sign-In</h1>
          <p className="text-center text-gray-700 mb-8">
            Confirm your name and email to join the plan.
          </p>
          
          <form onSubmit={handleContinue}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="What is your name?"
                className="w-full bg-gray-100 border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-8">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="What is your email?"
                className="w-full bg-gray-100 border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-spawn-purple hover:bg-spawn-purple/90 text-white rounded-full py-6 mb-8"
            >
              Continue
            </Button>
          </form>
          
          <div className="text-center text-sm">
            <p>
              Have an account already?{" "}
              <Link to="/login" className="text-spawn-purple font-medium">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestSignIn; 