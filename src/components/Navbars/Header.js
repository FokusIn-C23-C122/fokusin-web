import React, { useContext, useState, useEffect } from "react";
import {
    Navbar,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from "@material-tailwind/react";
import {
    ChevronDownIcon,
    PowerIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png'
import styles from "./header.module.css";
import AuthContext from "../../Pages/AuthContext";
import Logout from "../../Pages/Logout";


function ProfileMenu({ isLoggedIn, handleLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);
    const { userName } = useContext(AuthContext); 

    useEffect(() => {
        localStorage.setItem("userName", userName);
    }, [userName]);

    const profileMenuItems = [
        {
            label: `Signed in as ${localStorage.getItem("userName")}`,
            icon: UserIcon,
        },
        {
            label: "Log Out",
            icon: PowerIcon,
        },
    ];

    const profile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
        </svg>`;
    const profileIcon = `data:image/svg+xml;base64,${btoa(profile)}`;


    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                >
                    <Avatar
                        variant="circular"
                        size="sm"
                        alt="candice wu"
                        className="border border-brown-500 p-0.5"
                        src={profileIcon}
                    />
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                {profileMenuItems.map(({ label, icon, href }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                        <MenuItem
                            key={label}
                            onClick={isLastItem ? handleLogout : closeMenu}
                            className={`flex items-center gap-2 rounded ${isLastItem ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10" : ""
                                }`}
                        >
                            {React.createElement(icon, {
                                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                color={isLastItem ? "red" : "inherit"}
                            >
                                {label}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}

export default function Header() {
    const [openNav, setOpenNav] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { userName, setUserName } = useContext(AuthContext); // Fix: Remove const before setUserName
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 960) {
                setOpenNav(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, [setUserName]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/logout");
    };

    const navList = (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography as="li">
                <Link to="/recording" className={`${styles.menu} ${!isLoggedIn ? "pointer-events-none opacity-50" : ""
                    }`}>
                    Record
                </Link>
            </Typography>
            <Typography as="li">
                <Link to="/analysis" className={`${styles.menu} ${!isLoggedIn ? "pointer-events-none opacity-50" : ""
                    }`}>
                    Statistics
                </Link>
            </Typography>
            <Typography as="li">
                <Link to="/history" className={`${styles.menu} ${!isLoggedIn ? "pointer-events-none opacity-50" : ""
                    }`}>
                    History
                </Link>
            </Typography>
            <Typography as="li">
                <a href="/#aboutus" className={styles.menu}>
                    About Us
                </a>
            </Typography>
        </ul>
    );

    return (
        <>
            <Navbar
                className={`${styles.navbar} sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4`}
                style={{ backgroundColor: "#FFFBFF" }}
            >
                <div className="flex items-center justify-between">
                    <Link to="/" className={styles.logo}>
                        <img src={logo} alt="Logo" className="mr-4 cursor-pointer" style={{ width: "4em" }} />
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="mr-4 hidden lg:block">{navList}</div>
                        {!isLoggedIn ? (
                            <>
                                <Link to="/register" className={styles.button}>
                                    <span>Register</span>
                                </Link>
                            </>
                        ) : (
                            <ProfileMenu
                                setIsLoggedIn={setIsLoggedIn}
                                isLoggedIn={isLoggedIn}
                                handleLogout={handleLogout}
                                userName={userName}
                            />
                        )}
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => setOpenNav(!openNav)}
                            ripple={false}
                            className="lg:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                {openNav ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )}
                            </svg>
                        </Button>
                    </div>
                </div>
                {openNav && <div className="lg:hidden">{navList}</div>}
            </Navbar>
            {!isLoggedIn && <Logout />}
        </>
    );
}
