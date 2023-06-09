import React, { useContext } from 'react';
import { HStack, VStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import styles from './home.module.css';
import AboutUs from './AboutUs';
import UserManual from './UserManual';
import AuthContext from './AuthContext';

const Home = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <>
            <Layout />
            <div className={styles.color}>
                <div className={styles.content}>
                    <HStack spacing="100px">
                        <section>
                            <h2 className={styles.leftTitle}>
                                Welcome <span className={styles.space}></span> to <span className={styles.highlightedText}>Fokus</span>In!
                            </h2>
                            <p className={styles.leftBody}>
                                FokusIn is an innovative application designed to optimize your online learning experience.
                                By utilizing facial expression recognition, we accurately measure and analyze your focus levels
                                during lessons. Our technology provides real-time insights, allowing you to understand your
                                engagement and make necessary adjustments. Whether you're a student, educator, or professional,
                                FokusIn helps you unlock your full learning potential in the digital age. Maximize your focus,
                                enhance your performance, and achieve your goals with FokusIn! 🔎
                            </p>
                        </section>
                        <VStack spacing={40} align="stretch">
                            <Button className={styles.button} disabled={!isLoggedIn}>
                                <Link to="/recording">
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
                </div >
                <div id="aboutus">
                    <AboutUs />
                </div>
                <div id="usermanual">
                    <UserManual />
                </div>
            </div>
        </>
    );
};

export default Home;
