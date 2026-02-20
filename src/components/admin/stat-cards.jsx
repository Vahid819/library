import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { title: "New Subscriptions", value: "4,682", trend: "+15.5%" },
  { title: "New Orders", value: "1,226", trend: "-40.2%" },
  { title: "Avg Order Revenue", value: "1,080", trend: "+10.8%" },
  { title: "Total Revenue", value: "$15,231.89", trend: "+20.1%" },
];

export default function StatCards() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {s.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
