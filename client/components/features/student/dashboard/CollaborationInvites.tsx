"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CardDataTable } from "@/components/common/tables/CardDataTable";
import { StudentCollabInviteCardTypes } from "@/lib/types/collaboration";
import CollaborationInviteCard from "./CollaborationInviteCard";

import { useRouter } from "next/navigation";
import { useStudentSocket } from "@/hooks/useStudentSocket";
import { toast } from "sonner";

export const columns: ColumnDef<StudentCollabInviteCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
];

const CollaborationInvites = ({ invites }: { invites: StudentCollabInviteCardTypes[] }) => {
  const router = useRouter();

  useStudentSocket({
    target: "collaboration-invites",
    onRefresh: (data) => {
      if (data?.message) {
        toast.info(data.message);
      } else {
        toast.info("You have a new collaboration request!");
      }
      router.refresh();
    },
  });

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