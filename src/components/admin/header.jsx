import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <Input
        placeholder="Search"
        className="max-w-xs"
      />

      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="secondary">Pick a date</Button>
      </div>
    </header>
  );
}