document.addEventListener('DOMContentLoaded', function() {

    const videoElement = document.getElementById('cameraVideo');
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const toggleButton = document.getElementById('cameraToggle');
    const toggleLabel = document.getElementById('toggleLabel');
    const switchButton = document.getElementById('switchCameraBtn');
    const permissionError = document.getElementById('permissionError');
    const counterElement = document.getElementById('counter');

    let cameraEnabled = false;
    let facingMode = 'user';
    let currentStream = null;
    let pose;
    let lastProcessTime = 0;
    let squatting = false;
    let squatCount = 0;
    const SQUAT_THRESHOLD = 0.3; 
    const HIP_KEYPOINT_INDEX = 23; 
    const KNEE_KEYPOINT_INDEX = 25; 

    async function initializePose() {
        pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
        });

        pose.setOptions({
            modelComplexity: 0,
            smoothLandmarks: true,
            enableSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onPoseResults);
    }

    function onPoseResults(results) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
                color: '#00FF00', lineWidth: 3
            });
            drawLandmarks(canvasCtx, results.poseLandmarks, {
                color: '#FF0000', lineWidth: 2
            });

            if (results.poseLandmarks[HIP_KEYPOINT_INDEX] && results.poseLandmarks[KNEE_KEYPOINT_INDEX]) {
                const hipY = results.poseLandmarks[HIP_KEYPOINT_INDEX].y;
                const kneeY = results.poseLandmarks[KNEE_KEYPOINT_INDEX].y;

                if (kneeY > hipY + SQUAT_THRESHOLD && !squatting) {
                    squatting = true;
                    squatCount++;
                    counterElement.textContent = `Присідання: ${squatCount}`;
                } else if (kneeY < hipY + SQUAT_THRESHOLD * 0.5 && squatting) {
                    squatting = false;
                }
            }
        }
    }

    async function processFrame() {
        const now = Date.now();
        if (now - lastProcessTime > 50) {
            lastProcessTime = now;
            if (videoElement.readyState >= 2) {
                await pose.send({ image: videoElement });
            }
        }
        if (currentStream) requestAnimationFrame(processFrame);
    }

    function updateToggleLabel() {
        toggleLabel.textContent = cameraEnabled ? 'On' : 'Off';
    }

    async function startCamera() {
        try {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });

            videoElement.srcObject = stream;
            currentStream = stream;

            videoElement.setAttribute('playsinline', 'true');
            try {
                await videoElement.play();
                requestAnimationFrame(processFrame);
            } catch (playError) {
                console.error('Помилка автозапуску:', playError);
            }

            permissionError.style.display = 'none';
        } catch (err) {
            console.error('Помилка доступу до камери:', err);
            permissionError.style.display = 'block';
            toggleButton.checked = false;
            cameraEnabled = false;
            updateToggleLabel();
        }
    }

    function stopCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            currentStream = null;
            videoElement.srcObject = null;
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        }
    }

    toggleButton.addEventListener('change', function() {
        cameraEnabled = this.checked;
        updateToggleLabel();

        if (cameraEnabled) {
            startCamera();
        } else {
            stopCamera();
        }
    });

    switchButton.addEventListener('click', function() {
        facingMode = facingMode === 'user' ? 'environment' : 'user';

        if (cameraEnabled) {
            startCamera();
        }
    });

    initializePose();
});