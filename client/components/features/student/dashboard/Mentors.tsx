"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CardDataTable } from "@/components/common/tables/CardDataTable";
import { StudentMentorCardTypes } from "@/lib/types/mentorship";
import MentorCard from "./MentorCard";

import { useState, useEffect, useCallback } from "react";
import { useStudentSocket } from "@/hooks/useStudentSocket";
import { mentorshipService } from "@/services/mentorship.service";
import { toast } from "sonner";

export const columns: ColumnDef<StudentMentorCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
];

const Mentors = ({ mentors: initialMentors }: { mentors: StudentMentorCardTypes[] }) => {
  const [mentors, setMentors] = useState<StudentMentorCardTypes[]>(initialMentors ?? []);
  const [prevInitialMentors, setPrevInitialMentors] = useState(initialMentors);

  const refetchMentors = useCallback(() => {
    mentorshipService.getMyMentors()
      .then((res) => {
        if (Array.isArray(res?.data)) setMentors(res.data);
      })
      .catch((err) => console.error("Refetch mentors failed:", err));
  }, []);

  useStudentSocket({
    target: "my-mentors",
    onRefresh: (data) => {
      if (data?.message) toast.info(data.message);
      refetchMentors();
    },
  });

  if (prevInitialMentors !== initialMentors) {
    setPrevInitialMentors(initialMentors);
    if (initialMentors && initialMentors.length > 0) setMentors(initialMentors);
  }

  useEffect(() => {
    if (mentors.length === 0) refetchMentors();
  }, [mentors.length, refetchMentors]);
  return (
    <div className="rounded p-4 shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary">Your Mentors</h2>
        <p className="text-xs text-muted-foreground">
          Alumni mentors guiding your career and skill growth
        </p>
      </div>

      <CardDataTable
        emptyMessage={"No mentors yet. Find and connect with alumni mentors!"}
        columns={columns}
        data={mentors}
        pageSize={9}
        renderCard={(row) => (
          <MentorCard key={row.id} row={row} />
        )}
      />
    </div>
  );
};

export default Mentors;