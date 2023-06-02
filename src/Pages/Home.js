import React from 'react';
import { HStack, VStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import styles from './home.module.css';
import AboutUs from './AboutUs';
import UserManual from './UserManual';

const Home = () => {
    return (
        <>
            <Layout />
            <div
                className={styles.content}
            >
                <HStack spacing="100px">
                    <section>
                        <h2 className={styles.leftTitle}>
                            Welcome <span className={styles.space}></span> to <span className={styles.highlightedText}>Fokus</span>In!
                        </h2>

                        <p className={styles.leftBody}>
                            FokusIn is a dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac
                            aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                            himenaeos.
                        </p>
                        <p className={styles.leftBody}>
                            FokusIn is a dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac
                            aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                            himenaeos.
                        </p>
                    </section>
                    <VStack spacing={40} align="stretch">
                        <Button className={styles.button}>
                            <Link to="/analysis">
                                <h2>Start!</h2>
                            </Link>
                        </Button>
                        <Button className={styles.button}>
                            <a href="/#usermanual">
                                <h2>Read User Manual</h2>
                            </a>
                        </Button>
                    </VStack>
                </HStack>
            </div>
            <div id="aboutus">
                <AboutUs />
            </div>
            <div id="usermanual">
                <UserManual />
            </div>
        </>
    );
};

export default Home;
