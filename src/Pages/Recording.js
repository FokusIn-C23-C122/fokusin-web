import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/Api';
import Layout from '../components/Layout';
import { getCookie } from '../constants/cookies';
import styles from './recording.module.css'
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button
} from "@material-tailwind/react";


const Recording = () => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [showPermissionPopup, setShowPermissionPopup] = useState(true);
    const [learnToday, setLearnToday] = useState('');
    const navigate = useNavigate();
    const [id, setId] = useState('');

    const requestCameraPermission = async () => {
        try {
            const permissionResult = await navigator.permissions.query({ name: 'camera' });
            if (permissionResult.state === 'denied') {
                alert('Camera access denied. Please enable camera access in your browser settings.');
            } else {
                setShowPermissionPopup(false);
                openCamera();
            }
        } catch (error) {
            console.error('Error requesting camera permission:', error);
        }
    };

    const openCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        videoRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.start();
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            videoRef.current.srcObject = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.start();
            setRecording(true);

            const startAnalysisResponse = await fetch(`${API_URL}/api/analysis/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getCookie("access"),
                },
                body: JSON.stringify({
                    start: 'true',
                    description: learnToday,
                }),
            });

            if (startAnalysisResponse.ok) {
                const data = await startAnalysisResponse.json();
                setId(data.id);
                console.log('Data:', data);
                console.log('Start session request sent successfully!');
            } else {
                throw new Error('Request failed with status code ' + startAnalysisResponse.status);
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    const stopRecording = async () => {
        try {
            const response = await fetch(`${API_URL}/api/analysis/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify({
                    ongoing: 'false',
                }),

            });

            if (response.ok && mediaRecorderRef.current && recording) {
                console.log('Session ended successfully!');
                mediaRecorderRef.current.stop();
                setRecording(false);
                navigate('/statistic');
            } else {
                throw new Error('Request failed with status code ' + response.status);
            }
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    };

    const handleLearnTodayChange = (event) => {
        setLearnToday(event.target.value);
    };

    useEffect(() => {
        let intervalId;

        const sendImageToBackend = async () => {
            if (mediaRecorderRef.current && recording) {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                const formData = new FormData();

                formData.append('file', imageBlob);
                formData.append('ongoing', 'true');

                try {
                    const response = await fetch(`${API_URL}/api/analysis/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    });

                    if (response.ok) {
                        console.log('Image sent successfully!');
                    } else {
                        throw new Error('Request failed with status code ' + response.status);
                    }
                } catch (error) {
                    console.error('Error sending image:', error);
                }
            }
        };

        if (recording) {
            intervalId = setInterval(sendImageToBackend, 5000);
        }

        return () => clearInterval(intervalId);
    }, [recording, id]);

    return (
        <>
            <Layout />
            {showPermissionPopup && (
                <div className={styles.permissionContainer}>
                    <Card className={`${styles.card} mt-6 w-96`}>
                        <CardBody>
                            <Typography variant="h5" color="blue-gray" className="mb-2">
                                Please allow access to your camera
                            </Typography>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button onClick={requestCameraPermission} color='brown'>Allow</Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {!showPermissionPopup && (
                <div className={styles.videoContainer}>
                    <video ref={videoRef} autoPlay muted className={styles.roundedBorder} />
                </div>
            )}

            {!showPermissionPopup && (
                <div className={styles.controlsContainer}>
                    <div className="w-80">
                        <Input
                            color='brown'
                            label="Tell us what you’re going to learn today"
                            value={learnToday}
                            onChange={handleLearnTodayChange}
                        />
                    </div>
                    <div className={styles.buttonsContainer}>
                        <Button color="brown" className={styles.recordButton} onClick={startRecording}>
                            Start Session
                        </Button>
                        <Button color="red" onClick={stopRecording}>
                            End Session
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Recording;