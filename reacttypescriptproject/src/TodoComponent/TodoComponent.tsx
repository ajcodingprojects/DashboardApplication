import * as React from 'react';
import './TodoComponent.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';

import TodoItem from '../Classes/TodoItem.ts';
import TodoDialogComponent from '../TodoDialogComponent/TodoDialogComponent.tsx';
import { getTodos, editTodos, addTodo, removeTodo } from '../Connectors/TodoBackend.ts'
import Priority from '../Classes/Priority.ts';
import TodoCreateComponent from '../TodoCreateComponent/TodoCreateComponent.tsx';
import TodoRemoveComponent from '../TodoRemoveComponent/TodoRemoveComponent.tsx';

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
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function TodoComponent({ progressControl }) {

    const [todoList, setTodoList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(new TodoItem());

    React.useEffect(() => {
        getTodos(setTodoList);
    }, []);

    const setTodoItem = async (priority: Priority, name: string, description: string, doneBy: Date | undefined) => {
        progressControl(true);
        const itemReplacement: TodoItem = new TodoItem(priority, name, description, currentItem.created, doneBy);
        await editTodos(currentItem.name, itemReplacement);
        setCurrentItem(itemReplacement);
        await getTodos(setTodoList);
        progressControl(false);
    }

    const getPriorityClassName = (priority: Priority): string => {
        switch (priority) {
            case Priority.ASAP:
                return 'priority-asap';
            case Priority.High:
                return 'priority-high';
            case Priority.Medium:
                return 'priority-medium';
            case Priority.Low:
                return 'priority-low';
            case Priority.Reminder:
                return 'priority-reminder';
            default:
                return '';
        }
    };

  return (
      <>
          <div className='table-top'>
            <p>Todo List</p>
              <Button className='new-task-btn' variant="outlined" color="success" onClick={ () => setCreateDialogOpen(true) }>
                Create New Task
            </Button>
          </div>
          <TableContainer component={Paper}>
              <Table sx={{ minWidth: '97%%' }}>
                  <TableHead>
                      <TableRow>
                          <StyledTableCell>Priority</StyledTableCell>
                          <StyledTableCell align="left">Task</StyledTableCell>
                          <StyledTableCell align="right">Complete By</StyledTableCell>
                          <StyledTableCell align="right">Created On</StyledTableCell>
                          <StyledTableCell align="center">Actions</StyledTableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {todoList.length > 0 ? (
                          todoList.map((item: TodoItem) => (
                              <StyledTableRow
                                  key={item.name}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                  <StyledTableCell align="left" className={getPriorityClassName(item.priority)}>
                                      {item.priority}
                                  </StyledTableCell>
                                  <StyledTableCell component="th" scope="row">
                                      {item.name}
                                  </StyledTableCell>

                                  <StyledTableCell align="right">{item.doneBy?.toLocaleDateString() ?? ''}</StyledTableCell>
                                  <StyledTableCell align="right">{item.created.toLocaleDateString()}</StyledTableCell>
                                  <StyledTableCell align="center">
                                      <Fab color="primary" aria-label="view" size='small' className='view-btn' onClick={() => { setCurrentItem(item); setOpen(true) } }>
                                          <VisibilityIcon />
                                      </Fab>
                                      <Fab color="error" aria-label="remove" size='small' className='remove-btn' onClick={() => { setCurrentItem(item); setRemoveDialogOpen(true) }}>
                                          <DeleteIcon />
                                      </Fab>

                                  </StyledTableCell>
                                  
                              </StyledTableRow>
                          ))
                      ) : (
                          <StyledTableRow>
                              <StyledTableCell colSpan={5} className="no-todos-row">
                                  No todos
                              </StyledTableCell>
                          </StyledTableRow>
                      )}
                  </TableBody>
              </Table>
          </TableContainer>
          <TodoDialogComponent open={open} setOpen={setOpen} todoItem={currentItem} setTodoItem={setTodoItem} />
          <TodoCreateComponent
              open={createDialogOpen}
              setOpen={setCreateDialogOpen}
              onSave={async (newTodo) => {
                  progressControl(true);
                  await addTodo(newTodo);
                  await getTodos(setTodoList);
                  progressControl(false);
                  setCreateDialogOpen(false);
              }}
          />
          <TodoRemoveComponent open={removeDialogOpen} setOpen={setRemoveDialogOpen} name={currentItem.name} setTodoList={setTodoList} progressControl={progressControl} />
      </>
  );
}

export default TodoComponent;    

