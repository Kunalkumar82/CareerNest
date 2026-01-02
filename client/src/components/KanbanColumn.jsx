import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import JobCard from './JobCard';

const KanbanColumn = ({ status, jobs, onEdit, onDelete }) => {
    return (
        <div className="flex-shrink-0 w-80 bg-slate-50/50 rounded-2xl p-4 flex flex-col h-full border border-slate-200/60 shadow-sm backdrop-blur-sm dark:bg-slate-800/50 dark:border-slate-700/60">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between px-2 font-display dark:text-slate-200">
                {status}
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full dark:bg-slate-700 dark:text-slate-300">
                    {jobs.length}
                </span>
            </h3>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto min-h-[150px] transition-all duration-200 space-y-3 p-1 custom-scrollbar ${snapshot.isDraggingOver ? 'bg-indigo-50/50 rounded-xl ring-2 ring-indigo-200 ring-dashed dark:bg-indigo-900/30 dark:ring-indigo-700' : ''
                            }`}
                    >
                        {jobs.map((job, index) => (
                            <Draggable key={job._id} draggableId={job._id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.9 : 1,
                                            transform: snapshot.isDragging ? `${provided.draggableProps.style.transform} scale(1.02)` : provided.draggableProps.style.transform,
                                        }}
                                        className="mb-3 last:mb-0"
                                    >
                                        <JobCard
                                            job={job}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
