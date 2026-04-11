import { motion } from "framer-motion";
import { User, Lock, Bell, Save } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="min-h-screen admin-bg">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[40vh] text-background flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 admin-grid-pattern opacity-20" />
        <div className="section-padding pb-16 w-full relative z-10">
          <div className="container-narrow">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="admin-pill mb-4"
            >
              Admin Preferences
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display"
            >
              Settings
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow max-w-3xl">
          <Card className="mb-8 admin-section">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Data Entry</CardTitle>
              <CardDescription>Add schools, guardians, donors and enroll children from dedicated admin pages.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link to="/admin-setup" className="px-4 py-2 border border-border rounded-lg text-sm uppercase tracking-widest hover:bg-muted transition-colors">
                Open Admin Setup
              </Link>
              <Link to="/child-enrollment" className="px-4 py-2 bg-foreground text-background rounded-lg text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                Open Child Enrollment
              </Link>
            </CardContent>
          </Card>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="w-full justify-start gap-3 rounded-xl border border-border/70 bg-card/80 p-1 h-auto">
              <TabsTrigger 
                value="profile" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8 mt-8 admin-section p-6 md:p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest">First Name</Label>
                  <Input placeholder="John" className="border-border bg-transparent" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest">Last Name</Label>
                  <Input placeholder="Doe" className="border-border bg-transparent" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs uppercase tracking-widest">Email</Label>
                  <Input type="email" placeholder="john@example.com" className="border-border bg-transparent" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs uppercase tracking-widest">Phone</Label>
                  <Input placeholder="+1 234 567 890" className="border-border bg-transparent" />
                </div>
              </div>
              <button className="px-8 py-3 rounded-lg bg-foreground text-background text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors inline-flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </TabsContent>

            <TabsContent value="security" className="space-y-8 mt-8 admin-section p-6 md:p-8">
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest">Current Password</Label>
                  <Input type="password" className="border-border bg-transparent" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest">New Password</Label>
                  <Input type="password" className="border-border bg-transparent" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest">Confirm Password</Label>
                  <Input type="password" className="border-border bg-transparent" />
                </div>
              </div>
              <button className="px-8 py-3 rounded-lg bg-foreground text-background text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                Update Password
              </button>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-8 admin-section p-6 md:p-8">
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="font-medium">Donation Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified about new donations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="font-medium">Event Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive reminders for upcoming events</p>
                </div>
                <Switch defaultChecked />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SettingsPage;
