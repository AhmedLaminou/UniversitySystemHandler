import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Shield, Crown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  
  // Get user initials for avatar
  const initials = user 
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() 
    : "??";

  // Role display
  const roleDisplay = user?.role === "ADMIN" 
    ? "Administrateur" 
    : user?.role === "PROFESSOR" 
      ? "Enseignant" 
      : "Étudiant";

  return (
    <>
      <Helmet>
        <title>Mon Profil - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Mon Profil</h1>
            <p className="text-muted-foreground mt-1">Gérez vos informations personnelles</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card variant="elevated" className="lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className={`w-28 h-28 rounded-full ${isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'gradient-primary'} flex items-center justify-center text-4xl font-bold text-primary-foreground`}>
                    {initials || "??"}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-110 transition-transform">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-foreground">
                  {user?.firstName || "Prénom"} {user?.lastName || "Nom"}
                </h2>
                <p className="text-muted-foreground">{roleDisplay}</p>
                
                <div className="mt-4 space-y-2">
                  <Badge variant={isAdmin ? "default" : "secondary"} className="gap-2">
                    {isAdmin ? <Crown className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                    {isAdmin ? "Administrateur Système" : `ID: ${user?.id || "N/A"}`}
                  </Badge>
                </div>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rôle</span>
                    <span className="font-medium text-foreground">{roleDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Compte créé</span>
                    <span className="font-medium text-foreground">
                      {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString('fr-FR') : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge className={(user as any)?.enabled !== false ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}>
                      {(user as any)?.enabled !== false ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  {!isAdmin && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Année Académique</span>
                      <span className="font-medium text-foreground">2024/2025</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations Personnelles
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Prénom</Label>
                    <Input value={user?.firstName || ""} className="h-12 rounded-xl" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Nom</Label>
                    <Input value={user?.lastName || ""} className="h-12 rounded-xl" readOnly />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nom d'utilisateur
                    </Label>
                    <Input value={user?.username || ""} className="h-12 rounded-xl" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">ID Utilisateur</Label>
                    <Input value={user?.id?.toString() || ""} className="h-12 rounded-xl" readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input value={user?.email || ""} className="h-12 rounded-xl" readOnly />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </Label>
                    <Input value={(user as any)?.phoneNumber || ""} className="h-12 rounded-xl" placeholder="Non renseigné" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Rôle</Label>
                    <Input value={roleDisplay} className="h-12 rounded-xl" readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </Label>
                  <Input value={(user as any)?.address || ""} className="h-12 rounded-xl" placeholder="Non renseignée" readOnly />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Annuler</Button>
                  <Button>Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Profile;
