import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const members = [
  { name: "Dale Komen", role: "Member" },
  { name: "Sofia Davis", role: "Owner" },
  { name: "Jackson Lee", role: "Member" },
];

export default function TeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>

      <div className="p-4 space-y-4">
        {members.map((m) => (
          <div key={m.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {m.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {m.role}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
