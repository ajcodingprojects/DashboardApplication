import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { getTodos, removeTodo } from '../Connectors/TodoBackend.ts';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

const innerStyle = {
    display: 'flex',
    flexDirection: 'column',
    mt: 2
};

export default function TodoRemoveComponent({ open, setOpen, name, setTodoList, progressControl }) {
    const handleClose = () => setOpen(false);

    const handleRemove = async () => {
        progressControl(true);
        await removeTodo(name);
        await getTodos(setTodoList);
        setOpen(false);
        progressControl(false);
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure?
                    </Typography>
                    <Typography id="modal-modal-description" sx={innerStyle}>
                        <div>Do you really want to delete <b>"{name}"</b>?<br/>This process cannot be undone.</div>
                        <Button sx={{ marginInline: 'auto', marginTop: '15px' }} variant="contained" color="error" onClick={() => handleRemove()}>
                            Remove
                        </Button>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}