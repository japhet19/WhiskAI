import { motion } from 'framer-motion';
import React from 'react';

interface CurieAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  showPulse?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const CurieAvatar: React.FC<CurieAvatarProps> = ({ 
  size = 'md', 
  animated = true,
  className = '',
  showPulse = false
}) => {
  const avatarElement = (
    <img
      src="/assets/Curie.png"
      alt="Curie - Your AI Cooking Assistant"
      className={`${sizeClasses[size]} object-contain rounded-full bg-white ${className}`}
    />
  );

  if (!animated) {
    return avatarElement;
  }

  return (
    <motion.div
      className="relative inline-block"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
    >
      {showPulse && (
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-primary-400 opacity-75`}
          animate={{
            scale: [1, 1.2, 1.2],
            opacity: [0.7, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {avatarElement}
      </motion.div>
    </motion.div>
  );
};

export default CurieAvatar;