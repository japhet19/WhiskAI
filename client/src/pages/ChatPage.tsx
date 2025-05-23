import { motion } from 'framer-motion';
import React from 'react';

import ChatInterface from '../components/chat/ChatInterface';
import { FadeSlideUp } from '../components/ui/animations';

const ChatPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full min-h-[calc(100vh-128px)] bg-gradient-to-br from-primary-50 via-white to-secondary-50"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <FadeSlideUp>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Chat with Curie
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ask me anything about recipes, cooking techniques, or meal planning. 
              I'm here to make your culinary journey delightful!
            </p>
          </div>
        </FadeSlideUp>
        
        <FadeSlideUp delay={0.1}>
          <div className="w-full max-w-6xl mx-auto">
            <ChatInterface />
          </div>
        </FadeSlideUp>
      </div>
    </motion.div>
  );
};

export default ChatPage;