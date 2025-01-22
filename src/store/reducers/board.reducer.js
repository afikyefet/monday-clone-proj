export const SET_BOARDS = 'SET_BOARDS';
export const SET_BOARD = 'SET_BOARD';
export const REMOVE_BOARD = 'REMOVE_BOARD';
export const ADD_BOARD = 'ADD_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';

export const ADD_GROUP = 'ADD_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';
export const REMOVE_GROUP = 'REMOVE_GROUP';

export const SET_TASK = 'SET_TASK';
export const ADD_TASK = 'ADD_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';

export const SET_CMP_ORDER = 'SET_CMP_ORDER';

export const SET_SELECTED_TASK = 'SET_SELECTED_TASK';
export const ADD_SELECTED_TASK = 'ADD_SELECTED_TASK';
export const REMOVE_SELECTED_TASK = 'REMOVE_SELECTED_TASK';

const initialState = {
    boards: [],
    board: null,
    selectedTasks: [],
    lastRemovedBoard: null,
    statusLabels: [],
    priorityLabels: [],
    cmpOrder: []
};

export function boardReducer(state = initialState, action) {
    let newState = state;
    let boards;
    switch (action.type) {
        case SET_BOARDS:
            newState = {
                ...state,
                boards: action.boards || []
            };
            break;

        case SET_BOARD:
            newState = {
                ...state,
                board: action.board || { groups: [] }
            };
            break;

        case REMOVE_BOARD:
            const lastRemovedBoard = state.boards.find(board => board._id === action.boardId);
            boards = state.boards.filter(board => board._id !== action.boardId);
            newState = {
                ...state,
                boards,
                lastRemovedBoard
            };
            break;

        case ADD_BOARD:
            newState = {
                ...state,
                boards: [...state.boards, action.board]
            };
            break;

        case UPDATE_GROUP:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    groups: (state.board.groups || []).map(group =>
                        group._id === action.group._id ? action.group : group
                    )
                }
            };
            break;

        case ADD_GROUP:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    groups: [...(state.board.groups || []), action.group]
                }
            };
            break;

        case UPDATE_GROUP:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    groups: (state.board.groups || []).map(group =>
                        group._id === action.group._id ? action.group : group
                    )
                }
            };
            break;

        case REMOVE_GROUP:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    groups: (state.board.groups || []).filter(
                        group => group._id !== action.groupId
                    )
                }
            };
            break;

        case ADD_TASK:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    groups: (state.board.groups || []).map(group =>
                        group._id === action.groupId
                            ? {
                                ...group,
                                tasks: [...(group.tasks || []), action.task]
                            }
                            : group
                    )
                }
            };
            break;

        case UPDATE_TASK:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    groups: (state.board.groups || []).map(group =>
                        group._id === action.groupId
                            ? {
                                ...group,
                                tasks: (group.tasks || []).map(task =>
                                    task._id === action.task._id ? action.task : task
                                )
                            }
                            : group
                    )
                }
            };
            break;

        case REMOVE_TASK:
            newState = {
                ...state,
                board: {
                    ...state.board,
                    groups: (state.board.groups || []).map(group =>
                        group._id === action.groupId
                            ? {
                                ...group,
                                tasks: (group.tasks || []).filter(
                                    task => task._id !== action.taskId
                                )
                            }
                            : group
                    )
                }
            };
            break;

        case SET_CMP_ORDER:
            newState = {
                ...state,
                cmpOrder: action.cmpOrder
            };
            break;

        case SET_SELECTED_TASK:
            newState = {
                ...state,
                selectedTasks: action.selectedTasks
            };
            break;

        case ADD_SELECTED_TASK: {
            const groupId = action.groupId;
            const taskId = action.taskId;
            const existingGroupIndex = state.selectedTasks?.findIndex(
                item => item.groupId === groupId
            );

            if (existingGroupIndex === -1) {
                const newGroup = {
                    groupId,
                    tasks: [taskId]
                };

                return {
                    ...state,
                    selectedTasks: [...state.selectedTasks, newGroup]
                };
            } else {
                const existingGroup = state.selectedTasks[existingGroupIndex];

                if (existingGroup.tasks.includes(taskId)) {
                    return state;
                } else {
                    const updatedGroup = {
                        ...existingGroup,
                        tasks: [...existingGroup.tasks, taskId]
                    };

                    const updatedSelectedTasks = [...state.selectedTasks];
                    updatedSelectedTasks[existingGroupIndex] = updatedGroup;
                    return {
                        ...state,
                        selectedTasks: updatedSelectedTasks
                    };
                }
            }
        }

        case REMOVE_SELECTED_TASK: {
            const groupId = action.groupId;
            const taskId = action.taskId;
            const existingGroupIndex = state.selectedTasks.findIndex(
                item => item.groupId === groupId
            );

            if (existingGroupIndex === -1) {
                return state;
            }

            const existingGroup = state.selectedTasks[existingGroupIndex];
            const updatedTasks = existingGroup.tasks.filter(task => task !== taskId);

            if (updatedTasks.length === 0) {
                return {
                    ...state,
                    selectedTasks: state.selectedTasks.filter(
                        item => item.groupId !== groupId
                    )
                };
            }

            const updatedGroup = {
                ...existingGroup,
                tasks: updatedTasks
            };

            const updatedSelectedTasks = [...state.selectedTasks];
            updatedSelectedTasks[existingGroupIndex] = updatedGroup;
            return {
                ...state,
                selectedTasks: updatedSelectedTasks
            };
        }

        default:
            break;
    }
    return newState;
}
