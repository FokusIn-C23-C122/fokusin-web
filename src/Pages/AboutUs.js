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
                    <HStack spacing="30px" justify="center">
                        <p className={styles.leftBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                            Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.
                            Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
                        </p>
                        <p className={styles.leftBody}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                            Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.
                            Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
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
