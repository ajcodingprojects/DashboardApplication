import * as React from 'react';
import './NotesComponent.css';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import { getNotes, saveNotes } from '../Connectors/NotesBackend';

function NotesComponent(): React.JSX.Element {
    const [notes, setNotes] = React.useState('');
    const [originalNotes, setOriginalNotes] = React.useState('');
    const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [hasChanges, setHasChanges] = React.useState(false);
    const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

    const autoSaveIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Load notes on component mount
    React.useEffect(() => {
        const loadNotes = async () => {
            try {
                const notesData = await getNotes();
                setNotes(notesData);
                setOriginalNotes(notesData);
            } catch (error) {
                console.error('Failed to load notes:', error);
                setSaveStatus('error');
            }
        };

        loadNotes();
    }, []);

    // Track changes
    React.useEffect(() => {
        setHasChanges(notes !== originalNotes);
    }, [notes, originalNotes]);

    // Auto-save functionality
    React.useEffect(() => {
        if (autoSaveIntervalRef.current) {
            clearInterval(autoSaveIntervalRef.current);
        }

        autoSaveIntervalRef.current = setInterval(() => {
            if (hasChanges) {
                handleSave(true); // Auto-save
            }
        }, 5 * 60 * 1000); // 5 minutes

        return () => {
            if (autoSaveIntervalRef.current) {
                clearInterval(autoSaveIntervalRef.current);
            }
        };
    }, [hasChanges]);

    const handleSave = async (isAutoSave = false) => {
        if (!hasChanges) return;

        setSaveStatus('saving');
        try {
            await saveNotes(notes);
            setOriginalNotes(notes);
            setSaveStatus('saved');
            setLastSaved(new Date());
            
            // Clear saved status after 3 seconds
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Failed to save notes:', error);
            setSaveStatus('error');
            
            // Clear error status after 5 seconds
            setTimeout(() => {
                setSaveStatus('idle');
            }, 5000);
        }
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value);
    };

    const getSaveButtonText = () => {
        switch (saveStatus) {
            case 'saving':
                return 'Saving...';
            case 'saved':
                return 'Saved!';
            case 'error':
                return 'Error';
            default:
                return 'Save Notes';
        }
    };

    const getSaveButtonIcon = () => {
        switch (saveStatus) {
            case 'saving':
                return <CircularProgress size={16} color="inherit" />;
            case 'saved':
                return <CheckCircleIcon />;
            case 'error':
                return <ErrorIcon />;
            default:
                return <SaveIcon />;
        }
    };

    const getSaveButtonColor = () => {
        switch (saveStatus) {
            case 'saved':
                return 'success';
            case 'error':
                return 'error';
            default:
                return 'primary';
        }
    };

    return (
        <Box className="notes-container">
            <div className="notes-header">
                <Typography variant="h6" component="h2" className="notes-title">
                    Quick Notes
                </Typography>
                <div className="notes-controls">
                    {hasChanges && (
                        <Typography variant="caption" className="unsaved-changes">
                            Unsaved changes
                        </Typography>
                    )}
                    {lastSaved && (
                        <Typography variant="caption" className="last-saved">
                            Last saved: {lastSaved.toLocaleTimeString()}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color={getSaveButtonColor() as any}
                        startIcon={getSaveButtonIcon()}
                        onClick={() => handleSave(false)}
                        disabled={!hasChanges || saveStatus === 'saving'}
                        size="small"
                        className="save-button"
                    >
                        {getSaveButtonText()}
                    </Button>
                </div>
            </div>
            
            <TextField
                multiline
                rows={12}
                fullWidth
                variant="outlined"
                placeholder="Start typing your notes here..."
                value={notes}
                onChange={handleNotesChange}
                className="notes-input"
                InputProps={{
                    className: 'notes-textarea'
                }}
            />
            
            <div className="notes-footer">
                <Typography variant="caption" className="auto-save-info">
                    Auto-saves every 5 minutes when changes are detected
                </Typography>
            </div>
        </Box>
    );
}

export default NotesComponent;