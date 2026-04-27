import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import api from "../../services/api";
import "./kanban.css";

const KanbanBoard = ({ repoId }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIssues();
    }, [repoId]);

    const fetchIssues = async () => {
        try {
            const res = await api.issue.getFromRepo(repoId);
            setIssues(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching issues:", err);
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // Dropped outside or same position
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Optimistic UI Update
        const newStatus = destination.droppableId;
        const updatedIssues = issues.map((issue) =>
            issue._id === draggableId ? { ...issue, status: newStatus } : issue
        );
        setIssues(updatedIssues);

        // API Call
        try {
            await api.issue.update(draggableId, { status: newStatus });
        } catch (err) {
            console.error("Failed to update issue status:", err);
            // Revert on error
            fetchIssues();
            alert("Failed to update status");
        }
    };

    // Filter issues by status
    const columns = {
        open: {
            title: "Open",
            issues: issues.filter((i) => i.status === "open" || !i.status), // Handle undefined as open
        },
        in_progress: {
            title: "In Progress",
            issues: issues.filter((i) => i.status === "in_progress"),
        },
        closed: {
            title: "Done",
            issues: issues.filter((i) => i.status === "closed"),
        },
    };

    if (loading) return <div className="kanban-board-container">Loading board...</div>;

    return (
        <div className="kanban-board-container">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {Object.entries(columns).map(([status, column]) => (
                        <KanbanColumn
                            key={status}
                            title={column.title}
                            status={status}
                            issues={column.issues}
                        />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
