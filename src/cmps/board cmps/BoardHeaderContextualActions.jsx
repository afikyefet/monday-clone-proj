import { Button, Flex, Icon, MenuButton, MenuItem, SplitButton, SplitButtonMenu } from "@vibe/core"
import { Filter, Group, Person, Search, Show, Sort } from "@vibe/icons"
import { BoardFilter } from "./BoardFilter/BoardFilter"
import { BoardSort } from "./BoardSort/BoardSort"

const BoardHeaderContextualActions = ({ onAddGroup, onAddTask }) => {
    return <Flex className="action" gap="small" align="center">
        <SplitButton children="New task"
            size="small"
            dialogPaddingSize="small"
            onClick={onAddTask}
            secondaryDialogContent={
                <SplitButtonMenu id="split-menu">
                    <MenuItem onClick={onAddGroup} icon={Group} title="New group of tasks" />
                </SplitButtonMenu>
            }
        />
        <Button className="icon-button" size="small" ariaLabel="Search" kind="tertiary">
            <Icon iconSize={20} icon={Search} /> Search
        </Button>

        <Button className="icon-button" size="small" ariaLabel="Person" kind="tertiary">
            <Icon iconSize={20} icon={Person} /> Person
        </Button>

        <BoardFilter />

        <BoardSort />

    </Flex>
}

export default BoardHeaderContextualActions