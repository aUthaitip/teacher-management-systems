import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardContent className="space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{title}</h1>

          <p className="mt-2 text-muted-foreground">
            {description}
          </p>
        </div>

        {children}
      </CardContent>
    </Card>
  );
}