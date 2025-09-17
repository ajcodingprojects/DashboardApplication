import * as React from 'react';
import './NetworkStatusComponent.css';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import SignalWifiIcon from '@mui/icons-material/SignalWifi4Bar';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SpeedIcon from '@mui/icons-material/Speed';
import PingIcon from '@mui/icons-material/NetworkPing';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme }) => ({
    fontWeight: 'bold',
    '&.online': {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        color: '#4caf50',
        border: '1px solid rgba(76, 175, 80, 0.3)',
    },
    '&.offline': {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        color: '#f44336',
        border: '1px solid rgba(244, 67, 54, 0.3)',
    },
}));

interface NetworkInfo {
    isOnline: boolean;
    connection?: NetworkInformation;
    ping?: number;
    downloadSpeed?: number;
    uploadSpeed?: number;
}

function NetworkStatusComponent(): React.JSX.Element {
    const [networkInfo, setNetworkInfo] = React.useState<NetworkInfo>({
        isOnline: navigator.onLine,
        ping: 0,
        downloadSpeed: 0,
        uploadSpeed: 0
    });

    const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
    const [isTesting, setIsTesting] = React.useState(false);

    // Monitor online/offline status
    React.useEffect(() => {
        const handleOnline = () => {
            setNetworkInfo(prev => ({ ...prev, isOnline: true }));
            setLastUpdate(new Date());
        };

        const handleOffline = () => {
            setNetworkInfo(prev => ({ ...prev, isOnline: false }));
            setLastUpdate(new Date());
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Get network connection info if available
    React.useEffect(() => {
        if ('connection' in navigator) {
            const connection = (navigator as any).connection;
            setNetworkInfo(prev => ({ ...prev, connection }));

            const updateConnection = () => {
                setNetworkInfo(prev => ({ ...prev, connection }));
                setLastUpdate(new Date());
            };

            connection.addEventListener('change', updateConnection);
            return () => connection.removeEventListener('change', updateConnection);
        }
    }, []);

    // Test network speed function
    const testNetworkSpeed = async () => {
        if (!networkInfo.isOnline) return;

        setIsTesting(true);
        try {
            // Simulate ping test
            const startTime = performance.now();
            await fetch('/ping-test.json', { 
                method: 'HEAD', 
                cache: 'no-cache' 
            }).catch(() => {
                // If the file doesn't exist, that's fine for our ping simulation
            });
            const endTime = performance.now();
            const simulatedPing = Math.floor(Math.random() * 50) + 20; // 20-70ms

            // Simulate download/upload speeds (in Mbps)
            const simulatedDownload = Math.floor(Math.random() * 80) + 20; // 20-100 Mbps
            const simulatedUpload = Math.floor(Math.random() * 20) + 5; // 5-25 Mbps

            setNetworkInfo(prev => ({
                ...prev,
                ping: simulatedPing,
                downloadSpeed: simulatedDownload,
                uploadSpeed: simulatedUpload
            }));
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Network test failed:', error);
        } finally {
            setIsTesting(false);
        }
    };

    // Simulate network speed tests on interval
    React.useEffect(() => {
        if (!networkInfo.isOnline) return;

        // Initial test
        testNetworkSpeed();

        // Test every 30 seconds
        const interval = setInterval(testNetworkSpeed, 30000);

        return () => clearInterval(interval);
    }, [networkInfo.isOnline]);

    // Handle manual test button click
    const handleTestNetwork = () => {
        testNetworkSpeed();
    };

    const getConnectionType = () => {
        if (networkInfo.connection) {
            return networkInfo.connection.effectiveType || networkInfo.connection.type || 'Unknown';
        }
        return 'Unknown';
    };

    const getSignalStrength = () => {
        if (networkInfo.downloadSpeed) {
            if (networkInfo.downloadSpeed > 50) return 'Excellent';
            if (networkInfo.downloadSpeed > 25) return 'Good';
            if (networkInfo.downloadSpeed > 10) return 'Fair';
            return 'Poor';
        }
        return 'Unknown';
    };

    return (
        <Box className="network-status-container">
            <div className="network-header">
                <Typography variant="h6" component="h2" className="network-title">
                    Network Status
                </Typography>
                <StatusChip 
                    size="small"
                    icon={networkInfo.isOnline ? <SignalWifiIcon /> : <WifiOffIcon />}
                    label={networkInfo.isOnline ? 'Online' : 'Offline'}
                    className={networkInfo.isOnline ? 'online' : 'offline'}
                />
            </div>

            <div className="network-content">
                {networkInfo.isOnline ? (
                    <>
                        {/* Connection Info */}
                        <div className="network-item">
                            <div className="network-item-header">
                                <SignalWifiIcon className="network-icon" />
                                <Typography variant="subtitle2" className="network-label">
                                    Connection Type
                                </Typography>
                            </div>
                            <Typography variant="body2" className="network-value">
                                {getConnectionType().toUpperCase()}
                            </Typography>
                        </div>

                        {/* Ping */}
                        <div className="network-item">
                            <div className="network-item-header">
                                <PingIcon className="network-icon" />
                                <Typography variant="subtitle2" className="network-label">
                                    Ping
                                </Typography>
                            </div>
                            <Typography variant="body2" className="network-value">
                                {networkInfo.ping}ms
                            </Typography>
                        </div>

                        {/* Download Speed */}
                        <div className="network-item">
                            <div className="network-item-header">
                                <SpeedIcon className="network-icon" />
                                <Typography variant="subtitle2" className="network-label">
                                    Download Speed
                                </Typography>
                            </div>
                            <Typography variant="body2" className="network-value">
                                {networkInfo.downloadSpeed} Mbps
                            </Typography>
                        </div>

                        {/* Upload Speed */}
                        <div className="network-item">
                            <div className="network-item-header">
                                <SpeedIcon className="network-icon" style={{ transform: 'rotate(180deg)' }} />
                                <Typography variant="subtitle2" className="network-label">
                                    Upload Speed
                                </Typography>
                            </div>
                            <Typography variant="body2" className="network-value">
                                {networkInfo.uploadSpeed} Mbps
                            </Typography>
                        </div>

                        {/* Signal Strength */}
                        <div className="network-item">
                            <div className="network-item-header">
                                <SignalWifiIcon className="network-icon" />
                                <Typography variant="subtitle2" className="network-label">
                                    Signal Quality
                                </Typography>
                            </div>
                            <Chip 
                                size="small"
                                label={getSignalStrength()}
                                className={`signal-chip ${getSignalStrength().toLowerCase()}`}
                            />
                        </div>
                    </>
                ) : (
                    <div className="offline-message">
                        <WifiOffIcon className="offline-icon" />
                        <Typography variant="body1" className="offline-text">
                            No Internet Connection
                        </Typography>
                        <Typography variant="caption" className="offline-caption">
                            Check your network settings
                        </Typography>
                    </div>
                )}
            </div>

            <div className="network-footer">
                <Typography variant="caption" className="last-updated">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                </Typography>
                <Fab 
                    variant="extended" 
                    size="small" 
                    color="primary"
                    onClick={handleTestNetwork}
                    disabled={!networkInfo.isOnline || isTesting}
                    className="test-network-fab"
                >
                    <RefreshIcon sx={{ mr: 1, animation: isTesting ? 'spin 1s linear infinite' : 'none' }} />
                    {isTesting ? 'Testing...' : 'Test'}
                </Fab>
            </div>
        </Box>
    );
}

export default NetworkStatusComponent;