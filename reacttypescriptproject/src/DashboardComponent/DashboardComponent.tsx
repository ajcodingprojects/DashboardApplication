import DashboardCard from '../DashboardCard/DashboardCard';
import ClockComponent from '../ClockComponent/ClockComponent';
import StopwatchTimerComponent from '../StopwatchTimerComponent/StopwatchTimerComponent';
import NotesComponent from '../NotesComponent/NotesComponent';
import BookmarksComponent from '../BookmarksComponent/BookmarksComponent';
import NetworkStatusComponent from '../NetworkStatusComponent/NetworkStatusComponent';
import './DashboardComponent.css';
import * as React from 'react';
import TodoComponent from '../TodoComponent/TodoComponent';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import RestoreIcon from '@mui/icons-material/Restore';
import DailyReminderComponent from '../DailyReminderComponent/DailyReminderComponent.tsx';

interface DashboardSettings {
    userName: string;
    autoRefresh: boolean;
    refreshInterval: number; // in minutes
    animations: boolean;
    compactMode: boolean;
    showGreeting: boolean;
    showStatusIndicator: boolean;
    clockFormat: '12h' | '24h';
    cardAnimationDelay: number;
    notifications: {
        enabled: boolean;
        todoReminders: boolean;
        networkAlerts: boolean;
        dailyReminders: boolean;
    };
    layout: {
        todoWidth: number; // percentage
        cardSpacing: number;
    };
}

