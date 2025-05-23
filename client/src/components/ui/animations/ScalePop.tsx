import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface ScalePopProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  targetScale?: number;
  once?: boolean;
}

const ScalePop: React.FC<ScalePopProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  initialScale = 0.8,
  targetScale = 1,
  once = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: targetScale }}
      whileHover={{ scale: targetScale * 1.05 }}
      whileTap={{ scale: targetScale * 0.95 }}
      transition={{
        duration,
        delay,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      viewport={{ once }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScalePop;