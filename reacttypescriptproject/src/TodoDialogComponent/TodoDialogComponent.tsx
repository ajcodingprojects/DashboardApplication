import * as React from 'react';
import './TodoDialogComponent.css';

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

import dayjs, { Dayjs } from 'dayjs';

import Priority from '../Classes/Priority.ts';
import TodoItem from '../Classes/TodoItem.ts';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

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

function TodoDialogComponent({ open, setOpen, todoItem = new TodoItem(), setTodoItem }) {
    const [edit, setEdit] = React.useState(false);
    const [doneByDate, setDoneByDate] = React.useState<Dayjs | null>(dayjs());
    const [doneBySwitch, setDoneBySwitch] = React.useState(false);
    const [newName, setNewName] = React.useState('');
    const [newDesc, setNewDesc] = React.useState('');
    const [newPrior, setNewPrior] = React.useState(Priority.Reminder);

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
    };

    const handleSwitch = (checked: boolean) => {
        setDoneBySwitch(checked);
    }

    const handleSaveOrEdit = () => {
        if (!edit) {
            setNewName(todoItem.name);
            setNewPrior(todoItem.priority);
            setNewDesc(todoItem.description);
            setDoneBySwitch(todoItem.doneBy == undefined ? false : true);
            setDoneByDate(todoItem.doneBy ? dayjs(todoItem.doneBy) : null);
            setEdit(true);
            setDisplayDateSelector();

        } else {
            //handle saving here
            setTodoItem(newPrior, newName, newDesc, doneBySwitch ? doneByDate?.toDate() : undefined);

            setEdit(false);
        }
    }

    function setDisplayDateSelector() {
        let dateSelectorCL = document.getElementById('date-selector-done-by')?.classList;
        console.log(dateSelectorCL)
        if (dateSelectorCL) {
            if (doneBySwitch)
                dateSelectorCL.add('hide-area');
            else
                dateSelectorCL.remove('hide-area');
        }
    }

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
                     
                      {
                          !edit ?
                              <span>Task: {todoItem.name} </span>
                              :
                              <RegTextInput value={newName} setValue={setNewName} title='Task Name' />
                      }
                      
                  </Typography>
                  <Button hidden autoFocus color="inherit" onClick={handleSaveOrEdit}>
                      { edit ? 'save' : 'edit' }
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
                  
                  {
                      !edit ?
                        <>
                            <h3>Priority:</h3>
                            <span className='tabbed-section'>{todoItem.priority}</span>
                          </>
                          :
                          <SelectMenu value={newPrior} setValue={setNewPrior} title='Priority' />
                  }

              </Item>
              <Item>

                  {
                      !edit ?
                          <>
                              <h3>Description:</h3>
                              {
                                  todoItem.description.split('\n').map((part, idx) => {
                                      return (
                                          <div key={'desc-div-' + idx}>
                                              <span key={'desc-span-' + idx} className='tabbed-section'>{part}</span>
                                              <br key={'desc-br-' + idx} />
                                          </div>
                                      )
                                  })
                              }
                              
                          </>
                          :
                          <MultilineTextInput value={newDesc} setValue={setNewDesc} title='Description' />
                  }

              </Item>
              <Item>

                  {
                    !edit ?
                          <span>
                            <h3>Needs to Be Completed By:</h3>
                            <span className='tabbed-section'>{todoItem.doneBy?.toLocaleDateString() ?? 'N/A'}</span>
                        </span>
                        :
                          <span>
                              <div>
                                  <FormControlLabel label={doneBySwitch ? 'Toggle completion date' : 'No required completion date'}
                                      control={
                                          <Switch
                                              checked={doneBySwitch}
                                              onChange={(e) => handleSwitch(e.target.checked)}
                                              slotProps={{ input: { 'aria-label': 'controlled' } }}
                                          />
                                      }
                                  />
                              </div>
                              <MyDatePicker id_end='done-by' class_args={doneBySwitch ? '' : 'hide-area'} value={doneByDate ?? dayjs()} setValue={setDoneByDate} label='Select date to be completed by' />
                        </span>
                  }
                  
              </Item>
              <Item>
                  <h3>Task Created On:</h3>
                  <span>
                      <span className='tabbed-section'>{todoItem.created?.toLocaleDateString()}</span>
                      <br />
                      <span className='tabbed-section'>{todoItem.created?.toLocaleTimeString()}</span>
                  </span>
              </Item>
          </Stack>
      </Dialog>
  );
}

export default TodoDialogComponent;

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
            onChange={(e) => setValue(e.target.value) }
        />
    )
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
    )
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
    )
}
