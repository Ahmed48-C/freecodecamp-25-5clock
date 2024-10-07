import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    let timerId;

    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      audioRef.current.play();
      if (isSession) {
        setTimeLeft(breakLength * 60);
        setIsSession(false);
        document.getElementById("timer-label").textContent = "Break";
      } else {
        setTimeLeft(sessionLength * 60);
        setIsSession(true);
        document.getElementById("timer-label").textContent = "Session";
      }
    }

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, breakLength, sessionLength, isSession]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(prev => prev - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(prev => prev + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(prev => prev - 1);
      setTimeLeft((sessionLength - 1) * 60); // Update timer display if in session
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(prev => prev + 1);
      setTimeLeft((sessionLength + 1) * 60); // Update timer display if in session
    }
  };

  const handleStartStop = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    document.getElementById("timer-label").textContent = "Session";
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>25 + 5 Clock</Typography>
      <Box display="flex" justifyContent="space-around" width={400}>
        <Box textAlign="center">
          <Typography id="break-label">Break Length</Typography>
          <IconButton id="break-decrement" onClick={handleBreakDecrement}>
            <ArrowDownwardIcon />
          </IconButton>
          <Typography id="break-length">{breakLength}</Typography>
          <IconButton id="break-increment" onClick={handleBreakIncrement}>
            <ArrowUpwardIcon />
          </IconButton>
        </Box>

        <Box textAlign="center">
          <Typography id="session-label">Session Length</Typography>
          <IconButton id="session-decrement" onClick={handleSessionDecrement}>
            <ArrowDownwardIcon />
          </IconButton>
          <Typography id="session-length">{sessionLength}</Typography>
          <IconButton id="session-increment" onClick={handleSessionIncrement}>
            <ArrowUpwardIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        id="timer"
        sx={{
          textAlign: 'center',
          marginTop: 4,
          padding: 4,
          border: '1px solid #ccc',
          borderRadius: 4,
          width: 300,
          backgroundColor: '#fff',
        }}
      >
        <Typography id="timer-label" variant="h5">Session</Typography>
        <Typography id="time-left" variant="h3">{formatTime(timeLeft)}</Typography>
      </Box>

      <Box sx={{ marginTop: 3 }}>
        <Button
          id="start_stop"
          variant="contained"
          sx={{ marginRight: 2 }}
          onClick={handleStartStop}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          id="reset"
          variant="contained"
          color="secondary"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>

      <audio
        id="beep"
        ref={audioRef}
        src="/beep.mp3"
        preload="auto"
      />
    </Box>
  );
}

export default App;
