document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseType = urlParams.get("exerciseType");

  const toggleButton = document.getElementById("cameraToggle");
  const toggleLabel = document.getElementById("toggleLabel");
  const switchButton = document.getElementById("switchCameraBtn");
  const permissionError = document.getElementById("permissionError");
  const requestCameraBtn = document.getElementById("requestCameraBtn");
  const cameraControls = document.getElementById("cameraControls");

  const exerciseNameElement = document.getElementById("exerciseName");
  const exerciseNameBox = document.getElementById("exerciseNameBox");
  const plankTimerElement = document.getElementById("plankTimer");
  const plankTimerBox = document.getElementById("plankTimerBox");

  const videoElement = document.getElementById("cameraVideo");
  const canvasElement = document.getElementById("output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  const bodyDetectionOverlay = document.getElementById("bodyDetectionOverlay");
  const detectionStatus = document.getElementById("detectionStatus");
  const bodyIcon = document.getElementById("bodyIcon");

  const flashOverlay = document.createElement("div");
  flashOverlay.style.position = "absolute";
  flashOverlay.style.top = "0";
  flashOverlay.style.left = "0";
  flashOverlay.style.width = "100%";
  flashOverlay.style.height = "100%";
  flashOverlay.style.backgroundColor = "rgba(115, 4, 233, 0.4)";
  flashOverlay.style.zIndex = "100";
  flashOverlay.style.opacity = "0";
  flashOverlay.style.transition = "opacity 0.1s ease-out";
  flashOverlay.style.pointerEvents = "none";
  document.getElementById("root").appendChild(flashOverlay);

  let isStanding = true;
  let squatCount = 0;
  const SQUAT_THRESHOLD_KNEE = 120;
  const SQUAT_THRESHOLD_HIP = 100;

  let isPushUpStartingPosition = false;
  let pushUpCount = 0;
  const PUSHUP_THRESHOLD_ELBOW_DOWN = 100;
  const PUSHUP_THRESHOLD_ELBOW_UP = 150;
  const PUSHUP_THRESHOLD_BODY_ALIGNMENT = 160;
  let elbowBentDuringPushup = false;

  let isPlankActive = false;
  let plankStartTime = 0;
  let totalPlankTime = 0;
  let currentPlankSessionTime = 0;
  let plankInterval = null;
  const MIN_PLANK_DURATION_FOR_COUNT = 3;

  let cameraEnabled = false;
  let cameraPermissionGranted = false;
  let facingMode = "user";
  let stream = null;
  let camera = null;
  let pose = null;
  let fullBodyDetected = false;
  let detectionTimer = null;
  let exercise = "none";

  cameraControls.style.display = "none";
  permissionError.style.display = "none";

  exerciseNameBox.style.display = "none";
  plankTimerBox.style.display = "none";

  if (exerciseType && exerciseNameElement) {
    const validExercises = ["squats", "plank", "push-ups"];

    if (!validExercises.includes(exerciseType)) {
      exerciseNameElement.textContent = "Incorrect exercise!";
      updateBodyIcon("none");
    } else {
      exerciseNameElement.textContent =
        exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1);
      exercise = exerciseType;
      updateBodyIcon(exercise);
    }
    exerciseNameBox.style.display = "block";
  }

  function updateBodyIcon(currentExercise) {
    if (currentExercise === "squats") {
      bodyIcon.textContent = "🧍";
    } else if (currentExercise === "plank" || currentExercise === "push-ups") {
      bodyIcon.textContent = "🙇‍♂️";
      bodyIcon.classList.add("prone-icon");
    } else {
      bodyIcon.textContent = "❓";
    }
  }

  function calculateAngle(p1, p2, p3) {
    const radians =
      Math.atan2(p3.y - p2.y, p3.x - p2.x) -
      Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }

  function triggerFlash() {
    flashOverlay.style.opacity = "1";
    setTimeout(() => {
      flashOverlay.style.opacity = "0";
    }, 100);
  }

  function sendExerciseData(type, exerciseName, count) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: type,
          exercise: exerciseName,
          count: count,
        })
      );
    } else {
      console.log(
        "ReactNativeWebView not available. Running in a regular browser."
      );
    }
  }

  function exerciseDetection(results) {
    if (!results.poseLandmarks) {
      if (isPlankActive) {
        isPlankActive = false;
        clearInterval(plankInterval);
        plankInterval = null;
        plankTimerBox.style.display = "none";

        if (currentPlankSessionTime >= MIN_PLANK_DURATION_FOR_COUNT) {
          sendExerciseData(
            "exerciseData",
            "plank",
            Math.floor(currentPlankSessionTime)
          );
          totalPlankTime += currentPlankSessionTime;
          console.log(
            `Plank finished (all points lost). Session time: ${currentPlankSessionTime.toFixed(
              1
            )} sec. Total time: ${totalPlankTime.toFixed(1)} sec.`
          );
        } else {
          console.log(
            `Plank session too short (${currentPlankSessionTime.toFixed(
              1
            )} sec) to be counted.`
          );
        }
        currentPlankSessionTime = 0;
      }
      return;
    }

    if (exercise == "squats") {
      const leftHip = results.poseLandmarks[23];
      const leftKnee = results.poseLandmarks[25];
      const leftAnkle = results.poseLandmarks[27];

      const rightHip = results.poseLandmarks[24];
      const rightKnee = results.poseLandmarks[26];
      const rightAnkle = results.poseLandmarks[28];

      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];

      const allSquatPointsVisible =
        leftHip &&
        leftHip.visibility > 0.7 &&
        leftKnee &&
        leftKnee.visibility > 0.7 &&
        leftAnkle &&
        leftAnkle.visibility > 0.7 &&
        rightHip &&
        rightHip.visibility > 0.7 &&
        rightKnee &&
        rightKnee.visibility > 0.7 &&
        rightAnkle &&
        rightAnkle.visibility > 0.7 &&
        leftShoulder &&
        leftShoulder.visibility > 0.7 &&
        rightShoulder &&
        rightShoulder.visibility > 0.7;

      if (allSquatPointsVisible) {
        const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

        const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
        const rightHipAngle = calculateAngle(
          rightShoulder,
          rightHip,
          rightKnee
        );

        const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
        const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;

        if (
          isStanding &&
          avgKneeAngle < SQUAT_THRESHOLD_KNEE &&
          avgHipAngle < SQUAT_THRESHOLD_HIP
        ) {
          isStanding = false;
        } else if (!isStanding && avgKneeAngle > 160 && avgHipAngle > 160) {
          isStanding = true;
          squatCount++;
          sendExerciseData("exerciseData", "squats", 1);
          console.log("Squat count:", squatCount);
          triggerFlash();
        }
      } else {
      }
    } else if (exercise == "push-ups") {
      let shoulder, elbow, wrist, hip, ankle;
      const minVisibility = 0.5;

      const leftSideVisible =
        results.poseLandmarks[11] &&
        results.poseLandmarks[11].visibility > minVisibility &&
        results.poseLandmarks[13] &&
        results.poseLandmarks[13].visibility > minVisibility &&
        results.poseLandmarks[15] &&
        results.poseLandmarks[15].visibility > minVisibility &&
        results.poseLandmarks[23] &&
        results.poseLandmarks[23].visibility > minVisibility &&
        results.poseLandmarks[27] &&
        results.poseLandmarks[27].visibility > minVisibility;

      const rightSideVisible =
        results.poseLandmarks[12] &&
        results.poseLandmarks[12].visibility > minVisibility &&
        results.poseLandmarks[14] &&
        results.poseLandmarks[14].visibility > minVisibility &&
        results.poseLandmarks[16] &&
        results.poseLandmarks[16].visibility > minVisibility &&
        results.poseLandmarks[24] &&
        results.poseLandmarks[24].visibility > minVisibility &&
        results.poseLandmarks[28] &&
        results.poseLandmarks[28].visibility > minVisibility;

      if (leftSideVisible) {
        shoulder = results.poseLandmarks[11];
        elbow = results.poseLandmarks[13];
        wrist = results.poseLandmarks[15];
        hip = results.poseLandmarks[23];
        ankle = results.poseLandmarks[27];
      } else if (rightSideVisible) {
        shoulder = results.poseLandmarks[12];
        elbow = results.poseLandmarks[14];
        wrist = results.poseLandmarks[16];
        hip = results.poseLandmarks[24];
        ankle = results.poseLandmarks[28];
      } else {
        isPushUpStartingPosition = false;
        elbowBentDuringPushup = false;
        return;
      }

      const elbowAngle = calculateAngle(shoulder, elbow, wrist);
      const bodyAlignmentAngle = calculateAngle(shoulder, hip, ankle);

      const isElbowBent = elbowAngle < PUSHUP_THRESHOLD_ELBOW_DOWN;
      const isElbowStraight = elbowAngle > PUSHUP_THRESHOLD_ELBOW_UP;
      const isStraightBody =
        bodyAlignmentAngle > PUSHUP_THRESHOLD_BODY_ALIGNMENT;

      if (isStraightBody && isElbowStraight) {
        if (!isPushUpStartingPosition) {
          if (elbowBentDuringPushup) {
            pushUpCount++;
            sendExerciseData("exerciseData", "push-ups", 1);
            console.log("Push-up count:", pushUpCount);
            triggerFlash();
            elbowBentDuringPushup = false;
          }
        }
        isPushUpStartingPosition = true;
      } else if (isElbowBent && isStraightBody) {
        isPushUpStartingPosition = false;
        elbowBentDuringPushup = true;
      }
    } else if (exercise == "plank") {
      const minVisibility = 0.4;

      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];
      const leftHip = results.poseLandmarks[23];
      const rightHip = results.poseLandmarks[24];
      const leftAnkle = results.poseLandmarks[27];
      const rightAnkle = results.poseLandmarks[28];
      const leftElbow = results.poseLandmarks[13];
      const rightElbow = results.poseLandmarks[14];
      const leftWrist = results.poseLandmarks[15];
      const rightWrist = results.poseLandmarks[16];

      const getVisiblePointsCount = (side) => {
        const s = side === "left" ? leftShoulder : rightShoulder;
        const h = side === "left" ? leftHip : rightHip;
        const a = side === "left" ? leftAnkle : rightAnkle;
        const e = side === "left" ? leftElbow : rightElbow;
        const w = side === "left" ? leftWrist : rightWrist;
        return [s, h, a, e, w].filter((p) => p && p.visibility > minVisibility)
          .length;
      };

      const leftPointsCount = getVisiblePointsCount("left");
      const rightPointsCount = getVisiblePointsCount("right");

      let shoulder, hip, ankle, elbow, wrist;
      let selectedSide = "none";

      if (leftPointsCount >= rightPointsCount && leftPointsCount >= 4) {
        shoulder = leftShoulder;
        hip = leftHip;
        ankle = leftAnkle;
        elbow = leftElbow;
        wrist = leftWrist;
        selectedSide = "left";
      } else if (rightPointsCount >= 4) {
        shoulder = rightShoulder;
        hip = rightHip;
        ankle = rightAnkle;
        elbow = rightElbow;
        wrist = rightWrist;
        selectedSide = "right";
      }

      if (selectedSide === "none") {
        if (isPlankActive) {
          isPlankActive = false;
          clearInterval(plankInterval);
          plankInterval = null;
          plankTimerBox.style.display = "none";

          if (currentPlankSessionTime >= MIN_PLANK_DURATION_FOR_COUNT) {
            sendExerciseData(
              "exerciseData",
              "plank",
              Math.floor(currentPlankSessionTime)
            );
            totalPlankTime += currentPlankSessionTime;
            console.log(
              `Plank finished (loss of base points). Session time: ${currentPlankSessionTime.toFixed(
                1
              )} sec. Total time: ${totalPlankTime.toFixed(1)} sec.`
            );
          } else {
            console.log(
              `Plank session too short (${currentPlankSessionTime.toFixed(
                1
              )} sec) to be counted.`
            );
          }
          currentPlankSessionTime = 0;
        }
        return;
      }

      if (!shoulder || !hip || !ankle || !elbow || !wrist) {
        console.log(
          `Plank: Selected ${selectedSide} side does not have all required key points.`
        );
        if (isPlankActive) {
          isPlankActive = false;
          clearInterval(plankInterval);
          plankInterval = null;
          plankTimerBox.style.display = "none";

          if (currentPlankSessionTime >= MIN_PLANK_DURATION_FOR_COUNT) {
            sendExerciseData(
              "exerciseData",
              "plank",
              Math.floor(currentPlankSessionTime)
            );
            totalPlankTime += currentPlankSessionTime;
            console.log(
              `Plank finished (incomplete points). Session time: ${currentPlankSessionTime.toFixed(
                1
              )} sec. Total time: ${totalPlankTime.toFixed(1)} sec.`
            );
          } else {
            console.log(
              `Plank session too short (${currentPlankSessionTime.toFixed(
                1
              )} sec) to be counted.`
            );
          }
          currentPlankSessionTime = 0;
        }
        return;
      }

      const shoulderHipAngle = calculateAngle(elbow, shoulder, hip);
      const hipAnkleAngle = calculateAngle(shoulder, hip, ankle);
      const elbowWristAngle = calculateAngle(shoulder, elbow, wrist);

      const y_coords = [shoulder.y, hip.y, ankle.y];
      const max_y = Math.max(...y_coords);
      const min_y = Math.min(...y_coords);
      const y_range = max_y - min_y;

      const PLANK_SHOULDER_HIP_THRESHOLD = 80;
      const PLANK_HIP_ANKLE_THRESHOLD = 150;
      const PLANK_Y_RANGE_THRESHOLD = 0.15;
      const PLANK_ELBOW_WRIST_ANGLE_THRESHOLD = 80;

      const isBodyHorizontalOrder = shoulder.y < hip.y && hip.y < ankle.y;

      const isPlankPosition =
        shoulderHipAngle > PLANK_SHOULDER_HIP_THRESHOLD &&
        hipAnkleAngle > PLANK_HIP_ANKLE_THRESHOLD &&
        elbowWristAngle > PLANK_ELBOW_WRIST_ANGLE_THRESHOLD &&
        y_range < PLANK_Y_RANGE_THRESHOLD &&
        isBodyHorizontalOrder;

      if (isPlankPosition) {
        if (!isPlankActive) {
          isPlankActive = true;
          plankStartTime = Date.now();
          plankTimerBox.style.display = "block";
          console.log("Plank started!");
          if (!plankInterval) {
            plankInterval = setInterval(() => {
              currentPlankSessionTime = (Date.now() - plankStartTime) / 1000;
              plankTimerElement.textContent = `${Math.floor(
                currentPlankSessionTime
              )}s`;
              console.log(
                `Current plank time: ${Math.floor(
                  currentPlankSessionTime
                )} seconds`
              );
            }, 1000);
          }
        }
      } else {
        if (isPlankActive) {
          isPlankActive = false;
          clearInterval(plankInterval);
          plankInterval = null;
          plankTimerBox.style.display = "none";

          if (currentPlankSessionTime >= MIN_PLANK_DURATION_FOR_COUNT) {
            sendExerciseData(
              "exerciseData",
              "plank",
              Math.floor(currentPlankSessionTime)
            );
            totalPlankTime += currentPlankSessionTime;
            console.log(
              `Plank finished. Session time: ${currentPlankSessionTime.toFixed(
                1
              )} sec. Total plank time: ${totalPlankTime.toFixed(1)} sec.`
            );
          } else {
            console.log(
              `Plank session too short (${currentPlankSessionTime.toFixed(
                1
              )} sec) to be counted.`
            );
          }
          currentPlankSessionTime = 0;
        }
      }
    }
  }

  function updateToggleLabel() {
    toggleLabel.textContent = cameraEnabled ? "On" : "Off";
  }

  function showCameraControls() {
    cameraControls.style.display = "flex";
    requestCameraBtn.style.display = "none";
    permissionError.style.display = "none";
  }

  function showRequestButton() {
    cameraControls.style.display = "none";
    requestCameraBtn.style.display = "block";
    permissionError.style.display = "none";
  }

  function showPermissionError() {
    cameraControls.style.display = "none";
    requestCameraBtn.style.display = "block";
    permissionError.style.display = "block";
  }

  function showBodyDetectionOverlay() {
    bodyDetectionOverlay.style.display = "flex";
    fullBodyDetected = false;
    detectionStatus.textContent = "Searching for full body...";
    detectionStatus.classList.remove("success");
  }

  function checkFullBodyDetection(landmarks, currentExercise) {
    if (!landmarks) {
      return false;
    }

    const requiredPoints = {
      head: landmarks[0],
      leftShoulder: landmarks[11],
      rightShoulder: landmarks[12],
      leftHip: landmarks[23],
      rightHip: landmarks[24],
      leftAnkle: landmarks[27],
      rightAnkle: landmarks[28],
      leftWrist: landmarks[15],
      rightWrist: landmarks[16],
      leftElbow: landmarks[13],
      rightElbow: landmarks[14],
    };

    const minGeneralVisibility = 0.6;
    const minAnkleVisibility = 0.3;

    const corePointsVisible =
      requiredPoints.head &&
      requiredPoints.head.visibility > minGeneralVisibility &&
      ((requiredPoints.leftShoulder &&
        requiredPoints.leftShoulder.visibility > minGeneralVisibility) ||
        (requiredPoints.rightShoulder &&
          requiredPoints.rightShoulder.visibility > minGeneralVisibility)) &&
      ((requiredPoints.leftHip &&
        requiredPoints.leftHip.visibility > minGeneralVisibility) ||
        (requiredPoints.rightHip &&
          requiredPoints.rightHip.visibility > minGeneralVisibility));

    if (!corePointsVisible) {
      return false;
    }

    if (currentExercise === "squats") {
      const headY = requiredPoints.head.y;
      const avgAnkleY =
        ((requiredPoints.leftAnkle &&
        requiredPoints.leftAnkle.visibility > minAnkleVisibility
          ? requiredPoints.leftAnkle.y
          : headY + 0.5) +
          (requiredPoints.rightAnkle &&
          requiredPoints.rightAnkle.visibility > minAnkleVisibility
            ? requiredPoints.rightAnkle.y
            : headY + 0.5)) /
        2;
      const bodyHeight = Math.abs(avgAnkleY - headY);
      return bodyHeight > 0.3;
    } else if (currentExercise === "push-ups" || currentExercise === "plank") {
      let visibleShoulder, visibleHip, visibleAnkle, visibleWrist, visibleElbow;

      const leftSidePointsPresent =
        requiredPoints.leftShoulder &&
        requiredPoints.leftShoulder.visibility > minGeneralVisibility &&
        requiredPoints.leftHip &&
        requiredPoints.leftHip.visibility > minGeneralVisibility &&
        requiredPoints.leftWrist &&
        requiredPoints.leftWrist.visibility > minGeneralVisibility &&
        requiredPoints.leftElbow &&
        requiredPoints.leftElbow.visibility > minGeneralVisibility;

      const rightSidePointsPresent =
        requiredPoints.rightShoulder &&
        requiredPoints.rightShoulder.visibility > minGeneralVisibility &&
        requiredPoints.rightHip &&
        requiredPoints.rightHip.visibility > minGeneralVisibility &&
        requiredPoints.rightWrist &&
        requiredPoints.rightWrist.visibility > minGeneralVisibility &&
        requiredPoints.rightElbow &&
        requiredPoints.rightElbow.visibility > minGeneralVisibility;

      if (leftSidePointsPresent) {
        visibleShoulder = requiredPoints.leftShoulder;
        visibleHip = requiredPoints.leftHip;
        visibleAnkle = requiredPoints.leftAnkle;
        visibleWrist = requiredPoints.leftWrist;
        visibleElbow = requiredPoints.leftElbow;
      } else if (rightSidePointsPresent) {
        visibleShoulder = requiredPoints.rightShoulder;
        visibleHip = requiredPoints.rightHip;
        visibleAnkle = requiredPoints.rightAnkle;
        visibleWrist = requiredPoints.rightWrist;
        visibleElbow = requiredPoints.rightElbow;
      } else {
        return false;
      }

      if (!visibleShoulder || !visibleHip || !visibleElbow || !visibleWrist) {
        return false;
      }

      const pointsY = [visibleShoulder.y, visibleHip.y];
      if (visibleAnkle && visibleAnkle.visibility > minAnkleVisibility) {
        pointsY.push(visibleAnkle.y);
      }
      const maxY = Math.max(...pointsY);
      const minY = Math.min(...pointsY);
      const yRange = maxY - minY;

      const maxAllowedYDeviation = 0.15;

      const isHorizontallyAligned = yRange < maxAllowedYDeviation;
      const isWristAlignedOrBelowShoulder =
        visibleWrist.y >= visibleShoulder.y - 0.05;

      if (currentExercise === "plank") {
        const isElbowBelowShoulder = visibleElbow.y > visibleShoulder.y;
        return (
          isHorizontallyAligned &&
          isWristAlignedOrBelowShoulder &&
          isElbowBelowShoulder
        );
      } else {
        return isHorizontallyAligned && isWristAlignedOrBelowShoulder;
      }
    }

    return false;
  }

  function initializePose() {
    pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onPoseResults);
  }

  function onPoseResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#1E1E1E",
        lineWidth: 3,
      });
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#7304E9",
        lineWidth: 3,
        radius: 2,
      });

      const isFullBodyDetected = checkFullBodyDetection(
        results.poseLandmarks,
        exercise
      );

      if (isFullBodyDetected) {
        if (!fullBodyDetected) {
          if (detectionTimer) {
            clearTimeout(detectionTimer);
            detectionTimer = null;
          }
          detectionStatus.textContent = "Full body detected! ✓";
          detectionStatus.classList.add("success");
          fullBodyDetected = true;
          bodyDetectionOverlay.style.display = "none";
        }
        exerciseDetection(results);
      } else {
        if (fullBodyDetected) {
          if (!detectionTimer) {
            detectionStatus.textContent = "Searching for full body...";
            detectionStatus.classList.remove("success");
            detectionTimer = setTimeout(() => {
              showBodyDetectionOverlay();
              fullBodyDetected = false;
            }, 1000);
          }
        } else {
          showBodyDetectionOverlay();
        }
        exerciseDetection(results);
      }
    } else {
      if (fullBodyDetected) {
        if (!detectionTimer) {
          detectionStatus.textContent = "Searching for full body...";
          detectionStatus.classList.remove("success");
          detectionTimer = setTimeout(() => {
            showBodyDetectionOverlay();
            fullBodyDetected = false;
          }, 1000);
        }
      } else {
        showBodyDetectionOverlay();
      }
      exerciseDetection(results);
    }

    canvasCtx.restore();
  }
  async function startCamera() {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!pose) {
        initializePose();
      }

      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
        },
        audio: false,
      });

      videoElement.srcObject = stream;

      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
          resolve();
        };
      });

      await videoElement.play();

      if (camera) {
        camera.stop();
      }
      camera = new Camera(videoElement, {
        onFrame: async () => {
          if (pose && cameraEnabled) {
            await pose.send({ image: videoElement });
          }
        },
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
      camera.start();

      cameraPermissionGranted = true;
      cameraEnabled = true;
      toggleButton.checked = true;
      updateToggleLabel();
      showCameraControls();

      showBodyDetectionOverlay();
    } catch (err) {
      console.error("Camera access error:", err);

      cameraPermissionGranted = false;
      cameraEnabled = false;
      toggleButton.checked = false;
      updateToggleLabel();
      showPermissionError();
    }
  }

  function stopCamera() {
    if (camera) {
      camera.stop();
      camera = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }

    videoElement.srcObject = null;
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    cameraEnabled = false;
    toggleButton.checked = false;
    updateToggleLabel();

    if (isPlankActive) {
      isPlankActive = false;
      clearInterval(plankInterval);
      plankInterval = null;
      plankTimerBox.style.display = "none";

      if (currentPlankSessionTime >= MIN_PLANK_DURATION_FOR_COUNT) {
        sendExerciseData(
          "exerciseData",
          "plank",
          Math.floor(currentPlankSessionTime)
        );
        totalPlankTime += currentPlankSessionTime;
        console.log(
          `Plank finished due to camera stop. Session time: ${currentPlankSessionTime.toFixed(
            1
          )} sec. Total time: ${totalPlankTime.toFixed(1)} sec.`
        );
      } else {
        console.log(
          `Plank session too short (${currentPlankSessionTime.toFixed(
            1
          )} sec) to be counted.`
        );
      }
      currentPlankSessionTime = 0;
    }

    showBodyDetectionOverlay();

    if (cameraPermissionGranted) {
      showCameraControls();
    } else {
      showRequestButton();
    }
  }

  toggleButton.addEventListener("change", function () {
    if (this.checked) {
      startCamera();
    } else {
      stopCamera();
    }
  });

  switchButton.addEventListener("click", async function () {
    facingMode = facingMode === "user" ? "environment" : "user";
    if (cameraEnabled) {
      await startCamera();
    }
  });

  requestCameraBtn.addEventListener("click", function () {
    startCamera();
  });

  navigator.permissions
    .query({ name: "camera" })
    .then(function (result) {
      if (result.state === "granted") {
        cameraPermissionGranted = true;
        showCameraControls();
        startCamera();
      } else {
        showRequestButton();
      }
    })
    .catch(function () {
      showRequestButton();
    });

  initializePose();
  updateBodyIcon(exercise);
});
