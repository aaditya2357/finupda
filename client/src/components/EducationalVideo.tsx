import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface WebinarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  registrationUrl: string;
}

const EducationalVideo = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isWebinarRegisterOpen, setIsWebinarRegisterOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarEvent | null>(null);
  
  // Featured video data
  const featuredVideo = {
    title: '5 Investment Strategies for Young Professionals in India',
    description: 'Learn how to build wealth early with practical investment approaches tailored for young earners.',
    thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=675&q=80',
    views: '24.5K',
    duration: '18:45',
    videoId: 'dQw4w9WgXcQ' // YouTube video ID
  };
  
  // Upcoming webinars data
  const upcomingWebinars: WebinarEvent[] = [
    {
      id: '1',
      title: 'Understanding the New Tax Regime',
      description: 'Learn how to optimize your investments under India\'s new tax structure.',
      date: 'March 28, 2024',
      time: '7:00 PM',
      registrationUrl: '#'
    },
    {
      id: '2',
      title: 'Building Wealth Through Small Caps',
      description: 'Expert strategies for identifying high-potential small cap stocks.',
      date: 'April 5, 2024',
      time: '6:30 PM',
      registrationUrl: '#'
    },
    {
      id: '3',
      title: 'Retirement Planning in Your 30s',
      description: 'Start early and retire comfortably with these smart planning tactics.',
      date: 'April 12, 2024',
      time: '7:30 PM',
      registrationUrl: '#'
    }
  ];
  
  // Handle webinar registration
  const handleRegister = (webinar: WebinarEvent) => {
    setSelectedWebinar(webinar);
    setIsWebinarRegisterOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Featured Video</h3>
          
          <div className="aspect-w-16 aspect-h-9 relative">
            <img 
              src={featuredVideo.thumbnail} 
              alt={featuredVideo.title} 
              className="w-full rounded-lg object-cover" 
            />
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => setIsVideoPlaying(true)}
            >
              <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                <i className="fas fa-play text-primary text-xl"></i>
              </div>
            </div>
          </div>
          
          <h4 className="font-medium mt-4">{featuredVideo.title}</h4>
          <p className="text-sm text-text-light">{featuredVideo.description}</p>
          
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-eye text-text-light"></i>
              <span className="text-sm text-text-light">{featuredVideo.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-clock text-text-light"></i>
              <span className="text-sm text-text-light">{featuredVideo.duration}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Webinars</h3>
          
          <div className="space-y-4">
            {upcomingWebinars.map((webinar, index) => (
              <div key={webinar.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <div className="text-sm text-blue-600 mb-1">{webinar.date} • {webinar.time}</div>
                <h4 className="font-medium">{webinar.title}</h4>
                <p className="text-sm text-text-light mt-1">{webinar.description}</p>
                <Button 
                  variant="default"
                  size="sm"
                  className="mt-2 bg-primary text-white text-sm px-3 py-1 rounded hover:bg-primary-light transition-colors"
                  onClick={() => handleRegister(webinar)}
                >
                  Register
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Video Player Dialog */}
      <Dialog open={isVideoPlaying} onOpenChange={setIsVideoPlaying}>
        <DialogContent className="max-w-4xl p-0 border-none bg-black">
          <div className="relative pt-[56.25%]">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${featuredVideo.videoId}?autoplay=1`}
              title={featuredVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Webinar Registration Dialog */}
      <Dialog open={isWebinarRegisterOpen} onOpenChange={setIsWebinarRegisterOpen}>
        <DialogContent className="max-w-md">
          <h2 className="text-xl font-bold mb-4">Register for Webinar</h2>
          
          {selectedWebinar && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg">{selectedWebinar.title}</h3>
              <p className="text-sm text-blue-600 mb-2">{selectedWebinar.date} • {selectedWebinar.time}</p>
              <p className="text-sm text-gray-600">{selectedWebinar.description}</p>
            </div>
          )}
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input 
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input 
                type="tel"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+91 98765 43210"
                required
              />
            </div>
            
            <div className="pt-2 flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => setIsWebinarRegisterOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                type="submit"
              >
                Register Now
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationalVideo;
