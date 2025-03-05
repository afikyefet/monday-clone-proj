import { Dropdown, IconButton } from "@vibe/core";
import { CloseSmall } from "@vibe/icons";
import React from "react";

const SortRow = ({ sortList, sort, onChange, onRemove, isSortActive }) => {
    // Define the ordering options.
    const orderOptions = [
        { label: "Ascending", value: 1 },
        { label: "Descending", value: -1 },
    ];

    return (
        <section className="sort-row">
            {/* Column selection Dropdown */}
            <Dropdown
                value={sort.title}
                className="sort-list"
                placeholder="Choose column"
                options={sortList.map(s => ({
                    label: s.charAt(0).toUpperCase() + s.slice(1),
                    value: s,
                }))}
                onChange={(option) => onChange({ ...sort, title: option.value })}
            />
            {/* Order selection Dropdown */}
            <Dropdown
                value={sort.order}
                onChange={(option) => onChange({ ...sort, order: option.value })}
                clearable={false}
                className="ascending-descending"
                options={orderOptions}
            />
            {/* Remove sort row button */}
            {isSortActive && <IconButton
                icon={CloseSmall}
                className="icon-btn"
                kind="tertiary"
                onClick={onRemove}
            />}
        </section>
    );
};

export default SortRow;
