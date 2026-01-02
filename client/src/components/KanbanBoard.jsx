import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';

const STATUS_COLUMNS = ['Pending', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const KanbanBoard = ({ jobs, onStatusChange, onEdit, onDelete }) => {

    // Group jobs by status
    const jobsByStatus = STATUS_COLUMNS.reduce((acc, status) => {
        acc[status] = jobs.filter(job => job.status === status);
        return acc;
    }, {});

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId;
        const job = jobs.find(j => j._id === draggableId);

        if (job && job.status !== newStatus) {
            onStatusChange(job._id, newStatus);
        }
    };

    return (
        <div className="h-full overflow-x-auto pb-4 custom-scrollbar">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 min-w-max h-full p-4">
                    {STATUS_COLUMNS.map(status => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            jobs={jobsByStatus[status] || []}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
