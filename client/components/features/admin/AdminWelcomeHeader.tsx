"use client";

const AdminWelcomeHeader = () => {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
        Hey, Admin 👋
      </h1>
      <p className="text-sm text-muted-foreground">
        Monitor platform activity and manage institutional data.
      </p>
    </div>
  );
};

export default AdminWelcomeHeader;
