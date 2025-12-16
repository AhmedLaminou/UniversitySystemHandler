import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  MapPin, 
  Calendar,
  Clock,
  Building2,
  Search,
  Filter,
  ExternalLink,
  Bookmark
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

const jobs = [
  {
    id: 1,
    title: "Stage Développeur Full Stack",
    company: "Vermeg",
    location: "Tunis, Tunisie",
    type: "Stage PFE",
    duration: "6 mois",
    posted: "Il y a 2 jours",
    description: "Rejoignez notre équipe de développement pour travailler sur des projets innovants en React et Node.js.",
    tags: ["React", "Node.js", "MongoDB"]
  },
  {
    id: 2,
    title: "Développeur Mobile Junior",
    company: "Sofrecom",
    location: "Ariana, Tunisie",
    type: "Stage",
    duration: "3 mois",
    posted: "Il y a 5 jours",
    description: "Participez au développement d'applications mobiles cross-platform avec Flutter.",
    tags: ["Flutter", "Dart", "Firebase"]
  },
  {
    id: 3,
    title: "Data Science Intern",
    company: "Orange Tunisie",
    location: "Lac 2, Tunis",
    type: "Stage PFE",
    duration: "6 mois",
    posted: "Il y a 1 semaine",
    description: "Travaillez sur des projets de machine learning et d'analyse de données client.",
    tags: ["Python", "TensorFlow", "SQL"]
  },
  {
    id: 4,
    title: "Alternance DevOps",
    company: "Proxym Group",
    location: "Sousse, Tunisie",
    type: "Alternance",
    duration: "12 mois",
    posted: "Il y a 3 jours",
    description: "Intégrez notre équipe DevOps et participez à la mise en place de pipelines CI/CD.",
    tags: ["Docker", "Kubernetes", "AWS"]
  },
  {
    id: 5,
    title: "Stagiaire Cybersécurité",
    company: "Keyrus",
    location: "Tunis, Tunisie",
    type: "Stage",
    duration: "4 mois",
    posted: "Il y a 4 jours",
    description: "Participez aux audits de sécurité et à la mise en place de solutions de protection.",
    tags: ["Security", "Linux", "Pentesting"]
  },
  {
    id: 6,
    title: "Business Analyst Intern",
    company: "Telnet Holding",
    location: "Ariana, Tunisie",
    type: "Stage",
    duration: "3 mois",
    posted: "Il y a 1 semaine",
    description: "Analysez les besoins métier et participez à la rédaction des spécifications fonctionnelles.",
    tags: ["Analyse", "UML", "Agile"]
  },
];

const getTypeBadge = (type: string) => {
  switch (type) {
    case "Stage PFE":
      return <Badge className="bg-primary/20 text-primary border-primary/30">{type}</Badge>;
    case "Stage":
      return <Badge className="bg-success/20 text-success border-success/30">{type}</Badge>;
    case "Alternance":
      return <Badge className="bg-accent/20 text-accent border-accent/30">{type}</Badge>;
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
};

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterType || job.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Helmet>
        <title>Emplois & Stages - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Emplois & Stages</h1>
            <p className="text-muted-foreground mt-1">Découvrez les opportunités professionnelles</p>
          </div>

          {/* Search and Filters */}
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par titre ou entreprise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={filterType === null ? "default" : "outline"} 
                    onClick={() => setFilterType(null)}
                    className="rounded-xl"
                  >
                    Tous
                  </Button>
                  <Button 
                    variant={filterType === "Stage PFE" ? "default" : "outline"}
                    onClick={() => setFilterType("Stage PFE")}
                    className="rounded-xl"
                  >
                    Stage PFE
                  </Button>
                  <Button 
                    variant={filterType === "Stage" ? "default" : "outline"}
                    onClick={() => setFilterType("Stage")}
                    className="rounded-xl"
                  >
                    Stage
                  </Button>
                  <Button 
                    variant={filterType === "Alternance" ? "default" : "outline"}
                    onClick={() => setFilterType("Alternance")}
                    className="rounded-xl"
                  >
                    Alternance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredJobs.length}</span> offres trouvées
            </p>
          </div>

          {/* Jobs List */}
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} variant="elevated" className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      {job.company.charAt(0)}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">{job.title}</h3>
                        {getTypeBadge(job.type)}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.duration}
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 shrink-0">
                      <Button className="flex-1 lg:flex-none">
                        Postuler
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                      <Button variant="outline" size="icon" className="shrink-0">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Publié {job.posted}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Jobs;
