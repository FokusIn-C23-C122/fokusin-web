import React from 'react';
import { VStack, Divider } from '@chakra-ui/react';

import styles from "./usermanual.module.css"

const UserManual = () => {
    return (
        <>
            <div
                className={styles.content}
            >
                <VStack spacing={80} align="stretch">
                    <Divider height="1px" bg="#C1BBAE" />
                    <h2 className={styles.centerTitle}>
                        User Manual
                    </h2>
                    <p className={styles.centerBody}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.
                        Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                        Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
                        per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
                        Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia.
                        Aliquam in elementum tellus. Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi.
                        Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna.
                        Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia.
                        Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.
                    </p>

                </VStack>
            </div >
            <footer className={styles.footer}>
                <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="https://fokusin.com/" className="flex items-center mb-4 sm:mb-0">
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
