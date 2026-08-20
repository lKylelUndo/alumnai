"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CardDataTable } from "@/components/common/tables/CardDataTable";
import { StudentCollabInviteCardTypes } from "@/lib/types/collaboration";
import CollaborationInviteCard from "./CollaborationInviteCard";

export const columns: ColumnDef<StudentCollabInviteCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
];

const CollaborationInvites = ({ invites }: { invites: StudentCollabInviteCardTypes[] }) => {
  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Collaboration Requests</h2>
        <p className="text-xs text-muted-foreground">
          Pending collaboration invitations received from alumni
        </p>
      </div>

      <CardDataTable
        emptyMessage={"No collaboration requests at the moment"}
        columns={columns}
        data={invites}
        pageSize={9}
        renderCard={(row) => (
          <CollaborationInviteCard key={row.id} row={row} />
        )}
      />
    </div>
  );
};

export default CollaborationInvites;