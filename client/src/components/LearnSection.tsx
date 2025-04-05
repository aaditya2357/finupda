import FinancialTerms from './FinancialTerms';
import EducationalVideo from './EducationalVideo';

const LearnSection = () => {
  // Course data
  const courses = [
    {
      id: '1',
      title: 'Investing Basics for Beginners',
      description: 'Learn the fundamentals of investing, types of investments, and how to start your journey.',
      level: 'beginner',
      lessons: 12,
      rating: 4.5,
      reviewCount: 432,
      imageUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400&q=80'
    },
    {
      id: '2',
      title: 'Mastering Mutual Funds',
      description: 'Dive deep into mutual fund types, selection strategies, and portfolio building.',
      level: 'intermediate',
      lessons: 10,
      rating: 5,
      reviewCount: 287,
      imageUrl: 'https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400&q=80'
    },
    {
      id: '3',
      title: 'Tax-Efficient Investing',
      description: 'Learn strategies to minimize taxes and maximize returns on your investments.',
      level: 'advanced',
      lessons: 8,
      rating: 4.5,
      reviewCount: 156,
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400&q=80'
    }
  ];

  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star text-yellow-500"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-500"></i>);
    }
    
    // Add empty stars to reach 5 total
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-500"></i>);
    }
    
    return stars;
  };

  return (
    <section id="learn" className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-10 text-primary flex items-center gap-3 section-title">
        <i className="fas fa-graduation-cap"></i>
        Learn Financial Literacy
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className={`text-xs px-2 py-1 rounded ${getLevelBadgeColor(course.level)}`}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </div>
                <div className="text-text-light text-sm">{course.lessons} lessons</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-text-light text-sm mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {renderStarRating(course.rating)}
                  <span className="text-xs ml-1">({course.reviewCount})</span>
                </div>
                <button className="text-primary hover:text-primary-light font-medium transition-colors">Start Learning</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <FinancialTerms />
      <EducationalVideo />
    </section>
  );
};

export default LearnSection;
