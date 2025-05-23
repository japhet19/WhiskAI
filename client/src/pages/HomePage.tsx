import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Clock, DollarSign } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CurieAvatar } from '../components/common';
import { useTypingAnimation } from '../hooks/useTypingAnimation';

const TYPING_MESSAGES = [
  "What's for dinner tonight?",
  "Let me help you plan your meals",
  "Cooking made simple and fun",
  "Your AI-powered kitchen companion"
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { displayedText, isTyping } = useTypingAnimation({
    messages: TYPING_MESSAGES,
    typingSpeed: 50,
    pauseDuration: 2000,
    loop: true
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/assets/whiskai2.png" alt="WhiskAI" className="h-24 w-auto group-hover:scale-110 transition-transform duration-300" style={{ minHeight: '96px', maxWidth: '280px' }} />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                How it Works
              </a>
              <button
                onClick={() => navigate('/chat')}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Try Curie Free
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Gradient Background */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-orange-50">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 -left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-16 pb-12">
            {/* Curie with Speech Bubble */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center mb-12"
            >
              <div className="relative">
                <CurieAvatar size="xl" className="shadow-2xl ring-4 ring-white ring-opacity-50" showPulse />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayedText}
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-3 min-w-[280px]"
                  >
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
                    <p className="text-gray-800 font-medium text-lg">
                      {displayedText}
                      {isTyping && <span className="animate-pulse text-teal-600 ml-1">|</span>}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              Meal Planning
              <span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent"> Made Simple</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Let Curie, your AI chef, create personalized meal plans that fit your taste, 
              time, and budget. Start cooking smarter today!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/onboarding"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-teal-500/25 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                Get Started Free
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-full border-2 border-teal-200 hover:border-teal-600 hover:bg-teal-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Chat with Curie
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Everything You Need for 
              <span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent"> Meal Success</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              From recipe discovery to grocery shopping, we've got you covered
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Recommendations',
                description: 'Curie learns your preferences and suggests recipes you\'ll love',
                color: 'from-teal-400 to-teal-600'
              },
              {
                icon: '⏱️',
                title: 'Time-Saving Planning',
                description: 'Create a week\'s worth of meals in minutes, not hours',
                color: 'from-orange-400 to-orange-600'
              },
              {
                icon: '💰',
                title: 'Budget-Friendly Options',
                description: 'Stay within budget with smart ingredient suggestions',
                color: 'from-green-400 to-green-600'
              },
              {
                icon: '🛒',
                title: 'Smart Shopping Lists',
                description: 'Organized grocery lists that save you time and money',
                color: 'from-purple-400 to-purple-600'
              },
              {
                icon: '🥗',
                title: 'Dietary Flexibility',
                description: 'Supports all diets: vegan, keto, gluten-free, and more',
                color: 'from-yellow-400 to-yellow-600'
              },
              {
                icon: '📱',
                title: 'Cook Mode',
                description: 'Step-by-step guidance while you cook',
                color: 'from-pink-400 to-pink-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl filter drop-shadow-md">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              How <span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">WhiskAI</span> Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Three simple steps to transform your meal planning
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Tell Curie Your Preferences',
                description: 'Share your dietary needs, cooking time, and budget',
                icon: <CurieAvatar size="sm" animated={false} />
              },
              {
                step: '2',
                title: 'Get Personalized Recipes',
                description: 'Curie creates a custom meal plan just for you',
                icon: <Clock className="w-12 h-12 text-teal-600" />
              },
              {
                step: '3',
                title: 'Shop & Cook with Confidence',
                description: 'Use your shopping list and cook with step-by-step guidance',
                icon: <DollarSign className="w-12 h-12 text-teal-600" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-teal-600 to-teal-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Loved by <span className="bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">10,000+</span> Home Cooks
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              See how WhiskAI is transforming kitchens around the world
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Busy Mom of 3",
                avatar: "👩‍🦱",
                quote: "WhiskAI saved my weeknight dinners! I went from stressed to excited about cooking. Curie's suggestions are always perfect for my family.",
                rating: 5
              },
              {
                name: "Mike Rodriguez",
                role: "College Student",
                avatar: "👨‍🎓",
                quote: "Finally, healthy meals on a budget! The grocery lists keep me organized and I've discovered amazing recipes I never would have tried.",
                rating: 5
              },
              {
                name: "Emma Thompson",
                role: "Food Blogger",
                avatar: "👩‍🍳",
                quote: "As someone who cooks professionally, I'm impressed by Curie's creativity. It's like having a sous chef who knows exactly what I need.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                  {/* Quote decoration */}
                  <div className="absolute top-4 right-4 text-6xl text-teal-100 font-serif">"</div>
                  
                  {/* Rating stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: index * 0.2 + i * 0.1 }}
                        className="text-yellow-400 text-xl"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                    {testimonial.quote}
                  </blockquote>
                  
                  <div className="flex items-center">
                    <div className="text-4xl mr-4 bg-gradient-to-br from-teal-100 to-orange-100 rounded-full w-16 h-16 flex items-center justify-center">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-teal-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <span className="font-medium">Privacy Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span className="font-medium">Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌟</span>
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🆓</span>
                <span className="font-medium">Free to Start</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-teal-600 via-teal-700 to-orange-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6"
          >
            <span className="text-white font-semibold">🎉 Over 10,000 meals planned this week!</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Your Kitchen Revolution
            <br />
            <span className="bg-gradient-to-r from-orange-200 to-yellow-200 bg-clip-text text-transparent">Starts Today</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Stop stressing about "what's for dinner?" Join 10,000+ home cooks who've transformed their kitchens with AI-powered meal planning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <div className="flex items-center space-x-2 text-white/80">
              <span className="text-green-300">✓</span>
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <span className="text-green-300">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <span className="text-green-300">✓</span>
              <span>Setup in 60 seconds</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/onboarding"
              className="inline-flex items-center px-10 py-5 bg-white text-teal-700 font-bold text-lg rounded-full hover:bg-gray-50 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-2xl group"
            >
              <Sparkles className="mr-2 h-6 w-6 text-orange-500 animate-pulse" />
              Start Your Free Trial
              <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src="/assets/whiskai.png" alt="WhiskAI" className="h-8 w-8" />
              <span className="font-semibold text-lg">WhiskAI</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              © 2025 WhiskAI. AI-powered meal planning made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;