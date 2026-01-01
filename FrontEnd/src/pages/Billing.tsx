import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  TrendingUp,
  RefreshCw,
  Plus,
  Wallet,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBillingHealth,
  fetchInvoices,
  fetchAllInvoices,
  fetchBalance,
  fetchPayments,
  createInvoice,
  recordPayment,
  fetchStudentList,
  Invoice,
  Payment,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Users } from "lucide-react";

// Fallback data when API is unavailable
const fallbackInvoices: Invoice[] = [
  { id: "INV-2024-001", studentId: "STU001", amount: 1800, description: "Frais de Scolarité - 1ère Tranche", dueDate: "2024-09-15", status: "paid" },
  { id: "INV-2024-002", studentId: "STU001", amount: 1800, description: "Frais de Scolarité - 2ème Tranche", dueDate: "2024-10-15", status: "paid" },
  { id: "INV-2024-003", studentId: "STU001", amount: 1200, description: "Frais de Scolarité - 3ème Tranche", dueDate: "2024-11-15", status: "pending" },
  { id: "INV-2024-004", studentId: "STU001", amount: 150, description: "Frais d'Inscription Examens", dueDate: "2024-12-15", status: "pending" },
  { id: "INV-2024-005", studentId: "STU001", amount: 50, description: "Frais de Bibliothèque", dueDate: "2024-09-01", status: "paid" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-success/20 text-success border-success/30">Payé</Badge>;
    case "pending":
      return <Badge className="bg-accent/20 text-accent border-accent/30">En Attente</Badge>;
    case "overdue":
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30">En Retard</Badge>;
    default:
      return null;
  }
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("fr-NE", { minimumFractionDigits: 0 }).format(amount) + " XOF";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

const Billing = () => {
  const { user, accessToken } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const studentId = user?.id?.toString() || "STU001";
  const queryClient = useQueryClient();

  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: "BANK_TRANSFER",
    referenceNumber: "",
  });
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: "",
    amount: 0,
    description: "",
    dueDate: "",
  });

  const { data: health } = useQuery({
    queryKey: ["billing-health"],
    queryFn: fetchBillingHealth,
  });

  // Admin: fetch student list for filtering
  const { data: students } = useQuery({
    queryKey: ["students-billing"],
    enabled: isAdmin && !!accessToken,
    queryFn: () => fetchStudentList(accessToken!),
  });
  const studentsList = Array.isArray(students) ? students : [];

  // Admin: fetch all invoices
  const {
    data: allInvoices,
    isLoading: isLoadingAll,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useQuery({
    queryKey: ["all-invoices"],
    queryFn: () => fetchAllInvoices(accessToken!),
    enabled: isAdmin && !!accessToken,
  });

  // Student: fetch own invoices
  const {
    data: apiInvoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices,
    isRefetching,
  } = useQuery({
    queryKey: ["invoices", studentId],
    queryFn: () => fetchInvoices(studentId, accessToken!),
    enabled: !isAdmin && !!accessToken,
  });

  const { data: balanceData } = useQuery({
    queryKey: ["balance", studentId],
    queryFn: () => fetchBalance(studentId, accessToken!),
    enabled: !isAdmin && !!accessToken,
  });

  const { data: payments } = useQuery({
    queryKey: ["payments", studentId],
    queryFn: () => fetchPayments(studentId, accessToken!),
    enabled: !isAdmin && !!accessToken,
  });

  // Use API data or fallback - admin sees all, student sees own
  const rawInvoices = isAdmin 
    ? (allInvoices && allInvoices.length > 0 ? allInvoices : fallbackInvoices)
    : (apiInvoices && apiInvoices.length > 0 ? apiInvoices : fallbackInvoices);

  // Apply filters for admin
  const invoices = isAdmin
    ? rawInvoices.filter((inv) => {
        if (selectedStudentFilter && selectedStudentFilter !== "__all__" && inv.studentId !== selectedStudentFilter) return false;
        if (statusFilter && statusFilter !== "__all__" && inv.status !== statusFilter) return false;
        return true;
      })
    : rawInvoices;

  // Calculate totals
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
  const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0);
  const progressPercent = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  // Helper to get student name by ID
  const getStudentName = (sid: string) => {
    const student = studentsList.find((s: any) => (s._id || s.id) === sid);
    return student ? `${student.firstName} ${student.lastName}` : sid;
  };

  const billingStatus = [
    { label: "Payé", amount: formatAmount(balanceData?.totalPaid || totalPaid), icon: CheckCircle, color: "bg-success/10 text-success border-success/30" },
    { label: "En Attente", amount: formatAmount(totalPending), icon: Clock, color: "bg-accent/10 text-accent border-accent/30" },
    { label: "Solde Dû", amount: formatAmount(balanceData?.balance || totalPending), icon: AlertCircle, color: "bg-destructive/10 text-destructive border-destructive/30" },
  ];

  // Mutations
  const paymentMutation = useMutation({
    mutationFn: () =>
      recordPayment(
        selectedInvoice!.id,
        studentId,
        paymentForm.amount,
        paymentForm.paymentMethod,
        paymentForm.referenceNumber,
        accessToken!
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Paiement enregistré avec succès");
      setIsPayDialogOpen(false);
      setSelectedInvoice(null);
      setPaymentForm({ amount: 0, paymentMethod: "BANK_TRANSFER", referenceNumber: "" });
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement du paiement");
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: () =>
      createInvoice(
        invoiceForm.studentId,
        invoiceForm.amount,
        invoiceForm.description,
        invoiceForm.dueDate,
        accessToken!
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Facture créée avec succès");
      setIsCreateDialogOpen(false);
      setInvoiceForm({ studentId: "", amount: 0, description: "", dueDate: "" });
    },
    onError: () => {
      toast.error("Erreur lors de la création de la facture");
    },
  });

  const openPayDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({ ...paymentForm, amount: invoice.amount });
    setIsPayDialogOpen(true);
  };

  const isUp = health?.status === "UP";

  return (
    <>
      <Helmet>
        <title>{isAdmin ? "Facturation Étudiants" : "Ma Facturation"} - UniPortal</title>
      </Helmet>

      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {isAdmin ? "Facturation des Étudiants" : "Ma Facturation"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isAdmin ? "Gérer les factures et paiements de tous les étudiants" : "Gérez vos paiements et factures"}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {isAdmin && (
                <>
                  <Select value={selectedStudentFilter} onValueChange={setSelectedStudentFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Tous les étudiants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Tous les étudiants</SelectItem>
                      {studentsList
                        .filter((s: any) => s._id || s.id)
                        .map((s: any) => (
                          <SelectItem key={s._id || s.id} value={String(s._id || s.id)}>
                            {s.firstName} {s.lastName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Tous statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Tous statuts</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isUp ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span className="text-muted-foreground">
                  Service Billing&nbsp;
                  {isUp ? "en ligne" : "hors ligne"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchInvoices()}
                disabled={isRefetching}
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
              {isAdmin && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Créer facture
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer une facture</DialogTitle>
                      <DialogDescription>
                        Créez une nouvelle facture pour un étudiant.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="inv-student">ID Étudiant</Label>
                        <Input
                          id="inv-student"
                          placeholder="STU001"
                          value={invoiceForm.studentId}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-amount">Montant (DT)</Label>
                        <Input
                          id="inv-amount"
                          type="number"
                          min={0}
                          value={invoiceForm.amount}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-desc">Description</Label>
                        <Input
                          id="inv-desc"
                          placeholder="Frais de scolarité..."
                          value={invoiceForm.description}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-due">Date d'échéance</Label>
                        <Input
                          id="inv-due"
                          type="date"
                          value={invoiceForm.dueDate}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={() => createInvoiceMutation.mutate()} disabled={createInvoiceMutation.isPending}>
                        {createInvoiceMutation.isPending ? "Création..." : "Créer"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Payment Dialog - Niger-Specific Providers */}
          <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Effectuer un Paiement</DialogTitle>
                <DialogDescription>
                  {selectedInvoice && `Paiement pour: ${selectedInvoice.description}`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="pay-amount">Montant (XOF)</Label>
                  <Input
                    id="pay-amount"
                    type="number"
                    min={0}
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                {/* Payment Method Selection - Niger Specific */}
                <div className="space-y-3">
                  <Label>Mode de paiement</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {/* MyNita Option */}
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentForm.paymentMethod === "MYNITA"
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: "MYNITA" })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100">
                          <Wallet className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">MyNita</p>
                          <p className="text-sm text-muted-foreground">Portefeuille mobile Niger</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bank Card Option */}
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentForm.paymentMethod === "BANK_CARD"
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: "BANK_CARD" })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Carte Bancaire</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Money Option */}
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentForm.paymentMethod === "MOBILE_MONEY"
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentForm({ ...paymentForm, paymentMethod: "MOBILE_MONEY" })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-100">
                          <Receipt className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">Mobile Money</p>
                          <p className="text-sm text-muted-foreground">Orange Money, Airtel Money</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Conditional fields based on payment method */}
                {paymentForm.paymentMethod === "MYNITA" && (
                  <div className="space-y-2">
                    <Label htmlFor="pay-phone">Numéro de téléphone</Label>
                    <Input
                      id="pay-phone"
                      placeholder="+227 XX XX XX XX"
                      value={paymentForm.referenceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                    />
                  </div>
                )}
                
                {paymentForm.paymentMethod === "MOBILE_MONEY" && (
                  <div className="space-y-2">
                    <Label htmlFor="pay-phone">Numéro de téléphone</Label>
                    <Input
                      id="pay-phone"
                      placeholder="+227 XX XX XX XX"
                      value={paymentForm.referenceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                    />
                  </div>
                )}
                
                {paymentForm.paymentMethod === "BANK_CARD" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Numéro de carte</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Date d'expiration</Label>
                        <Input id="card-expiry" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input id="card-cvv" placeholder="123" maxLength={4} type="password" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => paymentMutation.mutate()} disabled={paymentMutation.isPending}>
                  {paymentMutation.isPending ? "Traitement..." : "Confirmer le paiement"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {billingStatus.map((status) => (
              <Card key={status.label} variant="elevated" className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{status.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{status.amount}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${status.color.split(" ")[0]}`}>
                      <status.icon className={`h-6 w-6 ${status.color.split(" ")[1]}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Progress */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Progression des Paiements</h3>
                  <p className="text-sm text-muted-foreground">Année académique 2024/2025</p>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">{progressPercent}% complété</span>
                </div>
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-primary rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{formatAmount(totalPaid)} payés</span>
                <span>{formatAmount(totalAmount)} total</span>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Historique des Factures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingInvoices ? (
                <SkeletonLoader />
              ) : invoices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucune facture trouvée</p>
              ) : (
                invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 hidden sm:flex">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{invoice.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                          <span>{invoice.id}</span>
                          <span>•</span>
                          <span>Échéance: {formatDate(invoice.dueDate)}</span>
                          {isAdmin && (
                            <>
                              <span>•</span>
                              <span className="text-primary font-medium">{getStudentName(invoice.studentId)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatAmount(invoice.amount)}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">PDF</span>
                        </Button>
                        {invoice.status === "pending" && (
                          <Button size="sm" onClick={() => openPayDialog(invoice)}>
                            <Wallet className="h-4 w-4 mr-1" />
                            Payer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Billing;
