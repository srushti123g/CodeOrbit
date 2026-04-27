import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import KanbanCard from "./KanbanCard";
import "./kanban.css";

const KanbanColumn = ({ title, status, issues }) => {
    return (
        <div className="kanban-column">
            <h3 className="column-title">
                {title}
                <span className="column-count">{issues.length}</span>
            </h3>
            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        className={`column-content ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {issues.map((issue, index) => (
                            <KanbanCard key={issue._id} issue={issue} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
