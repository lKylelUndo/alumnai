"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CardDataTable } from "@/components/common/tables/CardDataTable";
import { StudentCollaboratorCardTypes } from "@/lib/types/collaboration";
import CollaboratorCard from "./CollaboratorCard";

export const columns: ColumnDef<StudentCollaboratorCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
];

const Collaborators = ({ collaborators }: { collaborators: StudentCollaboratorCardTypes[] }) => {
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
          <CollaboratorCard key={row.id} row={row} />
        )}
      />
    </div>
  );
};

export default Collaborators;