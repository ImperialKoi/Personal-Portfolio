// Candit - Smart E-commerce Platform
// Amazon-like shopping experience with AI recommendations and secure payments

export const projectInfo = {
  name: "Candit",
  websiteUrl: "https://candit-demo.vercel.app",
  githubUrl: "https://github.com/danielxu/candit",
  summary: `A next-generation e-commerce platform that revolutionizes online shopping through intelligent recommendations and seamless user experience.

Key Features:
• AI-powered product recommendations using TensorFlow
• Secure payment processing with Stripe integration
• Real-time inventory management and stock tracking
• Advanced user authentication with JWT tokens
• Intelligent search with filters and sorting options
• Shopping cart persistence and wishlist functionality
• Comprehensive order tracking and purchase history
• Admin dashboard with analytics and product management
• Responsive design optimized for all devices
• Real-time notifications for order updates

Technical Highlights:
• Machine learning algorithms for personalized recommendations
• Microservices architecture for scalability
• Redis caching for improved performance
• PostgreSQL database with optimized queries
• RESTful API design with comprehensive documentation`,
  technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "TensorFlow", "Stripe", "JWT", "Redis", "Docker", "AWS"],
  description: "A comprehensive e-commerce solution that combines modern web technologies with artificial intelligence to deliver personalized shopping experiences. Built with scalability and performance in mind, featuring advanced machine learning for product recommendations and a robust backend infrastructure."
};

const Candit = {
  name: "Candit - E-commerce Platform",
  description: "A comprehensive Amazon-like shopping platform with full authentication, payment processing, and extensive product catalog",
  
  features: [
    "🛍️ Comprehensive product catalog with categories",
    "🔐 User authentication & secure profiles",
    "💳 Stripe payment integration",
    "🛒 Advanced shopping cart with wishlist",
    "📦 Order tracking & history",
    "⭐ Product reviews & ratings system",
    "🔍 Advanced search & filtering",
    "📱 Fully responsive design",
    "👥 Admin dashboard for product management",
    "📧 Email notifications for orders"
  ],
  
  techStack: {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
    backend: ["Node.js", "Express", "PostgreSQL", "Supabase"],
    payment: ["Stripe API", "Webhook handling"],
    auth: ["Supabase Auth", "JWT tokens"],
    deployment: ["Vercel", "Supabase hosting"]
  },
  
  highlights: {
    scale: "Handles 50,000+ products across multiple categories",
    performance: "Sub-100ms search response times",
    security: "PCI DSS compliant payment processing",
    users: "Supports unlimited concurrent shoppers"
  },
  
  // Core e-commerce functionality
  productSearch: (query, filters) => {
    return {
      type: 'SEARCH_PRODUCTS',
      payload: { query, filters, timestamp: Date.now() }
    };
  },
  
  processOrder: async (orderData) => {
    try {
      const order = await createOrder(orderData);
      await processPayment(order.paymentIntent);
      await updateInventory(order.items);
      return order;
    } catch (error) {
      console.error('Order processing failed:', error);
      throw error;
    }
  }
};

export default Candit;
