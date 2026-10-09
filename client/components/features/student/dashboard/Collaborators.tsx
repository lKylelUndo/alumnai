"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CardDataTable } from "@/components/common/tables/CardDataTable";
import { StudentCollaboratorCardTypes } from "@/lib/types/collaboration";
import CollaboratorCard from "./CollaboratorCard";
import { useState, useEffect, useCallback } from "react";
import { useStudentSocket } from "@/hooks/useStudentSocket";
import { collaborationService } from "@/services/collaboration.service";

export const columns: ColumnDef<StudentCollaboratorCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
];

const Collaborators = ({ collaborators: initialCollaborators }: { collaborators: StudentCollaboratorCardTypes[] }) => {
  const [collaborators, setCollaborators] = useState<StudentCollaboratorCardTypes[]>(initialCollaborators ?? []);
  const [prevInitialCollaborators, setPrevInitialCollaborators] = useState(initialCollaborators);

  const refetchCollaborators = useCallback(() => {
    collaborationService.getMyStudentCollaborations()
      .then((res) => {
        if (Array.isArray(res?.data)) setCollaborators(res.data);
      })
      .catch((err) => console.error("Refetch collaborations failed:", err));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCollaborators((prev) => prev.filter((item) => item.collaborationId !== id));
  }, []);

  useStudentSocket({
    target: "your-collaborations",
    onRefresh: () => {
      refetchCollaborators();
    },
  });

  if (prevInitialCollaborators !== initialCollaborators) {
    setPrevInitialCollaborators(initialCollaborators);
    if (initialCollaborators) setCollaborators(initialCollaborators);
  }

  useEffect(() => {
    if (collaborators.length === 0) refetchCollaborators();
  }, [collaborators.length, refetchCollaborators]);

  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Your Collaborators</h2>
        <p className="text-xs text-muted-foreground">
          Alumni you are actively collaborating with on projects
        </p>
      </div>

      <CardDataTable
        emptyMessage={"No active collaborations yet"}
        columns={columns}
        data={collaborators}
        pageSize={9}
        renderCard={(row) => (
          <CollaboratorCard key={row.id} row={row} onRemoved={removeItem} />
        )}
      />
    </div>
  );
};

export default Collaborators;