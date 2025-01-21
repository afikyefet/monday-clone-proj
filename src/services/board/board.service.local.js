
import { storageService } from '../async-storage.service';
import { makeId } from '../util.service';
import { dummyData } from './dummy-data';
import { groupService } from './group.service.local';
import { taskService } from './task.service.local';


const STORAGE_KEY = 'boardDB'

export const boardService = {
    query,
    getById,
    save,
    remove,
    STORAGE_KEY,
    getEmptyTask,
    addBoardMsg
}

_checkForDummyData();

// Dummy data feeder
async function _checkForDummyData() {
    let boards = await boardService.query();

    if (!boards || boards.length === 0) {
        storageService._save(boardService.STORAGE_KEY, dummyData.defaultBoards)

        boards = dummyData.defaultBoards
    }

    let groups = await groupService._query();

    if (!groups || groups.length === 0) {
        storageService._save(groupService.STORAGE_KEY, dummyData.defaultGroups)

        groups = dummyData.defaultGroups

        boards.forEach(board => board.groups = groups.filter(group => group.boardId === board._id))
    }

    let tasks = await taskService._query();

    if (!tasks || tasks.length === 0) {
        storageService._save(taskService.STORAGE_KEY, dummyData.defaultTasks)

        tasks = dummyData.defaultTasks

        groups.forEach(group => group.tasks = tasks.filter(task => task.groupId === group._id))
    }
}

async function query(filterBy = { name: '' }) {
    var boards = await storageService.query(STORAGE_KEY) || [];

    const { name } = filterBy;

    if (name) {
        return boards.filter(board => name.toLowerCase().includes(board.name.toLowerCase()))
    }

    return boards
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
        .then(async board => {
            let groups = [];
            let tasks = [];

            groups = await groupService.getByBoardId(boardId);
            tasks = await taskService.getByGroupId(boardId);

            board.groups = groups;
            board.tasks = tasks;

            return board;
        })
}

async function remove(boardId) {
    await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
    let savedBoard
    if (board._id) {
        const boardToSave = {
            _id: board._id,
            name: board.name,
            color: board.color,
            groups: board.groups,
        }
        savedBoard = await storageService.put(STORAGE_KEY, boardToSave)
    } else {
        const boardToSave = {
            name: board.name,
            color: board.color,
            groups: [],
        }
        savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
    }
    return savedBoard
}

function getEmptyTask() {
    return {
        _id: makeId(4),
        side: null,
        taskTitle: "New task",
        members: [
        ],
        date: "",
        status: "",
        priority: "",
    }
}

async function addBoardMsg(boardId, txt) {
    // Later, this is all done by the backend
    const board = await getById(boardId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    board.msgs.push(msg)
    await storageService.put(STORAGE_KEY, board)

    return msg
}