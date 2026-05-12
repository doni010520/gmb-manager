import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGmbConnection, getGmbDashboard } from "./actions";
import { GmbDashboardClient } from "./gmb-dashboard-client";

export default async function GmbPage() {
  const connection = await getGmbConnection();

  if (!connection) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Conecte seu Google Meu Negocio</CardTitle>
            <CardDescription>
              Conecte seu perfil do Google Meu Negocio para comecar a gerenciar posts,
              avaliacoes e otimizar seu perfil com IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/gmb/connect">Conectar Agora</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dashboard = await getGmbDashboard();

  return <GmbDashboardClient dashboard={dashboard} />;
}
