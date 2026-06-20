import { Brain } from "lucide-react"

const AdminHeader = () => {
  return (
    <nav className="flex justify-between mt-2">
      <div className="flex items-center gap-x-1">
        <Brain />
        <h1 className="text-xl font-bold text-primary md:text-2xl">alumnai</h1>
      </div>

      <div className="bg-foreground rounded-full h-10 w-10">
       
      </div>
    </nav>
  )
}

export default AdminHeader
