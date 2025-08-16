'use client';
import React from 'react';
import { motion } from 'framer-motion';
import BasicInformation from '../ui/form/createTask/basicInformation';
import FormHeader from './formHeader';

function BasicInformationForm() {
  return (
    <motion.div
      initial={{
        x: '-100vw',
        opacity: 0,
      }}
      animate={{
        x: '0',
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
      className="max-w-2xl space-y-8 rounded bg-white px-6 py-8"
    >
      <FormHeader
        title="basic information"
        subtitle="Enter your information to complete your set up"
      />
      <BasicInformation />
    </motion.div>
  );
}

export default BasicInformationForm;
