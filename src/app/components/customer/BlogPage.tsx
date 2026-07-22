import { Calendar, User, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const blogPosts = [
  {
    id: 1,
    title: '10 Hidden Gems in Southeast Asia You Must Visit',
    excerpt: 'Discover lesser-known destinations that will take your breath away and provide authentic cultural experiences.',
    author: 'Travel Team',
    date: '2026-05-20',
    category: 'Destinations',
    image: 'https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjB2YWNhdGlvbnxlbnwxfHx8fDE3Nzk1MzM5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'Ultimate Guide to Planning Your African Safari',
    excerpt: 'Everything you need to know before booking your dream safari adventure, from best seasons to wildlife hotspots.',
    author: 'Wildlife Expert',
    date: '2026-05-18',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1595368062405-e4d7840cba14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGFkdmVudHVyZSUyMGhpa2luZ3xlbnwxfHx8fDE3NzkzODAyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: '10 min read',
  },
  {
    id: 3,
    title: 'European Summer 2026: Top Destinations & Travel Tips',
    excerpt: 'Make the most of your European summer vacation with these insider tips on destinations, timing, and budgeting.',
    author: 'Europe Specialist',
    date: '2026-05-15',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxlaWZmZWwlMjB0b3dlciUyMHBhcmlzJTIwdHJhdmVsfGVufDF8fHx8MTc3OTUzMzkxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: '7 min read',
  },
  {
    id: 4,
    title: 'Packing Smart: Essential Items for Beach Vacations',
    excerpt: 'Our comprehensive packing list ensures you have everything you need for the perfect tropical getaway.',
    author: 'Travel Team',
    date: '2026-05-12',
    category: 'Packing Guides',
    image: 'https://images.unsplash.com/photo-1603477849227-705c424d1d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjB2YWNhdGlvbnxlbnwxfHx8fDE3Nzk1MzM5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: '5 min read',
  },
  {
    id: 5,
    title: 'Cultural Etiquette: Traveling Respectfully in Asia',
    excerpt: 'Learn about cultural customs and etiquette to ensure respectful and meaningful interactions during your Asian travels.',
    author: 'Cultural Expert',
    date: '2026-05-08',
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1551322120-c697cf88fbdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx0b2t5byUyMGphcGFuJTIwc2t5bGluZXxlbnwxfHx8fDE3Nzk1MzM5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Budget Travel: How to See the World Without Breaking the Bank',
    excerpt: 'Practical tips and strategies for traveling on a budget while still enjoying amazing experiences.',
    author: 'Budget Travel Expert',
    date: '2026-05-05',
    category: 'Travel Tips',
    image: 'https://images.unsplash.com/photo-1586500036065-bdaeac7a4feb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjB2YWNhdGlvbnxlbnwxfHx8fDE3Nzk1MzM5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: '9 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-6">Travel Blog & News</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert travel tips, destination guides, packing advice, and the latest travel news
          </p>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-96 md:h-auto overflow-hidden">
              <ImageWithFallback
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm">
                Featured
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-chart-1/10 text-chart-1 rounded-full text-sm mb-4 w-fit">
                {blogPosts[0].category}
              </div>
              <h2 className="text-3xl mb-4">{blogPosts[0].title}</h2>
              <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{blogPosts[0].author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{blogPosts[0].date}</span>
                </div>
                <span>{blogPosts[0].readTime}</span>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity w-fit">
                <span>Read Article</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <div
              key={post.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-chart-2/10 text-chart-2 rounded-full text-xs mb-3">
                  {post.category}
                </div>
                <h3 className="mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-primary text-primary-foreground py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">Never Miss a Travel Tip</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Subscribe to our newsletter and get the latest travel guides, tips, and exclusive deals delivered to your inbox.
          </p>
          <a
            href="/#footer"
            className="inline-block px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Subscribe Now
          </a>
        </div>
      </div>
    </div>
  );
}
