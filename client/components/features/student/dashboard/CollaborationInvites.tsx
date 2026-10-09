"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CardDataTable } from "@/components/common/tables/CardDataTable";
import { StudentCollabInviteCardTypes } from "@/lib/types/collaboration";
import CollaborationInviteCard from "./CollaborationInviteCard";

import { useState, useEffect, useCallback } from "react";
import { useStudentSocket } from "@/hooks/useStudentSocket";
import { collaborationService } from "@/services/collaboration.service";
import { toast } from "sonner";

export const columns: ColumnDef<StudentCollabInviteCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
];

const CollaborationInvites = ({ invites: initialInvites }: { invites: StudentCollabInviteCardTypes[] }) => {
  const [invites, setInvites] = useState<StudentCollabInviteCardTypes[]>(initialInvites ?? []);
  const [prevInitialInvites, setPrevInitialInvites] = useState(initialInvites);

  const refetchInvites = useCallback(() => {
    collaborationService.getCollabRequests()
      .then((res) => {
        if (Array.isArray(res?.data)) setInvites(res.data);
      })
      .catch((err) => console.error("Refetch collaboration invites failed:", err));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvites((prev) => prev.filter((item) => item.collaborationId !== id));
  }, []);

  useStudentSocket({
    target: "collaboration-invites",
    onRefresh: (data) => {
      if (data?.message) {
        toast.info(data.message);
      } else {
        toast.info("You have a new collaboration request!");
      }
      refetchInvites();
    },
  });

  if (prevInitialInvites !== initialInvites) {
    setPrevInitialInvites(initialInvites);
    if (initialInvites) setInvites(initialInvites);
  }

  useEffect(() => {
    if (invites.length === 0) refetchInvites();
  }, [invites.length, refetchInvites]);

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
          <CollaborationInviteCard key={row.id} row={row} onRemoved={removeItem} />
        )}
      />
    </div>
  );
};

export default CollaborationInvites;