const defaultSettings: DashboardSettings = {
    userName: 'Andrew',
    autoRefresh: false,
    refreshInterval: 30,
    animations: true,
    compactMode: false,
    showGreeting: true,
    showStatusIndicator: true,
    clockFormat: '12h',
    cardAnimationDelay: 100,
    notifications: {
        enabled: true,
        todoReminders: true,
        networkAlerts: true,
        dailyReminders: true,
    },
    layout: {
        todoWidth: 40,
        cardSpacing: 12,
    },
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function DashboardComponent(): React.JSX.Element {
    const [progressOpen, setProgressOpen] = React.useState(false);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [lastRefresh, setLastRefresh] = React.useState<Date>(new Date());
    const [cardsLoaded, setCardsLoaded] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [settingsTab, setSettingsTab] = React.useState(0);
    const [settings, setSettings] = React.useState<DashboardSettings>(() => {
        const saved = localStorage.getItem('dashboardSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    });

    // Auto-refresh functionality
    React.useEffect(() => {
        if (!settings.autoRefresh) return;

        const interval = setInterval(() => {
            setLastRefresh(new Date());
            setCardsLoaded(false);
            setTimeout(() => setCardsLoaded(true), 200);
        }, settings.refreshInterval * 60 * 1000);

        return () => clearInterval(interval);
    }, [settings.autoRefresh, settings.refreshInterval]);

    // Save settings to localStorage
    const saveSettings = (newSettings: DashboardSettings) => {
        setSettings(newSettings);
        localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
    };

    // Initialize body and root classes
    React.useEffect(() => {
        const body = document.querySelector('body');
        const root = document.getElementById('root');
        
        body?.classList.add('body-display');
        root?.classList.add('dashboard-root');

        // Apply compact mode
        if (settings.compactMode) {
            root?.classList.add('compact-mode');
        } else {
            root?.classList.remove('compact-mode');
        }

        // Apply layout variables
        document.documentElement.style.setProperty('--todo-width', `${settings.layout.todoWidth}vw`);
        document.documentElement.style.setProperty('--main-width', `${100 - settings.layout.todoWidth}vw`);
        document.documentElement.style.setProperty('--card-spacing', `${settings.layout.cardSpacing}px`);

        // Add staggered card loading animation
        const timer = setTimeout(() => {
            setCardsLoaded(true);
        }, settings.animations ? 100 : 0);

        return () => {
            clearTimeout(timer);
            body?.classList.remove('body-display');
            root?.classList.remove('dashboard-root', 'compact-mode');
        };
    }, [settings]);

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        setLastRefresh(new Date());
        setCardsLoaded(false);
        setTimeout(() => setCardsLoaded(true), settings.animations ? 200 : 0);
    };

    // Handle settings
    const handleSettingsOpen = () => {
        setSettingsOpen(true);
    };

    const handleSettingsClose = () => {
        setSettingsOpen(false);
    };

    const handleResetSettings = () => {
        saveSettings(defaultSettings);
    };

    // Listen for fullscreen changes
    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleClose = () => {
        setProgressOpen(false);
    };

    // Get current time for dynamic greeting
    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const animationDelay = settings.animations ? settings.cardAnimationDelay : 0;
    
    return (
        <>
            {settings.showGreeting && (
                <Fade in={true} timeout={settings.animations ? 800 : 0}>
                    <div className='dashboard-greeting'>
                        <div className="greeting-content">
                            <div className="greeting-text">
                                {getTimeBasedGreeting()}, {settings.userName}! Welcome to your dashboard.
                            </div>
                            <div className="dashboard-controls">
                                <Tooltip title="Refresh Dashboard" arrow>
                                    <IconButton 
                                        onClick={handleRefresh}
                                        className="control-button"
                                        size="small"
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} arrow>
                                    <IconButton 
                                        onClick={toggleFullscreen}
                                        className="control-button"
                                        size="small"
                                    >
                                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Dashboard Settings" arrow>
                                    <IconButton 
                                        onClick={handleSettingsOpen}
                                        className="control-button"
                                        size="small"
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="greeting-accent"></div>
                    </div>
                </Fade>
            )}

            <div className='dashboard-container' style={{ 
                gap: settings.layout.cardSpacing,
            } as React.CSSProperties}>
                <div className='dashboard-main' style={{ gap: settings.layout.cardSpacing }}>
                    {/* Row 1: Clock and Daily Reminders */}
                    <div className="dashboard-row row-1" style={{ gap: settings.layout.cardSpacing }}>
                        <Zoom in={cardsLoaded} timeout={settings.animations ? 600 : 0} style={{ transitionDelay: `${animationDelay * 0}ms` }}>
                            <div className="dashboard-card-wrapper">
                                <DashboardCard innerContent={<ClockComponent />} />
                            </div>
                        </Zoom>
                        <Zoom in={cardsLoaded} timeout={settings.animations ? 600 : 0} style={{ transitionDelay: `${animationDelay * 1}ms` }}>
                            <div className="dashboard-card-wrapper">
                                <DashboardCard innerContent={<DailyReminderComponent />} />
                            </div>
                        </Zoom>
                    </div>

                    {/* Row 2: Quick Notes (Full Width) */}
                    <div className="dashboard-row row-2">
                        <Zoom in={cardsLoaded} timeout={settings.animations ? 600 : 0} style={{ transitionDelay: `${animationDelay * 2}ms` }}>
                            <div className="dashboard-card-wrapper full-width">
                                <DashboardCard innerContent={<NotesComponent />} addClass='notes-display' />
                            </div>
                        </Zoom>
                    </div>

                    {/* Row 3: Bookmarks and Network Status */}
                    <div className="dashboard-row row-3" style={{ gap: settings.layout.cardSpacing }}>
                        <Zoom in={cardsLoaded} timeout={settings.animations ? 600 : 0} style={{ transitionDelay: `${animationDelay * 3}ms` }}>
                            <div className="dashboard-card-wrapper">
                                <DashboardCard innerContent={<BookmarksComponent />} />
                            </div>
                        </Zoom>
                        <Zoom in={cardsLoaded} timeout={settings.animations ? 600 : 0} style={{ transitionDelay: `${animationDelay * 4}ms` }}>
                            <div className="dashboard-card-wrapper">
                                <DashboardCard innerContent={<NetworkStatusComponent />} />
                            </div>
                        </Zoom>
                    </div>

                    {/* Row 4: Stopwatch/Timer (Centered) */}
                    <div className="dashboard-row row-4">
                        <div className="scrollable-section">
                            <Zoom in={cardsLoaded} timeout={settings.animations ? 600 : 0} style={{ transitionDelay: `${animationDelay * 5}ms` }}>
                                <div className="dashboard-card-wrapper centered">
                                    <DashboardCard innerContent={<StopwatchTimerComponent />} />
                                </div>
                            </Zoom>
                        </div>
                    </div>
                </div>

                {/* Todo Section (Right Side) */}
                <div className='dashboard-right'>
                    <Zoom in={cardsLoaded} timeout={settings.animations ? 600 : 0} style={{ transitionDelay: `${animationDelay * 6}ms` }}>
                        <div className="dashboard-card-wrapper todo-wrapper">
                            <DashboardCard innerContent={<TodoComponent progressControl={setProgressOpen} />} addClass='todo-display' />
                        </div>
                    </Zoom>
                </div>
            </div>

            {/* Enhanced backdrop with blur effect */}
            <Backdrop
                sx={(theme) => ({ 
                    color: '#fff', 
                    zIndex: theme.zIndex.drawer + 1,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                })}
                open={progressOpen}
                onClick={handleClose}
            >
                <div className="loading-container">
                    <CircularProgress 
                        color="inherit" 
                        size={60}
                        thickness={3}
                    />
                    <div className="loading-text">Loading...</div>
                </div>
            </Backdrop>

            {/* Settings Dialog */}
            <Dialog
                open={settingsOpen}
                onClose={handleSettingsClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 30, 30, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        minHeight: '70vh'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    pb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsIcon />
                        Dashboard Settings
                    </Box>
                    <IconButton onClick={handleSettingsClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <Tabs 
                            value={settingsTab} 
                            onChange={(_, newValue) => setSettingsTab(newValue)}
                            sx={{
                                '& .MuiTab-root': { 
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-selected': { color: 'rgba(255, 255, 255, 0.9)' }
                                },
                                '& .MuiTabs-indicator': { backgroundColor: 'rgba(33, 150, 243, 0.8)' }
                            }}
                        >
                            <Tab icon={<PersonIcon />} label="Personal" />
                            <Tab icon={<PaletteIcon />} label="Appearance" />
                            <Tab icon={<ViewModuleIcon />} label="Layout" />
                            <Tab icon={<NotificationsIcon />} label="Notifications" />
                        </Tabs>
                    </Box>

                    {/* Personal Settings */}
                    <TabPanel value={settingsTab} index={0}>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                            Personal Preferences
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Display Name"
                                value={settings.userName}
                                onChange={(e) => saveSettings({ ...settings, userName: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                    '& .MuiOutlinedInput-root': { 
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                        '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' }
                                    }
                                }}
                            />

                            <FormControl fullWidth>
                                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Clock Format</InputLabel>
                                <Select
                                    value={settings.clockFormat}
                                    onChange={(e) => saveSettings({ ...settings, clockFormat: e.target.value as '12h' | '24h' })}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.6)' }
                                    }}
                                >
                                    <MenuItem value="12h">12 Hour (AM/PM)</MenuItem>
                                    <MenuItem value="24h">24 Hour</MenuItem>
                                </Select>
                            </FormControl>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={settings.autoRefresh}
                                            onChange={(e) => saveSettings({ ...settings, autoRefresh: e.target.checked })}
                                        />
                                    }
                                    label="Auto Refresh Dashboard"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                />
                                {settings.autoRefresh && (
                                    <Box sx={{ ml: 4, mt: 1 }}>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                            Refresh Interval: {settings.refreshInterval} minutes
                                        </Typography>
                                        <Slider
                                            value={settings.refreshInterval}
                                            onChange={(_, value) => saveSettings({ ...settings, refreshInterval: value as number })}
                                            min={1}
                                            max={60}
                                            marks={[
                                                { value: 1, label: '1m' },
                                                { value: 15, label: '15m' },
                                                { value: 30, label: '30m' },
                                                { value: 60, label: '1h' }
                                            ]}
                                            sx={{ width: 200 }}
                                        />
                                    </Box>
                                )}
                            </FormGroup>
                        </Box>
                    </TabPanel>

                    {/* Appearance Settings */}
                    <TabPanel value={settingsTab} index={1}>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                            Visual Preferences
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={settings.animations}
                                            onChange={(e) => saveSettings({ ...settings, animations: e.target.checked })}
                                        />
                                    }
                                    label="Enable Animations"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={settings.compactMode}
                                            onChange={(e) => saveSettings({ ...settings, compactMode: e.target.checked })}
                                        />
                                    }
                                    label="Compact Mode"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={settings.showGreeting}
                                            onChange={(e) => saveSettings({ ...settings, showGreeting: e.target.checked })}
                                        />
                                    }
                                    label="Show Greeting Bar"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={settings.showStatusIndicator}
                                            onChange={(e) => saveSettings({ ...settings, showStatusIndicator: e.target.checked })}
                                        />
                                    }
                                    label="Show Status Indicator"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                />
                            </FormGroup>

                            {settings.animations && (
                                <Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                        Animation Delay: {settings.cardAnimationDelay}ms
                                    </Typography>
                                    <Slider
                                        value={settings.cardAnimationDelay}
                                        onChange={(_, value) => saveSettings({ ...settings, cardAnimationDelay: value as number })}
                                        min={0}
                                        max={500}
                                        step={50}
                                        marks={[
                                            { value: 0, label: 'None' },
                                            { value: 100, label: '100ms' },
                                            { value: 250, label: '250ms' },
                                            { value: 500, label: '500ms' }
                                        ]}
                                    />
                                </Box>
                            )}
                        </Box>
                    </TabPanel>

                    {/* Layout Settings */}
                    <TabPanel value={settingsTab} index={2}>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                            Layout Configuration
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                    Todo Section Width: {settings.layout.todoWidth}%
                                </Typography>
                                <Slider
                                    value={settings.layout.todoWidth}
                                    onChange={(_, value) => saveSettings({ 
                                        ...settings, 
                                        layout: { ...settings.layout, todoWidth: value as number }
                                    })}
                                    min={25}
                                    max={50}
                                    marks={[
                                        { value: 25, label: '25%' },
                                        { value: 35, label: '35%' },
                                        { value: 40, label: '40%' },
                                        { value: 50, label: '50%' }
                                    ]}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                    Card Spacing: {settings.layout.cardSpacing}px
                                </Typography>
                                <Slider
                                    value={settings.layout.cardSpacing}
                                    onChange={(_, value) => saveSettings({ 
                                        ...settings, 
                                        layout: { ...settings.layout, cardSpacing: value as number }
                                    })}
                                    min={4}
                                    max={24}
                                    step={2}
                                    marks={[
                                        { value: 4, label: '4px' },
                                        { value: 8, label: '8px' },
                                        { value: 12, label: '12px' },
                                        { value: 16, label: '16px' },
                                        { value: 24, label: '24px' }
                                    ]}
                                />
                            </Box>
                        </Box>
                    </TabPanel>

                    {/* Notifications Settings */}
                    <TabPanel value={settingsTab} index={3}>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                            Notification Preferences
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Note: Browser notifications require permission and may not work in all environments.
                            </Alert>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={settings.notifications.enabled}
                                            onChange={(e) => saveSettings({ 
                                                ...settings, 
                                                notifications: { ...settings.notifications, enabled: e.target.checked }
                                            })}
                                        />
                                    }
                                    label="Enable Notifications"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                />
                                
                                {settings.notifications.enabled && (
                                    <Box sx={{ ml: 4, mt: 1 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    checked={settings.notifications.todoReminders}
                                                    onChange={(e) => saveSettings({ 
                                                        ...settings, 
                                                        notifications: { ...settings.notifications, todoReminders: e.target.checked }
                                                    })}
                                                />
                                            }
                                            label="Todo Reminders"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    checked={settings.notifications.networkAlerts}
                                                    onChange={(e) => saveSettings({ 
                                                        ...settings, 
                                                        notifications: { ...settings.notifications, networkAlerts: e.target.checked }
                                                    })}
                                                />
                                            }
                                            label="Network Status Alerts"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    checked={settings.notifications.dailyReminders}
                                                    onChange={(e) => saveSettings({ 
                                                        ...settings, 
                                                        notifications: { ...settings.notifications, dailyReminders: e.target.checked }
                                                    })}
                                                />
                                            }
                                            label="Daily Reminders"
                                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        />
                                    </Box>
                                )}
                            </FormGroup>
                        </Box>
                    </TabPanel>
                </DialogContent>

                <DialogActions sx={{ 
                    p: 3, 
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    justifyContent: 'space-between'
                }}>
                    <Button 
                        onClick={handleResetSettings}
                        startIcon={<RestoreIcon />}
                        sx={{ color: 'rgba(255, 152, 0, 0.8)' }}
                    >
                        Reset to Defaults
                    </Button>
                    <Button 
                        onClick={handleSettingsClose}
                        variant="contained"
                        sx={{ 
                            background: 'rgba(33, 150, 243, 0.8)',
                            '&:hover': { background: 'rgba(33, 150, 243, 1)' }
                        }}
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Status indicator */}
            {settings.showStatusIndicator && (
                <div className="dashboard-status">
                    <div className="status-dot"></div>
                    <span className="status-text">
                        Last updated: {lastRefresh.toLocaleTimeString()}
                        {settings.autoRefresh && ` | Auto-refresh: ${settings.refreshInterval}m`}
                    </span>
                </div>
            )}
        </>
    );
}

export default DashboardComponent;

