import {
    Button, Dialog, DialogContentContainer, Divider, Icon,
    ListItem, Menu, MenuButton, MenuDivider, MenuItem, MenuTitle, Search
} from "@vibe/core";
import {
    AddSmall, Board,
    Delete,
    Duplicate, Edit, ExternalPage, Favorite
} from "@vibe/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addBoard, addGroup, addTask, getBoardById, removeBoard, setBoard } from "../../../store/actions/board.actions";
import { AddBoardCmp } from "../AddBoardCmp";
import WorkspacesDropdown from "./WorkspacesDropdown";
import WorkspaceTitle from "./WorkspaceTitle";

export function BoardNav({ boards, location, handleNavigate, isSearch, setIsSearch,
}) {

    const board = useSelector(store => store.boardModule.board)

    const [isOpen, setIsOpen] = useState(false)
    const [isAddBoard, setIsAddBoard] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [selectedBoard, setSelectedBoard] = useState("Main Board")
    const [addedBoard, setAddedBoard] = useState({ name: '' })
    const [isDuplicate, setIsDuplicate] = useState(false)

    const handleCloseModal = () => {
        setIsAddBoard(false)
        setIsDuplicate(false)
        setAddedBoard({ name: '' })
    }

    const handleShowModal = () => {
        return isAddBoard
    }

    const openBoardLink = (boardId) => {
        const currentUrl = window.location.origin
        const newUrl = `${currentUrl}/board/${boardId}`
        window.open(newUrl, '_blank', 'noopener,noreferrer');
    };

    const handleSelect = (board) => {
        setSelectedBoard(board.name);
        setIsOpen(false);
        handleNavigate(`/board/${board._id}`);
    };


    async function handleAddBoard() {
        const newBoard = { name: addedBoard.name, _id: undefined }
        return addBoard(newBoard)
            .then((savedboard) => {
                console.log(`Board added: ${addedBoard.name}`);
                handleCloseModal();
                return savedboard
            })
    }

    async function handleDuplicateBoard() {
        try {
            return addBoard(newBoard)
                .then(async (savedboard) => {
                    console.log(`Board duplicated: ${name}`);
                    const prevBoard = { ...board }
                    setBoard(savedboard)
                    for (const group of prevBoard.groups) {
                        const newGroup = { ...group, _id: undefined }
                        await addGroup(savedboard._id, newGroup)
                            .then((async savedGroup => {
                                for (const task of group.tasks) {
                                    const newTask = { ...task, _id: undefined }
                                    await addTask(savedGroup._id, newTask)
                                }
                            }))
                    }
                })
                .finally(() => {
                    handleCloseModal();
                })
        } catch (error) {
            console.error('Could not duplicate board' + error);
        }
    }

    function openDuplicateModal(boardName, boardId) {
        setAddedBoard(addedBoard => addedBoard = { name: "Duplicate of " + boardName, _id: boardId })
        console.log(addedBoard);

        setIsAddBoard(true)
    }

    async function onDuplicateBoard() {
        try {
            getBoardById(addedBoard._id)
                .then(boardToDuplicate => {
                    return addBoard({ ...boardToDuplicate, _id: undefined, name: addedBoard.name })
                        .then(duplicatedBoard => {
                            return boardToDuplicate.groups.reduce((groupChain, group) => {
                                return groupChain.then(() => {
                                    const newGroup = { ...group, _id: undefined }
                                    return addGroup(duplicatedBoard._id, newGroup)
                                        .then(savedGroup => {
                                            return group.tasks.reduce((taskChain, task) => {
                                                return taskChain.then(() => {
                                                    const newTask = { ...task, _id: undefined }
                                                    return addTask(savedGroup._id, newTask)
                                                })
                                            }, Promise.resolve())
                                        })
                                })
                            }, Promise.resolve())
                                .then(() => duplicatedBoard)
                        })
                })
                .catch(error => {
                    console.error('Could not duplicate board', error)
                })
        } catch (error) {
            console.error('Could not duplicate board' + error)
        } finally {
            handleCloseModal()
        }
    }

    function onRemoveBoard(boardId) {
        try {
            return removeBoard(boardId)
        } catch (error) {
            console.error('Could not remove board' + error);

        }
    }

    function onRenameBoard() {

    }

    function onAddBoardToFavorite() {

    }



    const filteredBoards = boards.filter((board) =>
        board.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    return (
        <>
            <section className="workspaces-nav">
                <Dialog
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    width={300}
                    title="Select a Board"
                    showTrigger={[]}
                    position="bottom"
                    content={
                        <DialogContentContainer className="dialog-container">
                            <Search
                                placeholder="Search for a board"
                                size="small"
                                value={searchValue}
                                onChange={(val) => setSearchValue(val)}
                            />
                            <Menu>
                                <MenuTitle caption="My board" />
                                {filteredBoards.map((board) => (
                                    <MenuItem
                                        key={board._id}
                                        className={
                                            location.pathname === `/board/${board._id}` ? "active" : ""
                                        }
                                        title={board.name}
                                        icon={Board}
                                        onClick={() => handleSelect(board)}
                                    />
                                ))}
                            </Menu>
                            <Divider style={{ marginTop: "8px", marginBottom: "8px" }} />
                            <Button kind="tertiary" size="small" onClick={() => setIsAddBoard(true)}>
                                <Icon icon={AddSmall} />
                                Add Board
                            </Button>
                        </DialogContentContainer>
                    }
                >
                    <WorkspaceTitle setIsSearch={setIsSearch} isSearch={isSearch} />
                    <WorkspacesDropdown
                        selectedBoard={selectedBoard}
                        onToggleModal={() => setIsAddBoard(true)}
                        isBoardMenuOpen={isOpen}
                        toggleBoardMenu={() => setIsOpen(prev => !prev)}
                    />
                </Dialog>
            </section>

            <div className="board-nav">
                {boards.map((board) => (
                    <ListItem
                        key={board._id}
                        className={location.pathname === `/board/${board._id}` ? "active board-item" : "board-item"}
                        title={board.name}
                        icon={Board}
                        onClick={() => handleSelect(board)}
                    >
                        <span className="board-name-nav">{board.name}</span>
                        <MenuButton onClick={(e) => e.stopPropagation()} className="board-crudl" size="xs">
                            <Menu id="menu" size={Menu.sizes.MEDIUM}>
                                <MenuItem icon={ExternalPage} onClick={() => openBoardLink(board._id)} iconType="svg" title="Open in new tab" />
                                <MenuDivider />
                                <MenuItem onClick={() => openDuplicateModal(board.name, board._id)} icon={Duplicate} title="Duplicate board" />
                                <MenuItem onClick={() => onRemoveBoard(board._id)} icon={Delete} title="Delete board" />
                                <MenuItem icon={Edit} title="Rename board" />
                                <MenuDivider />
                                <MenuItem icon={Favorite} title="Add to favorite" />
                            </Menu>
                        </MenuButton>

                    </ListItem>
                ))}
            </div>
            <AddBoardCmp
                addedBoard={addedBoard}
                setAddedBoard={setAddedBoard}
                onDuplicateBoard={onDuplicateBoard}
                handleAddBoard={handleAddBoard}
                show={isAddBoard}
                onClose={handleCloseModal}
            />
        </>
    );
}
