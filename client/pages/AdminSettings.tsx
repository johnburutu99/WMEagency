import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <div className="container mx-auto px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Manage application-wide settings here. This feature is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>More settings will be available here soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
