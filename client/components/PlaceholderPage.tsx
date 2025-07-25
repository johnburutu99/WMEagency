import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  backTo?: string;
}

export default function PlaceholderPage({
  title,
  description,
  icon = <Construction className="w-12 h-12 text-wme-gold" />,
  backTo = "/dashboard",
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">{icon}</div>
              <CardTitle className="text-2xl mb-2">{title}</CardTitle>
              <CardDescription className="text-lg">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                This section is currently under development. Please check back
                soon or contact your WME coordinator for assistance.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to={backTo}>
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Button className="bg-wme-gold text-black hover:bg-wme-gold/90">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
