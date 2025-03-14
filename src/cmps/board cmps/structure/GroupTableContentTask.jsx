// GroupTableContentTask.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditableText } from "@vibe/core";
import { useSelector } from "react-redux";
import { addSelectedTask, removeSelectedTask } from "../../../store/actions/taskSelect.actions";
import DynamicColumn from "./DynamicColumn";
import GroupPreRow from "./GroupPreRow";
import GroupScrollableColumns from "./GroupScrollableColumns";
import GroupStickyColumns from "./GroupStickyColumns";
import TaskDetailsTriggerCell from "./TaskDetailsTriggerCell";
import { updateBoard } from "../../../store/actions/board.actions";

const GroupTableContentTask = ({ task, group }) => {
    const selectedTasks = useSelector(storeState => storeState.taskSelectModule.selectedTasks);
    const cmpOrder = useSelector(state => state.boardModule.cmpOrder);
    const board = useSelector(state => state.boardModule.board);

    // The setNodeRef and style must remain on the root container.
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleCellUpdate = async (cmpType, value) => {
        try {
            const newBoard = { ...board };
            const groupIdx = newBoard.groups.findIndex(g => g._id === group._id);
            if (groupIdx === -1) throw new Error(`Group with id ${group._id} not found`);

            const taskIdx = newBoard.groups[groupIdx].tasks.findIndex(t => t._id === task._id);
            if (taskIdx === -1) throw new Error(`Task with id ${task._id} not found`);

            newBoard.groups[groupIdx].tasks[taskIdx][cmpType] = value;

            await updateBoard(newBoard);
        } catch (error) {
            console.error("Error updating task cell:", error);
        }
    };

    async function handleChangeSelect(ev, groupId, taskId) {
        if (ev.target.checked) {
            await addSelectedTask(groupId, taskId);
        } else {
            await removeSelectedTask(groupId, taskId);
        }
    }

    const handleChangeTitle = async (taskTitle) => {
        try {
            const newBoard = { ...board };
            const groupIdx = newBoard.groups.findIndex(g => g._id === group._id);
            if (groupIdx === -1) throw new Error(`Group with id ${group._id} not found`);

            const taskIdx = newBoard.groups[groupIdx].tasks.findIndex(t => t._id === task._id);
            if (taskIdx === -1) throw new Error(`Task with id ${task._id} not found`);

            newBoard.groups[groupIdx].tasks[taskIdx].taskTitle = taskTitle;

            await updateBoard(newBoard);
        } catch (error) {
            console.error("Error updating task title:", error);
        }
    };

    function isTaskSelected(groupId = "", taskId = "") {
        const groupSelected = selectedTasks.find(selectedGroups => selectedGroups.groupId === groupId);
        if (!groupSelected) return false;
        return groupSelected.tasks.includes(taskId);
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            role="listitem"
            className="table-task-row"
        >
            <GroupStickyColumns>
                <GroupPreRow
                    crudlType="task"
                    isChecked={isTaskSelected(group._id, task._id)}
                    onCheckBox={(ev) => handleChangeSelect(ev, group._id, task._id)}
                    group={group}
                    task={task}
                />
                <div className="min-table-cell table-cell-first-column task-title default-cell-color"
                    {...attributes}
                    {...listeners}
                >
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onDragStart={(e) => e.stopPropagation()}
                    >
                        <EditableText
                            type="text2"
                            onChange={handleChangeTitle}
                            value={task.taskTitle}
                        />
                    </div>
                    <TaskDetailsTriggerCell task={task} />
                </div>
            </GroupStickyColumns>
            <GroupScrollableColumns>
                {cmpOrder.map(cmpType =>
                    <DynamicColumn
                        key={cmpType}
                        cmpType={cmpType}
                        info={task[cmpType]}
                        allMembers={cmpType === 'members' ? task['allMembers'] : ''}
                        onTaskUpdate={(value) => handleCellUpdate(cmpType, value)}
                    />
                )}
            </GroupScrollableColumns>
        </div>
    );
};

export default GroupTableContentTask;
