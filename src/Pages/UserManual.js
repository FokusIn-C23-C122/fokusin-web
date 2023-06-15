import React from 'react';
import { VStack, Divider } from '@chakra-ui/react';

import styles from "./usermanual.module.css"

const UserManual = () => {
    return (
        <>
            <div className={styles.content}>
                <VStack spacing={50} align="stretch">
                    <Divider height="1px" bg="#C1BBAE" />
                    <h2 className={styles.centerTitle}>
                        User Manual
                    </h2>
                    <p className={styles.centerBody}>
                        Tracking your focus and performance during online learning sessions has never been easier with FokusIn. Our user-friendly interface ensures a seamless experience from start to finish. Here's how you can make the most of our innovative platform:
                    </p>
                    <ol type='1' className={styles.guide}>
                        <li>
                            1. Click on "Recording": Begin by selecting the "Recording" option on our website. This will initiate the process of tracking your focus and engagement during your learning session.
                        </li>
                        <li>
                            2. Grant camera access: To accurately measure your level of focus, we require access to your camera. Rest assured that your privacy is our utmost priority, and the camera access is solely used for facial expression recognition.
                        </li>
                        <li>
                            3. Start your session: Once you have granted camera access, you're ready to start your online learning session. Dive into your educational materials, lectures, or training courses as you normally would.
                        </li>
                        <li>
                            4. End Session: When you're finished with your learning session, simply click on the "End Session" button. This will conclude the tracking process and allow us to analyze your performance.
                        </li>
                        <li>
                            5. Performance insights: After ending your session, you will gain access to a comprehensive overview of your performance. Additionally, by clicking on "Statistics," you can view your learning statistics day by day. Our intelligent system utilizes facial expression recognition to accurately measure your focus levels, providing valuable data to optimize your learning outcomes.
                        </li>
                    </ol>
                    <p className={styles.centerBody}>
                        With FokusIn, you are in control of your learning journey. Gain valuable insights into your focus and engagement, and unlock your full potential in the world of online learning. Start using FokusIn today and experience a new level of interactive and impactful e-learning.
                    </p>

                </VStack>
            </div >
            <footer className={styles.footer}>
                <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0">
                            <span className={`${styles.logo} self-center text-2xl font-semibold whitespace-nowrap`}>FokusIn</span>
                        </a>
                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
                            <li>
                                <a href="/" className={`${styles.contact} mr-4 hover:underline md:mr-6 `}>Contact</a>
                            </li>
                        </ul>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className={`${styles.copyright} block text-sm sm:text-center`}>© 2023 <a href="/" className="hover:underline">FokusIn</a>. All Rights Reserved.</span>
                </div>
            </footer>

        </>
    );
};

export default UserManual;
