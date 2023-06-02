import React from "react";
import {
    Navbar,
    MobileNav,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import styles from './header.module.css'

export default function Header() {
    const [openNav, setOpenNav] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
    }, []);

    const navList = (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
            >
                <a href="#" className={styles.menu}>
                    Record
                </a>
            </Typography>
            <Typography
                as="li"
            >
                <a href="#" className={styles.menu}>
                    Statistics
                </a>
            </Typography>
            <Typography
                as="li"
            >
                <a href="#" className={styles.menu}>
                    History
                </a>
            </Typography>
            <Typography
                as="li"
            >
                <a href="/#aboutus" className={styles.menu}>
                    About Us
                </a>
            </Typography>
        </ul>
    );

    return (
        <>
            <Navbar className={`${styles.navbar} sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4`} style={{ backgroundColor: '#FFFBFF' }}>
                <div className="flex items-center justify-between">
                    <Typography
                        as="a"
                        href="/"
                        className="mr-4 cursor-pointer py-1.5 font-medium"
                        style={{ color: '#8C3913' }}
                    >
                        FokusIn
                    </Typography>
                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{navList}</div>
                        <Link to="#" className={styles.button}>
                            <span>Register</span>
                        </Link>
                        <IconButton
                            variant="text"
                            className="ml-auto h-6 w-6 hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                            ripple={false}
                            onClick={() => setOpenNav(!openNav)}
                        >
                            {openNav ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </IconButton>
                    </div>
                </div>
                <MobileNav open={openNav}>
                    {navList}
                </MobileNav>
            </Navbar>
        </>
    );
}