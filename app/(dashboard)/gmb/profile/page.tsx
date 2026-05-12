import { getGmbConnection } from "../actions";
import { ProfileEditor } from "./profile-editor";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const connection = await getGmbConnection();

  if (!connection) {
    redirect("/gmb/connect");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Perfil</h1>
        <p className="text-muted-foreground">Otimize seu perfil do Google Meu Negocio</p>
      </div>
      <ProfileEditor connection={connection} />
    </div>
  );
}
