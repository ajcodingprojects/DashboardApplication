import * as React from 'react';
import './TodoCreateComponent.css';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import dayjs, { Dayjs } from 'dayjs';

import Priority from '../Classes/Priority.ts';
import TodoItem from '../Classes/TodoItem.ts';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body1,
    padding: theme.spacing(2.5),
    textAlign: 'start',
    color: (theme.vars ?? theme).palette.text.secondary,
    flexGrow: 1,
    ...theme.applyStyles('dark', {
        backgroundColor: '#101017',
    }),
}));

interface TodoCreateComponentProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSave: (todoItem: TodoItem) => void;
    initialTodoItem?: TodoItem;
}

function TodoCreateComponent({ open, setOpen, onSave, initialTodoItem }: TodoCreateComponentProps) {
    const [doneByDate, setDoneByDate] = React.useState<Dayjs | null>(dayjs());
    const [doneBySwitch, setDoneBySwitch] = React.useState(false);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [priority, setPriority] = React.useState(Priority.Reminder);

    // Initialize form with initial values if provided
    React.useEffect(() => {
        if (initialTodoItem) {
            setName(initialTodoItem.name);
            setPriority(initialTodoItem.priority);
            setDescription(initialTodoItem.description);
            setDoneBySwitch(initialTodoItem.doneBy !== undefined);
            setDoneByDate(initialTodoItem.doneBy ? dayjs(initialTodoItem.doneBy) : dayjs());
        } else {
            // Reset form for new todo
            setName('');
            setPriority(Priority.Reminder);
            setDescription('');
            setDoneBySwitch(false);
            setDoneByDate(dayjs());
        }
    }, [initialTodoItem, open]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSwitch = (checked: boolean) => {
        setDoneBySwitch(checked);
    };

    const handleSave = () => {
        const todoItem = new TodoItem(
            priority,
            name,
            description,
            initialTodoItem?.created || new Date(),
            doneBySwitch ? doneByDate?.toDate() : undefined
        );

        onSave(todoItem);
        setOpen(false);
    };

    const isFormValid = name.trim() !== '';

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            slots={{
                transition: Transition,
            }}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        <RegTextInput
                            value={name}
                            setValue={setName}
                            title={initialTodoItem ? 'Edit Task Name' : 'New Task Name'}
                        />
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        onClick={handleSave}
                        disabled={!isFormValid}
                    >
                        {initialTodoItem ? 'Update' : 'Create'}
                    </Button>
                </Toolbar>
            </AppBar>

            <Stack
                className='stack-area'
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Item>
                    <SelectMenu value={priority} setValue={setPriority} title='Priority' />
                </Item>

                <Item>
                    <MultilineTextInput value={description} setValue={setDescription} title='Description' />
                </Item>

                <Item>
                    <div>
                        <FormControlLabel
                            label={doneBySwitch ? 'Set completion date' : 'No required completion date'}
                            control={
                                <Switch
                                    checked={doneBySwitch}
                                    onChange={(e) => handleSwitch(e.target.checked)}
                                    slotProps={{ input: { 'aria-label': 'controlled' } }}
                                />
                            }
                        />
                    </div>
                    <MyDatePicker
                        id_end='done-by'
                        class_args={doneBySwitch ? '' : 'hide-area'}
                        value={doneByDate ?? dayjs()}
                        setValue={setDoneByDate}
                        label='Select date to be completed by'
                    />
                </Item>
            </Stack>
        </Dialog>
    );
}

export default TodoCreateComponent;

function MyDatePicker({ value, setValue, label, id_end, class_args }) {
    return (
        <div id={'date-selector-' + id_end} className={class_args}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={label}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
            </LocalizationProvider>
        </div>
    );
}

function MultilineTextInput({ value, setValue, title }) {
    return (
        <TextField
            className='multiline-text'
            id={title.toLowerCase().replace(' ', '-') + '-large-input'}
            label={title}
            multiline
            rows={6}
            placeholder={'Enter ' + title + ' here'}
            variant="filled"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

function RegTextInput({ value, setValue, title }) {
    return (
        <TextField
            id={title.toLowerCase().replace(' ', '-') + '-reg-input'}
            placeholder={'Enter ' + title + ' here'}
            label={title}
            variant="filled"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

function SelectMenu({ value, setValue, title }) {
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id={title.toLowerCase().replace(' ', '-') + "select-menu-label"}>{title}</InputLabel>
                <Select
                    labelId={title.toLowerCase().replace(' ', '-') + "select-menu-label"}
                    id={title.toLowerCase().replace(' ', '-') + "select-menu"}
                    value={value}
                    onChange={handleChange}
                    label={title}
                >
                    <MenuItem value={Priority.Low}>Low</MenuItem>
                    <MenuItem value={Priority.Medium}>Medium</MenuItem>
                    <MenuItem value={Priority.High}>High</MenuItem>
                    <MenuItem value={Priority.ASAP}>ASAP</MenuItem>
                    <MenuItem value={Priority.Reminder}>Reminder</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}