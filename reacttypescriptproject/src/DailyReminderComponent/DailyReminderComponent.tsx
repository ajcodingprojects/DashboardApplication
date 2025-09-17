import * as React from 'react';
import './DailyReminderComponent.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

interface Reminder {
    id: string;
    time: string; // "11:00 AM"
    event: string;
    days: number[]; // 0 = Sunday, 1 = Monday, etc.
}

const reminders: Reminder[] = [
    {
        id: 'tech-dev-meeting',
        time: '8:30 AM',
        event: 'Technology Dev Team Meeting',
        days: [5] //  Friday only
    },
    {
        id: 'company-meeting',
        time: '9:30 AM',
        event: 'Company Meeting',
        days: [3] // Wednesday only
    },
    {
        id: 'standup',
        time: '11:00 AM',
        event: 'Daily Standup Meeting',
        days: [1, 2, 3, 4] // Monday to Thursday
    },
    {
        id: 'one-on-one-meeting',
        time: '2:30 PM',
        event: '1:1 With Brent',
        days: [5] // Friday only
    },
    {
        id: 'timesheet',
        time: '3:00 PM',
        event: 'Submit Weekly Timesheet',
        days: [5] // Friday only
    }
];

function DailyReminderComponent(): React.JSX.Element {
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [currentDay, setCurrentDay] = React.useState(new Date().toDateString());

    React.useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            
            // Check if it's a new day
            const today = now.toDateString();
            if (today !== currentDay) {
                setCurrentDay(today);
            }
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [currentDay]);

    const getTodaysReminders = (): Reminder[] => {
        const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        return reminders.filter(reminder => reminder.days.includes(today));
    };

    const parseTime = (timeString: string): Date => {
        const today = new Date();
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    };

    const shouldShowReminder = (timeString: string): boolean => {
        const now = currentTime;
        const targetTime = parseTime(timeString);
        
        // If the target time is in the future (later today), show it
        if (targetTime >= now) {
            return true;
        }
        
        // If the target time has passed today, only show if it's within the last 10 minutes
        const timeDiff = now.getTime() - targetTime.getTime();
        const minutesPassedSince = timeDiff / (1000 * 60);
        return minutesPassedSince <= 10;
    };

    const getTimeUntil = (timeString: string): string => {
        const now = currentTime;
        const targetTime = parseTime(timeString);
        
        const diff = targetTime.getTime() - now.getTime();
        
        if (diff < 0) {
            // Event has passed, show how long ago it was (should only be within 10 minutes due to filtering)
            const minutesAgo = Math.abs(diff) / (1000 * 60);
            const roundedMinutes = Math.floor(minutesAgo);
            return `${roundedMinutes}m ago`;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return 'Now';
        }
    };

    const todaysReminders = getTodaysReminders();
    const activeReminders = todaysReminders.filter(reminder => shouldShowReminder(reminder.time));

    return (
        <>
            <div className='table-top'>
                <p>Daily Reminders</p>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: '97%' }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ width: '15%' }}>Time</StyledTableCell>
                            <StyledTableCell sx={{ width: '60%' }}>Event</StyledTableCell>
                            <StyledTableCell align="right" sx={{ width: '25%' }}>Time Until</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activeReminders.length > 0 ? (
                            activeReminders.map((reminder) => (
                                <StyledTableRow key={reminder.id}>
                                    <StyledTableCell className="time-cell">
                                        {reminder.time}
                                    </StyledTableCell>
                                    <StyledTableCell className="event-cell">
                                        {reminder.event}
                                    </StyledTableCell>
                                    <StyledTableCell align="right" className="countdown-cell">
                                        {getTimeUntil(reminder.time)}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={3} className="no-reminders-row">
                                    No other daily reminders
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default DailyReminderComponent;