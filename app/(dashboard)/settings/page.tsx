import { getUserProfile } from "./actions";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const profile = await getUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuracoes</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e plano</p>
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}
