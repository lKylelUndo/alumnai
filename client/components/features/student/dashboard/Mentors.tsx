"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CardDataTable } from "@/components/common/tables/CardDataTable";
import { StudentMentorCardTypes } from "@/lib/types/mentorship";
import MentorCard from "./MentorCard";

export const columns: ColumnDef<StudentMentorCardTypes>[] = [
  { accessorKey: "name", header: "Name" },
];

const Mentors = ({ mentors }: { mentors: StudentMentorCardTypes[] }) => {
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