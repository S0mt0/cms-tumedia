"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

type SortableRecord = { id: UniqueIdentifier };

type SortableDndContainerProps<TItem extends SortableRecord> = {
  items: TItem[];
  onReorder: (items: TItem[]) => void;
  disabled?: boolean;
  sortableItems?: boolean;
  className?: string;
  layout?: "list" | "grid";
  children: (item: TItem, index: number) => ReactNode;
};

export function SortableDndContainer<TItem extends SortableRecord>({
  items,
  onReorder,
  disabled = false,
  sortableItems = false,
  className,
  layout = "list",
  children,
}: SortableDndContainerProps<TItem>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (disabled || !over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={
          layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy
        }
      >
        <div className={className}>
          {items.map((item, index) =>
            sortableItems ? (
              <SortableItem disabled={disabled} id={item.id} key={item.id}>
                {children(item, index)}
              </SortableItem>
            ) : (
              <div key={item.id}>{children(item, index)}</div>
            )
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  children,
  disabled,
  id,
}: {
  children: ReactNode;
  disabled: boolean;
  id: UniqueIdentifier;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
