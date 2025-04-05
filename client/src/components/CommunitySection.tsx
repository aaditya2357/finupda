import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DiscussionPost } from '../types';

const CommunitySection = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  
  // Form state for new discussion
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: ''
  });
  
  // Sample discussion posts
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([
    {
      id: '1',
      userId: 'user1',
      author: {
        displayName: 'Rahul Kumar',
        initials: 'RK'
      },
      title: 'Best mutual funds for beginners in 2024?',
      content: 'Looking for recommendations on index funds or large cap mutual funds for someone just starting out with SIPs...',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      replyCount: 23,
      viewCount: 128,
      status: 'active',
      featuredReply: {
        userId: 'user2',
        author: {
          displayName: 'Vikram Patel',
          initials: 'VP'
        },
        content: 'For beginners, I\'d recommend UTI Nifty Index Fund or Mirae Asset Large Cap. Low expense ratio and good track record...',
        isExpert: false
      }
    },
    {
      id: '2',
      userId: 'user3',
      author: {
        displayName: 'Anita Patel',
        initials: 'AP'
      },
      title: 'Is crypto investing worth it in 2024?',
      content: 'With all the volatility in crypto markets, is it still advisable to allocate a small percentage of portfolio to Bitcoin or Ethereum?',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      replyCount: 42,
      viewCount: 356,
      status: 'expert_replied',
      featuredReply: {
        userId: 'expert1',
        author: {
          displayName: 'Financial Expert',
          initials: 'FE'
        },
        content: 'Crypto should be viewed as a high-risk investment. Never allocate more than 5% of your portfolio, and only invest money you can afford to lose...',
        isExpert: true
      }
    },
    {
      id: '3',
      userId: 'user4',
      author: {
        displayName: 'Mohan Singh',
        initials: 'MS'
      },
      title: 'Best tax-saving instruments for FY 2024-25?',
      content: 'Looking to maximize tax savings this year. Should I go with ELSS, PPF, or NPS? What\'s the optimal strategy?',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      replyCount: 12,
      viewCount: 94,
      status: 'new',
      featuredReply: {
        userId: 'user5',
        author: {
          displayName: 'Sanjay Kumar',
          initials: 'SK'
        },
        content: 'For tax savings, a mix is ideal. ELSS for equity exposure with 3yr lock-in, PPF for safe returns, and NPS for retirement with additional tax benefits...',
        isExpert: false
      }
    }
  ]);
  
  // Handle form input change
  const handleInputChange = (field: string, value: string) => {
    setNewDiscussion({
      ...newDiscussion,
      [field]: value
    });
  };
  
  // Handle new discussion submission
  const handleSubmitDiscussion = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to start a discussion",
        variant: "destructive"
      });
      setIsNewDiscussionOpen(false);
      return;
    }
    
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your discussion",
        variant: "destructive"
      });
      return;
    }
    
    // Create new discussion post
    const newPost: DiscussionPost = {
      id: Date.now().toString(),
      userId: currentUser.uid,
      author: {
        displayName: currentUser.displayName || 'Anonymous',
        initials: currentUser.displayName ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : 'A'
      },
      title: newDiscussion.title,
      content: newDiscussion.content,
      createdAt: new Date(),
      replyCount: 0,
      viewCount: 0,
      status: 'new'
    };
    
    // Add to discussion posts
    setDiscussionPosts([newPost, ...discussionPosts]);
    
    // Reset form and close dialog
    setNewDiscussion({ title: '', content: '' });
    setIsNewDiscussionOpen(false);
    
    toast({
      title: "Discussion Posted",
      description: "Your discussion has been successfully posted"
    });
  };
  
  // Handle clicking "Start New Discussion" button
  const handleStartNewDiscussion = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to start a discussion",
        variant: "destructive"
      });
      return;
    }
    
    setIsNewDiscussionOpen(true);
  };
  
  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</div>;
      case 'expert_replied':
        return <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Expert Replied</div>;
      case 'new':
        return <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">New</div>;
      case 'resolved':
        return <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Resolved</div>;
      default:
        return <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Open</div>;
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-IN');
    }
  };

  return (
    <section id="community" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-primary flex items-center gap-3 section-title">
          <i className="fas fa-users"></i>
          Community Discussions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {discussionPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all discussion-card">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${post.id === '1' ? 'bg-blue-100' : post.id === '2' ? 'bg-purple-100' : 'bg-green-100'} flex items-center justify-center`}>
                      <span className={`font-medium ${post.id === '1' ? 'text-blue-600' : post.id === '2' ? 'text-purple-600' : 'text-green-600'}`}>{post.author.initials}</span>
                    </div>
                    <div>
                      <div className="font-medium">{post.author.displayName}</div>
                      <div className="text-xs text-text-light">Posted {formatDate(post.createdAt)}</div>
                    </div>
                  </div>
                  {getStatusBadge(post.status)}
                </div>
                
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-text-light text-sm mb-4">{post.content}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-comment text-text-light"></i>
                    <span>{post.replyCount} replies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-eye text-text-light"></i>
                    <span>{post.viewCount} views</span>
                  </div>
                </div>
                
                {post.featuredReply && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium mb-2">
                      {post.featuredReply.isExpert ? 'Expert Reply' : 'Featured Reply'}
                    </div>
                    <div className="flex gap-2">
                      <div className={`w-8 h-8 rounded-full ${post.featuredReply.isExpert ? 'bg-yellow-100' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                        {post.featuredReply.isExpert ? (
                          <i className="fas fa-medal text-yellow-600 text-xs"></i>
                        ) : (
                          <span className="text-xs font-medium text-gray-600">{post.featuredReply.author.initials}</span>
                        )}
                      </div>
                      <div className="text-sm text-text-light bg-gray-50 p-2 rounded-lg">
                        {post.featuredReply.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-light transition-all"
            onClick={handleStartNewDiscussion}
          >
            <i className="fas fa-plus"></i>
            Start New Discussion
          </Button>
        </div>
      </div>
      
      {/* New Discussion Dialog */}
      <Dialog open={isNewDiscussionOpen} onOpenChange={setIsNewDiscussionOpen}>
        <DialogContent className="community-modal">
          <DialogHeader>
            <DialogTitle>Start a New Discussion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium block mb-1">Discussion Title</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What's your question or topic?"
                value={newDiscussion.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Discussion Content</label>
              <Textarea
                className="min-h-[150px]"
                placeholder="Provide details about your question or discussion topic..."
                value={newDiscussion.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline"
                onClick={() => setIsNewDiscussionOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={handleSubmitDiscussion}
              >
                Post Discussion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CommunitySection;
