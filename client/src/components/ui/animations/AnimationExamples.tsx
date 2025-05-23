import React from 'react';

import { AnimationWrapper, FadeSlideUp, ScalePop, fadeInLeft, staggerContainer } from './index';

// This file shows examples of how to use the animation components
// It's not meant to be imported, just for reference

const AnimationExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      {/* FadeSlideUp Example */}
      <FadeSlideUp delay={0.2} duration={0.6}>
        <div className="p-4 bg-primary-100 rounded-lg">
          <h3 className="text-lg font-semibold">FadeSlideUp Animation</h3>
          <p>This content fades in while sliding up</p>
        </div>
      </FadeSlideUp>

      {/* ScalePop Example */}
      <ScalePop delay={0.4}>
        <button className="px-6 py-3 bg-secondary-500 text-white rounded-lg font-medium">
          ScalePop Button
        </button>
      </ScalePop>

      {/* AnimationWrapper with custom variants */}
      <AnimationWrapper variants={fadeInLeft} transition={{ duration: 0.8 }}>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Custom Animation</h3>
          <p>This uses AnimationWrapper with fadeInLeft variant</p>
        </div>
      </AnimationWrapper>

      {/* Stagger animation for lists */}
      <AnimationWrapper variants={staggerContainer}>
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <AnimationWrapper key={item} variants={fadeInLeft}>
              <div className="p-3 bg-primary-50 rounded">List Item {item}</div>
            </AnimationWrapper>
          ))}
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default AnimationExamples;