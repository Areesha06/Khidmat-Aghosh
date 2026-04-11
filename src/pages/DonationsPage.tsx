import { motion, useInView } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  addDonationRecord,
  deleteDonationRecord,
  fetchDonationRecords,
  type DonationRecord,
  updateDonationRecord,
} from "@/lib/publicData";
import { uploadImageToSupabase } from "@/lib/media";

const DonationsPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [donationsData, setDonationsData] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [donatedAt, setDonatedAt] = useState("");
  const [receiptImage, setReceiptImage] = useState<File | null>(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const loadDonations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDonationRecords();
      setDonationsData(data);
    } catch (error) {
      toast({
        title: "Could not load donations",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setDonorName("");
    setAmount("");
    setPurpose("");
    setDonatedAt("");
    setReceiptImage(null);
  };

  const onEdit = (donation: DonationRecord) => {
    setEditingId(donation.id);
    setDonorName(donation.donor_name);
    setAmount(String(donation.amount));
    setPurpose(donation.purpose || "");
    setDonatedAt(donation.donated_at || "");
    setReceiptImage(null);
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("Delete this donation record?")) {
      return;
    }

    try {
      await deleteDonationRecord(id);
      await loadDonations();
      toast({ title: "Deleted", description: "Donation record removed." });
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Could not delete",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const onCreateDonation = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      let receiptImageUrl: string | undefined;
      if (receiptImage) {
        const uploaded = await uploadImageToSupabase(receiptImage, "donations");
        receiptImageUrl = uploaded.publicUrl;
      }

      if (editingId) {
        await updateDonationRecord(editingId, {
          donorName: donorName.trim(),
          amount: Number(amount),
          purpose: purpose.trim(),
          donatedAt: donatedAt || undefined,
          receiptImageUrl,
        });
      } else {
        await addDonationRecord({
          donorName: donorName.trim(),
          amount: Number(amount),
          purpose: purpose.trim(),
          donatedAt: donatedAt || undefined,
          receiptImageUrl,
        });
      }

      resetForm();
      await loadDonations();
      toast({
        title: editingId ? "Donation updated" : "Donation added",
        description: editingId ? "Support record updated." : "Support record saved to database.",
      });
    } catch (error) {
      toast({
        title: "Could not save donation",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = donationsData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="h-[60vh] bg-foreground text-background flex items-end">
        <div className="section-padding pb-16 w-full">
          <div className="container-narrow">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-widest text-primary mb-4 block"
            >
              Support Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Make a Difference Today
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="section-padding border-b border-border">
        <div className="container-narrow">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 border border-border hover:border-primary transition-colors group"
            >
              <Heart className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-xl font-display mb-3">One-Time Gift</h3>
              <p className="text-muted-foreground mb-6">Make an immediate impact with a single contribution.</p>
              <button className="inline-flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                <span>Donate Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 border border-primary bg-primary/5"
            >
              <Heart className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-xl font-display mb-3">Monthly Sponsor</h3>
              <p className="text-muted-foreground mb-6">Provide ongoing support with recurring donations.</p>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <span>Become a Sponsor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 border border-border hover:border-primary transition-colors group"
            >
              <Heart className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-xl font-display mb-3">Sponsor a Child</h3>
              <p className="text-muted-foreground mb-6">Support a specific child's education and care.</p>
              <Link to="/orphans" className="inline-flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                <span>View Children</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container-narrow px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-display mb-2">${totalAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">This Month</div>
            </div>
            <div>
              <div className="text-4xl font-display mb-2">34</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">Active Sponsors</div>
            </div>
            <div>
              <div className="text-4xl font-display mb-2">48</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">Children Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          {isAdmin && (
            <form onSubmit={onCreateDonation} className="mb-12 grid gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-foreground">
                  {editingId ? "Edit Donation Record" : "Add Donation Record"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-name">Donor Name</Label>
                <Input id="donor-name" value={donorName} onChange={(event) => setDonorName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" min={1} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input id="purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donated-at">Date</Label>
                <Input id="donated-at" type="date" value={donatedAt} onChange={(event) => setDonatedAt(event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="receipt">Receipt Image (Optional)</Label>
                <Input id="receipt" type="file" accept="image/*" onChange={(event) => setReceiptImage(event.target.files?.[0] || null)} />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button className="justify-self-start" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update Donation" : "Add Donation Record"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}

          <h2 className="text-3xl font-display mb-12">Recent Contributions</h2>
          <div className="space-y-0 border-t border-border">
            {isLoading && <div className="py-6 text-sm text-muted-foreground">Loading contributions...</div>}

            {!isLoading && donationsData.length === 0 && (
              <div className="py-6 text-sm text-muted-foreground">No donation records available yet.</div>
            )}

            {donationsData.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between py-6 border-b border-border"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center font-display">
                    {donation.donor_name === "Anonymous" ? "?" : donation.donor_name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{donation.donor_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {donation.purpose || "General"} • {new Date(donation.donated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xl font-display">${Number(donation.amount).toLocaleString()}</div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(donation)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(donation.id)}>
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonationsPage;
