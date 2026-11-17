"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Progress,
  Select,
  Separator,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui";

export default function UiPreviewPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [tab, setTab] = useState("rent");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/missing-avatar.png" alt="" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">Shared UI</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Preview of components/ui</p>
        </div>
        <Badge variant="success" className="ml-auto">
          Active
        </Badge>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 800);
          }}
        >
          Save
        </Button>
      </div>

      <Alert variant="warning">
        <AlertTitle>Rent overdue</AlertTitle>
        <AlertDescription>Two leases are past the payment date.</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Tenant</CardTitle>
          <CardDescription>Contact details for the current lease.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Ama Koffi" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="unit">Unit</Label>
            <Select id="unit" defaultValue="a12">
              <option value="a12">Apartment A12</option>
              <option value="b02">Apartment B02</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" defaultValue="Collect keys on Friday." />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            Send payment reminder
          </label>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="notices">Email notices</Label>
            <Switch id="notices" checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <Progress value={65} />
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open dialog
          </Button>
        </CardFooter>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="rent">Rent</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="rent">Rent collections for this month.</TabsContent>
        <TabsContent value="maintenance">Open maintenance requests.</TabsContent>
      </Tabs>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ama Koffi</TableCell>
            <TableCell>
              <Badge variant="warning">Due</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <p data-testid="switch-state">{enabled ? "notices-on" : "notices-off"}</p>
      <p data-testid="tab-state">{tab}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription>Confirm the amount received for apartment A12.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </DialogFooter>
      </Dialog>
    </main>
  );
}
