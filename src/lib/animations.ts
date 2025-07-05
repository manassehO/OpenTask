export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.5,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

export const zoomInUpVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.0,
      ease: 'easeOut',
    },
  },
};

export const imageVariants = {
  hidden: { opacity: 0, x: 200 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
    },
  },
};
