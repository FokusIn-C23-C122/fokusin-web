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
                    'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg3NTEyMzQ2LCJpYXQiOjE2ODY2NDgzNDYsImp0aSI6Ijk4NjlhYTc4Y2EzYTRlMTc4MWVlMGEyODYzZGVjOThkIiwidXNlcl9pZCI6MX0.IUhnGIemshr4Lpr3-pP7AxXc0LwqY5klSJZCtE1clH0',
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
                    'Content-Type': 'application/json',
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
                <div>
                    <p>Please allow access to your camera.</p>
                    <button onClick={requestCameraPermission}>Allow</button>
                </div>
            )}

            {!showPermissionPopup && (
                <div>
                    <input type="text" value={learnToday} onChange={handleLearnTodayChange} />
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
