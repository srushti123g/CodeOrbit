import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./kanban.css";

const KanbanCard = ({ issue, index }) => {
    return (
        <Draggable draggableId={issue._id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                    }}
                >
                    <div className="card-header">
                        <span className="issue-id">#{issue._id.substring(0, 7)}</span>
                        {/* <span className="assignee-avatar">👤</span> */}
                    </div>
                    <div className="card-title">{issue.title}</div>
                    <div className="card-footer">
                        {/* <span className="card-tag">Bug</span> */}
                        {/* <span className="card-date">{new Date(issue.createdAt).toLocaleDateString()}</span> */}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default KanbanCard;
