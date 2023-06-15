import React from 'react';
import { HStack, VStack } from '@chakra-ui/react';

import styles from './aboutus.module.css';

const AboutUs = () => {
    return (
        <>
            <div className={styles.content}>
                <VStack spacing={80} align="stretch">
                    <h2 className={styles.centerTitle}>
                        About <span className={styles.highlightedText}>Fokus</span>In
                    </h2>
                    <HStack spacing="30px">
                        <p className={styles.leftBody}>
                            At FokusIn, we are passionate about revolutionizing online learning. With the increasing
                            demand for e-learning, learners face significant challenges in maintaining focus and engagement.
                            Distractions abound in the digital world, making it difficult for learners to stay on track.
                            To tackle this challenge, we have developed a cutting-edge solution leveraging facial recognition
                            technology. Our mission is to provide valuable insights into e-learning by measuring learners’ focus,
                            creating comprehensive reports and personalized feedback to enhance their
                            learning outcomes.
                        </p>
                        <p className={styles.leftBody}>
                            At FokusIn, we’re dedicated to providing learners with the tools they need to succeed in their
                            educational and professional journeys. Our innovative approach helps learners overcome distractions
                            and gain a deeper understanding of their own learning patterns. By joining us in reshaping the online
                            learning landscape, you can unlock your full potential with FokusIn. Together, we can create a more
                            focused, engaging, and impactful e-learning experience for all. Don’t let distractions hold you back
                            - take control of your learning with FokusIn.
                        </p>
                    </HStack>
                    <h2 className={styles.centerTagline}>
                        So, are you ready to study with FokusIn?
                    </h2>
                </VStack>
            </div >
        </>
    );
};

export default AboutUs;
