import * as React from 'react';
import './BookmarksComponent.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TabIcon from '@mui/icons-material/Tab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { getBookmarksdata, addBookmark, editBookmark, removeBookmark, type Bookmark } from '../Connectors/BookmarksBackend';

// Import browser logo images
import EdgeLogo from '../assets/edge_logo.png';
import ChromeLogo from '../assets/chrome_logo.png';

// Browser icons using actual logo images with transparent background support
const EdgeIcon = () => (
    <img 
        src={EdgeLogo} 
        alt="Edge" 
        style={{ 
            width: 40, 
            height: 40, 
            objectFit: 'contain',
            background: 'transparent'
        }} 
    />
);

const ChromeIcon = () => (
    <img 
        src={ChromeLogo} 
        alt="Chrome" 
        style={{ 
            width: 40, 
            height: 40, 
            objectFit: 'contain',
            background: 'transparent'
        }} 
    />
);

interface OpenOptions {
    target: 'tab' | 'window';
}

function BookmarksComponent() {
    const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedBookmark, setSelectedBookmark] = React.useState<Bookmark | null>(null);
    const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [editingBookmarkId, setEditingBookmarkId] = React.useState<string | null>(null);
    const [bookmarkData, setBookmarkData] = React.useState({
        title: '',
        url: '',
        category: ''
    });

    const loadBookmarksdata = async () => {
        try {
            const bookmarksData = await getBookmarksdata();
            setBookmarks(bookmarksData);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
        }
    };

    // Load bookmarks on component mount
    React.useEffect(() => {
        loadBookmarksdata();
    }, []);

    // Detect current browser
    const detectCurrentBrowser = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Edg/')) return 'edge';
        if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) return 'chrome';
        return 'chrome'; // Default fallback
    };

    const currentBrowser = detectCurrentBrowser();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, bookmark: Bookmark) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedBookmark(bookmark);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedBookmark(null);
    };

    const handleAddDialogOpen = () => {
        setIsEditMode(false);
        setEditingBookmarkId(null);
        setBookmarkData({ title: '', url: '', category: '' });
        setDialogOpen(true);
    };

    const handleEditDialogOpen = () => {
        if (selectedBookmark) {
            setIsEditMode(true);
            setEditingBookmarkId(selectedBookmark.id);
            setBookmarkData({
                title: selectedBookmark.title,
                url: selectedBookmark.url,
                category: selectedBookmark.category || ''
            });
            setDialogOpen(true);
            handleMenuClose();
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setIsEditMode(false);
        setEditingBookmarkId(null);
        setBookmarkData({ title: '', url: '', category: '' });
    };

    const handleSaveBookmark = async () => {
        if (bookmarkData.title.trim() && bookmarkData.url.trim()) {
            try {
                if (isEditMode && editingBookmarkId) {
                    // Edit existing bookmark
                    console.log('Editing bookmark with ID:', editingBookmarkId);
                    await editBookmark(editingBookmarkId, {
                        title: bookmarkData.title.trim(),
                        url: bookmarkData.url.trim(),
                        category: bookmarkData.category.trim() || undefined
                    });
                } else {
                    // Add new bookmark
                    console.log('Adding new bookmark');
                    await addBookmark({
                        title: bookmarkData.title.trim(),
                        url: bookmarkData.url.trim(),
                        category: bookmarkData.category.trim() || undefined
                    });
                }
                await loadBookmarksdata();
                handleDialogClose();
            } catch (error) {
                console.error('Failed to save bookmark:', error);
            }
        }
    };

    const handleDeleteBookmark = async () => {
        if (selectedBookmark) {
            try {
                await removeBookmark(selectedBookmark.id);
                await loadBookmarksdata();
                handleMenuClose();
            } catch (error) {
                console.error('Failed to delete bookmark:', error);
            }
        }
    };

    const openBookmark = (bookmark: Bookmark, options: OpenOptions) => {
        let url = bookmark.url;
        
        // Ensure URL has protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        if (options.target === 'window') {
            // Open in new window with specific window features
            const windowFeatures = 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,location=yes,status=yes,menubar=yes';
            const newWindow = window.open(url, '_blank', windowFeatures);
            if (newWindow) {
                newWindow.focus();
            }
        } else {
            // Open in new tab
            window.open(url, '_blank', 'noopener,noreferrer');
        }

        handleMenuClose();
    };

    const getBrowserSection = (bookmark: Bookmark) => {
        const browserInfo = currentBrowser === 'edge' 
            ? { key: 'edge' as const, label: 'Edge', icon: <EdgeIcon /> }
            : { key: 'chrome' as const, label: 'Chrome', icon: <ChromeIcon /> };

        return (
            <Box className="browser-section">
                <Box className="browser-icon-container">
                    {browserInfo.icon}
                    <Typography variant="caption" sx={{ 
                        mt: 1, 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 600
                    }}>
                        {browserInfo.label}
                    </Typography>
                </Box>
                <Box className="options-container">
                    <Grid container spacing={2} className="options-grid">
                        {/* Regular Tab */}
                        <Grid item xs={6}>
                            <Paper 
                                className="option-button"
                                onClick={() => openBookmark(bookmark, { target: 'tab' })}
                            >
                                <TabIcon className="option-icon" />
                                <Typography variant="caption" className="option-text">
                                    New Tab
                                </Typography>
                            </Paper>
                        </Grid>
                        
                        {/* Regular Window */}
                        <Grid item xs={6}>
                            <Paper 
                                className="option-button"
                                onClick={() => openBookmark(bookmark, { target: 'window' })}
                            >
                                <OpenInNewIcon className="option-icon" />
                                <Typography variant="caption" className="option-text">
                                    New Window
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    };

    return (
        <Box className="bookmarks-container">
            <div className="bookmarks-header">
                <Typography variant="h6" component="h2" className="bookmarks-title">
                    Bookmarks
                </Typography>
                <div className="bookmarks-controls">
                    <Chip 
                        size="small" 
                        label={`${bookmarks.length} bookmarks`}
                        className="count-chip"
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        className="add-bookmark-btn"
                        onClick={handleAddDialogOpen}
                    >
                        Add
                    </Button>
                </div>
            </div>

            <div className="bookmarks-content">
                {bookmarks.length > 0 ? (
                    <List className="bookmarks-list">
                        {bookmarks.map((bookmark) => (
                            <ListItem
                                key={bookmark.id}
                                disablePadding
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        aria-label="options"
                                        onClick={(e) => handleMenuOpen(e, bookmark)}
                                        className="bookmark-menu-btn"
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                className="bookmark-item"
                            >
                                <ListItemButton 
                                    onClick={() => openBookmark(bookmark, { target: 'tab' })}
                                    className="bookmark-button"
                                >
                                    <ListItemIcon>
                                        <BookmarkIcon className="bookmark-icon" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box className="bookmark-title-container">
                                                <Typography variant="subtitle1" className="bookmark-title">
                                                    {bookmark.title}
                                                </Typography>
                                                {bookmark.category && (
                                                    <Chip 
                                                        size="small" 
                                                        label={bookmark.category}
                                                        className="category-chip"
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="body2" className="bookmark-url">
                                                {bookmark.url}
                                            </Typography>
                                        }
                                        className="bookmark-text"
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <div className="no-bookmarks">
                        <BookmarkIcon className="no-bookmarks-icon" />
                        <Typography variant="body1" className="no-bookmarks-text">
                            No bookmarks yet
                        </Typography>
                        <Typography variant="caption" className="no-bookmarks-caption">
                            Click "Add" to create your first bookmark
                        </Typography>
                    </div>
                )}
            </div>

            <div className="bookmarks-footer">
                <Typography variant="caption" className="last-updated">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                </Typography>
            </div>

            {/* Options Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    className: 'browser-menu',
                    style: {
                        maxHeight: 400,
                        width: '350px',
                        padding: '20px'
                    },
                }}
            >
                {selectedBookmark && (
                    <Box>
                        <Typography variant="subtitle1" sx={{ 
                            fontWeight: 'bold', 
                            mb: 2,
                            color: 'rgba(255, 255, 255, 0.9)',
                            textAlign: 'center'
                        }}>
                            Open "{selectedBookmark.title}" in:
                        </Typography>
                        
                        <Box className="browsers-container">
                            {getBrowserSection(selectedBookmark)}
                        </Box>
                        
                        <Box sx={{ 
                            mt: 3, 
                            pt: 2, 
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            gap: 1
                        }}>
                            <Button 
                                fullWidth
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={handleEditDialogOpen}
                                sx={{ 
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}
                            >
                                Edit
                            </Button>
                            <Button 
                                fullWidth
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteBookmark}
                                sx={{ 
                                    borderColor: 'rgba(244, 67, 54, 0.5)',
                                    color: '#f44336'
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )}
            </Menu>

            {/* Add/Edit Bookmark Dialog */}
            <Dialog 
                open={dialogOpen} 
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 30, 30, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    {isEditMode ? 'Edit Bookmark' : 'Add New Bookmark'}
                    <IconButton onClick={handleDialogClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={bookmarkData.title}
                        onChange={(e) => setBookmarkData(prev => ({ ...prev, title: e.target.value }))}
                        sx={{
                            marginTop: '20px',
                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                            '& .MuiOutlinedInput-root': { 
                                color: 'rgba(255, 255, 255, 0.9)',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                                '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' }
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="URL"
                        variant="outlined"
                        value={bookmarkData.url}
                        onChange={(e) => setBookmarkData(prev => ({ ...prev, url: e.target.value }))}
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
                    <TextField
                        fullWidth
                        label="Category (Optional)"
                        variant="outlined"
                        value={bookmarkData.category}
                        onChange={(e) => setBookmarkData(prev => ({ ...prev, category: e.target.value }))}
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
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Button 
                        onClick={handleDialogClose}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSaveBookmark}
                        variant="contained"
                        disabled={!bookmarkData.title.trim() || !bookmarkData.url.trim()}
                        sx={{ 
                            background: 'rgba(33, 150, 243, 0.8)',
                            '&:hover': { background: 'rgba(33, 150, 243, 1)' }
                        }}
                    >
                        {isEditMode ? 'Update Bookmark' : 'Add Bookmark'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default BookmarksComponent;