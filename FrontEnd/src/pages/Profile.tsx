import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Camera, Shield, Crown, Upload, Check, Trash2, Globe } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get user initials for avatar fallback
  const initials = user 
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() 
    : "??";

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image est trop lourde (max 2Mo)");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsUploading(false);
        toast.success("Photo de profil mise à jour !");
      };
      // Simulate network delay
      setTimeout(() => {
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const roleDisplay = user?.role === "ADMIN" 
    ? "Administrateur Système" 
    : user?.role === "PROFESSOR" 
      ? "Corps Enseignant" 
      : "Étudiant Académique";

  return (
    <>
      <Helmet>
        <title>Mon Profil | UniPortal Premium</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-10 animate-fade-in pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">Paramètres du Profil</h1>
              <p className="text-slate-500 font-medium">Gérez vos informations personnelles et vos préférences de sécurité.</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" className="rounded-xl font-bold border-2">Exporter mes données</Button>
               <Button className="btn-premium px-8">Enregistrer tout</Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Avatar & Summary */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem]">
                <div className="h-32 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="px-8 pb-10 text-center -mt-16">
                  <div className="relative inline-block group">
                    <div 
                      onClick={handleImageClick}
                      className={cn(
                        "w-40 h-40 rounded-[2.5rem] border-[6px] border-white dark:border-slate-900 shadow-2xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-2",
                        isUploading && "animate-pulse opacity-50"
                      )}
                    >
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-black text-primary/30 uppercase tracking-tighter">{initials}</span>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                        <Camera className="h-8 w-8 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Changer</span>
                      </div>
                    </div>
                    
                    {/* Status Dot */}
                    <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-lg" />
                    
                    {/* Hidden Input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  
                  <div className="mt-6 space-y-1">
                    <h2 className="text-2xl font-black text-[#0f172a] dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">{roleDisplay}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</p>
                       <p className="font-bold text-sm">#{user?.id || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                       <p className="font-bold text-sm text-emerald-500">2.4k</p>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>Membre depuis</span>
                      <span className="text-[#0f172a] dark:text-white">
                        {(user as any)?.createdAt ? new Date((user as any).createdAt).getFullYear() : "2024"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span>Vérification</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 font-bold">Vérifié</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[2rem] overflow-hidden p-8">
                <div className="space-y-4">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Shield className="h-6 w-6" />
                   </div>
                   <h4 className="text-xl font-bold italic">Protection 2FA</h4>
                   <p className="text-sm opacity-80 leading-relaxed font-medium">Votre compte est protégé par une authentification à deux facteurs.</p>
                   <Button variant="secondary" className="w-full h-12 rounded-xl font-bold text-primary">Configurer</Button>
                </div>
              </Card>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="lg:col-span-8 space-y-8">
               <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8 pb-0 border-b border-slate-50 dark:border-slate-800">
                     <div className="flex items-center justify-between mb-8">
                         <CardTitle className="text-xl font-black flex items-center gap-3">
                            <User className="h-6 w-6 text-primary" /> Détails Personnels
                         </CardTitle>
                         <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/5">Modifier</Button>
                     </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                     <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Prénom</Label>
                           <Input value={user?.firstName || ""} className="input-premium h-14 bg-slate-50 dark:bg-slate-800/20" readOnly />
                        </div>
                        <div className="space-y-3">
                           <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom</Label>
                           <Input value={user?.lastName || ""} className="input-premium h-14 bg-slate-50 dark:bg-slate-800/20" readOnly />
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom d'utilisateur</Label>
                           <Input value={user?.username || ""} className="input-premium h-14 bg-slate-50 dark:bg-slate-800/20" readOnly />
                        </div>
                        <div className="space-y-3">
                           <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Email</Label>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input value={user?.email || ""} className="input-premium pl-12 h-14 bg-slate-50 dark:bg-slate-800/20" readOnly />
                           </div>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Téléphone</Label>
                           <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input value={(user as any)?.phoneNumber || "N/A"} className="input-premium pl-12 h-14 bg-slate-50 dark:bg-slate-800/20" readOnly />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Localisation</Label>
                           <div className="relative">
                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input value={(user as any)?.address || "Non renseignée"} className="input-premium pl-12 h-14 bg-slate-50 dark:bg-slate-800/20" readOnly />
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 flex flex-col md:flex-row items-center gap-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex-1 space-y-1">
                           <h5 className="font-bold text-[#0f172a] dark:text-white">Confidentialité du Profil</h5>
                           <p className="text-sm text-slate-500 font-medium">Contrôlez qui peut voir vos informations académiques.</p>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="outline" className="rounded-xl border-2 font-bold px-6">Restreindre</Button>
                           <Button className="btn-premium px-8 font-bold">Public</Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-none shadow-xl bg-emerald-500 text-white rounded-[2rem] p-8">
                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                           <Check className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-bold">Inscriptions Validées</h4>
                        <p className="text-sm opacity-80 leading-relaxed font-medium">Votre dossier est à jour pour le semestre actuel.</p>
                     </div>
                  </Card>
                  <Card className="border-none shadow-xl bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800">
                     <div className="space-y-4">
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
                           <Trash2 className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl font-bold dark:text-white text-[#0f172a]">Supprimer le compte</h4>
                        <p className="text-sm text-slate-500 font-medium">Action irréversible. Toutes vos données seront perdues.</p>
                     </div>
                  </Card>
               </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Profile;
