import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import React from 'react';

interface AnimationWrapperProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'transition'> {
  children: React.ReactNode;
  variants?: Variants;
  initial?: string | any;
  animate?: string | any;
  exit?: string | any;
  transition?: any;
  once?: boolean;
  className?: string;
}

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  variants,
  initial = 'hidden',
  animate = 'visible',
  exit,
  transition,
  once = true,
  className,
  ...props
}) => {
  // Default variants if none provided
  const defaultVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      variants={variants || defaultVariants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      viewport={{ once }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;