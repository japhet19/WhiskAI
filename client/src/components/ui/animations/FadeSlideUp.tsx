import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface FadeSlideUpProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const FadeSlideUp: React.FC<FadeSlideUpProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  distance = 20,
  once = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // Tailwind's ease-in-out
      }}
      viewport={{ once }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeSlideUp;