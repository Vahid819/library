import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const payments = [
  { email: "ken99@yahoo.com", amount: "$316", status: "Success" },
  { email: "abe45@gmail.com", amount: "$242", status: "Success" },
  { email: "monserrat44@gmail.com", amount: "$837", status: "Processing" },
  { email: "carmella@hotmail.com", amount: "$721", status: "Failed" },
];

export default function PaymentsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((p, i) => (
            <TableRow key={i}>
              <TableCell>
                <Badge
                  variant={
                    p.status === "Success"
                      ? "default"
                      : p.status === "Processing"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>{p.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
