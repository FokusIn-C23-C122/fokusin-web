import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/Api';
import Layout from '../components/Layout';

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
                startRecording();
            }
        } catch (error) {
            console.error('Error requesting camera permission:', error);
        }
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
                },
                body: JSON.stringify({
                    start: true,
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

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            navigate('/statistic');
        }
    };

    const handleLearnTodayChange = (event) => {
        setLearnToday(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${API_URL}/api/analysis/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: learnToday,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setId(data.id);
                console.log('Description submitted successfully!');
            } else {
                throw new Error('Request failed with status code ' + response.status);
            }
        } catch (error) {
            console.error('Error submitting description:', error);
        }
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

                try {
                    const response = await fetch(`${API_URL}/api/analysis/${id}`, {
                        method: 'PUT',
                        body: imageBlob,
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
                <div>
                    <p>Please allow access to your camera.</p>
                    <button onClick={requestCameraPermission}>Allow</button>
                </div>
            )}

            {!showPermissionPopup && (
                <div>
                    <input type="text" value={learnToday} onChange={handleLearnTodayChange} />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            )}

            {!showPermissionPopup && (
                <div>
                    <button onClick={startRecording}>Start Session</button>
                    <button onClick={stopRecording}>End Session</button>
                </div>
            )}

            {!showPermissionPopup && <video ref={videoRef} autoPlay muted />}
        </>
    );
};

export default Recording;
