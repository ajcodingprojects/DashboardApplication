import * as React from 'react';
import './DashboardCard.css';

import Card from '@mui/material/Card';

interface DashboardCardProps {
    innerContent: React.ReactNode;
    addClass?: string;
}

function DashboardCard({ innerContent, addClass = '' }: DashboardCardProps) {
    const [cardHeight, setCardHeight] = React.useState(400);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);
    const startY = React.useRef(0);
    const startHeight = React.useRef(0);

    const isNotesCard = addClass.includes('notes-display');

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isNotesCard) return;
        
        e.preventDefault();
        isDragging.current = true;
        startY.current = e.clientY;
        startHeight.current = cardHeight;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        
        const deltaY = e.clientY - startY.current;
        const newHeight = Math.max(350, Math.min(800, startHeight.current + deltaY));
        setCardHeight(newHeight);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    React.useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const cardStyle = isNotesCard ? { 
        height: `${cardHeight}px`,
        maxHeight: 'none',
        minHeight: '350px'
    } : {};

    return (
        <>
            <Card 
                ref={cardRef}
                className={`dashboard-card ${addClass}`}
                style={cardStyle}
            >
                {innerContent}
                {isNotesCard && (
                    <div 
                        className="resize-handle-custom"
                        onMouseDown={handleMouseDown}
                        title="Drag to resize vertically"
                    />
                )}
            </Card>
        </>
    );
}

export default DashboardCard;