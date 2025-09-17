import * as React from 'react';
import './StopwatchTimerComponent.css';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import AlarmIcon from '@mui/icons-material/Alarm';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`timer-tabpanel-${index}`}
            aria-labelledby={`timer-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `timer-tab-${index}`,
        'aria-controls': `timer-tabpanel-${index}`,
    };
}

function StopwatchTimerComponent(): React.JSX.Element {
    const [tabValue, setTabValue] = React.useState(0);
    
    // Stopwatch state
    const [stopwatchTime, setStopwatchTime] = React.useState(0);
    const [stopwatchRunning, setStopwatchRunning] = React.useState(false);
    const stopwatchIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Timer state
    const [timerMinutes, setTimerMinutes] = React.useState(5);
    const [timerSeconds, setTimerSeconds] = React.useState(0);
    const [timerTimeLeft, setTimerTimeLeft] = React.useState(0);
    const [timerRunning, setTimerRunning] = React.useState(false);
    const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Timer finished dialog state
    const [timerFinishedOpen, setTimerFinishedOpen] = React.useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Stopwatch functions
    const startStopwatch = () => {
        if (!stopwatchRunning) {
            setStopwatchRunning(true);
            stopwatchIntervalRef.current = setInterval(() => {
                setStopwatchTime(prev => prev + 10);
            }, 10);
        }
    };

    const pauseStopwatch = () => {
        setStopwatchRunning(false);
        if (stopwatchIntervalRef.current) {
            clearInterval(stopwatchIntervalRef.current);
        }
    };

    const resetStopwatch = () => {
        setStopwatchRunning(false);
        setStopwatchTime(0);
        if (stopwatchIntervalRef.current) {
            clearInterval(stopwatchIntervalRef.current);
        }
    };

    // Timer functions
    const startTimer = () => {
        if (!timerRunning) {
            const totalSeconds = timerMinutes * 60 + timerSeconds;
            if (totalSeconds > 0) {
                setTimerTimeLeft(totalSeconds);
                setTimerRunning(true);
                timerIntervalRef.current = setInterval(() => {
                    setTimerTimeLeft(prev => {
                        if (prev <= 1) {
                            setTimerRunning(false);
                            if (timerIntervalRef.current) {
                                clearInterval(timerIntervalRef.current);
                            }
                            // Timer finished - show dialog
                            setTimerFinishedOpen(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }
    };

    const pauseTimer = () => {
        setTimerRunning(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };

    const resetTimer = () => {
        setTimerRunning(false);
        setTimerTimeLeft(0);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };

    const handleTimerFinishedClose = () => {
        setTimerFinishedOpen(false);
    };

    // Format time display
    const formatStopwatchTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const centiseconds = Math.floor((time % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    const formatTimerTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Cleanup intervals on unmount
    React.useEffect(() => {
        return () => {
            if (stopwatchIntervalRef.current) {
                clearInterval(stopwatchIntervalRef.current);
            }
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="stopwatch timer tabs"
                    centered
                    sx={{
                        '& .MuiTab-root': {
                            minWidth: '50%',
                            fontWeight: 'bold'
                        }
                    }}
                >
                    <Tab 
                        icon={<AccessTimeIcon />} 
                        iconPosition="start"
                        label="Stopwatch" 
                        {...a11yProps(0)} 
                    />
                    <Tab 
                        icon={<TimerIcon />} 
                        iconPosition="start"
                        label="Timer" 
                        {...a11yProps(1)} 
                    />
                </Tabs>
            </Box>

            <CustomTabPanel value={tabValue} index={0}>
                <div className="timer-content">
                    <div className="time-display stopwatch-display">
                        {formatStopwatchTime(stopwatchTime)}
                    </div>
                    
                    <Stack direction="row" spacing={1} className="control-buttons">
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PlayArrowIcon />}
                            onClick={startStopwatch}
                            disabled={stopwatchRunning}
                            size="small"
                        >
                            Start
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<PauseIcon />}
                            onClick={pauseStopwatch}
                            disabled={!stopwatchRunning}
                            size="small"
                        >
                            Pause
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<RestartAltIcon />}
                            onClick={resetStopwatch}
                            size="small"
                        >
                            Reset
                        </Button>
                    </Stack>
                </div>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
                <div className="timer-content">
                    {!timerRunning && timerTimeLeft === 0 ? (
                        <div className="timer-setup">
                            <Stack direction="row" spacing={1} className="time-inputs">
                                <TextField
                                    label="Minutes"
                                    type="number"
                                    value={timerMinutes}
                                    onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                                    size="small"
                                    inputProps={{ min: 0, max: 59 }}
                                />
                                <TextField
                                    label="Seconds"
                                    type="number"
                                    value={timerSeconds}
                                    onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                    size="small"
                                    inputProps={{ min: 0, max: 59 }}
                                />
                            </Stack>
                        </div>
                    ) : (
                        <div className="time-display timer-display">
                            {formatTimerTime(timerTimeLeft)}
                        </div>
                    )}
                    
                    <Stack direction="row" spacing={1} className="control-buttons">
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PlayArrowIcon />}
                            onClick={startTimer}
                            disabled={timerRunning || (timerMinutes === 0 && timerSeconds === 0)}
                            size="small"
                        >
                            Start
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<PauseIcon />}
                            onClick={pauseTimer}
                            disabled={!timerRunning}
                            size="small"
                        >
                            Pause
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<RestartAltIcon />}
                            onClick={resetTimer}
                            size="small"
                        >
                            Reset
                        </Button>
                    </Stack>
                </div>
            </CustomTabPanel>

            {/* Timer Finished Dialog */}
            <Dialog
                open={timerFinishedOpen}
                onClose={handleTimerFinishedClose}
                maxWidth="sm"
                fullWidth
                slots={{
                    transition: Transition,
                }}
                PaperProps={{
                    className: 'timer-finished-dialog'
                }}
            >
                <DialogTitle className="timer-finished-title">
                    <div className="timer-finished-header">
                        <AlarmIcon className="timer-finished-icon" />
                        Timer Finished!
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleTimerFinishedClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="timer-finished-content">
                        <div className="timer-finished-message">
                            Your timer has completed!
                        </div>
                        <div className="timer-finished-time">
                            {formatTimerTime(timerMinutes * 60 + timerSeconds)}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleTimerFinishedClose} 
                        variant="contained" 
                        color="primary"
                        size="large"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default StopwatchTimerComponent;