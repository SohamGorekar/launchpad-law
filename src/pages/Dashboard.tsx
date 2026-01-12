import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Building2, Receipt, MapPin, Users, ChevronDown, 
  ExternalLink, Sparkles, Check, Clock, CircleDollarSign,
  Scale, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Task {
  id: string;
  title: string;
  day: number;
  status: "pending" | "completed";
  aiBreakdown: string;
  documents: string[];
  portalUrl: string;
  category: string;
}

const categories = [
  { id: "incorporation", label: "Central Incorporation", icon: Building2, color: "bg-primary" },
  { id: "tax", label: "Tax & GST", icon: Receipt, color: "bg-accent" },
  { id: "local", label: "State/Local Permits", icon: MapPin, color: "bg-gold" },
  { id: "labor", label: "Labor Laws", icon: Users, color: "bg-destructive" },
];

const taskData: Task[] = [
  {
    id: "1",
    title: "Digital Signature Certificate (DSC)",
    day: 1,
    status: "completed",
    aiBreakdown: "DSC is mandatory for all directors to sign MCA forms electronically. Class 3 DSC with 2-year validity is recommended.",
    documents: ["PAN Card", "Aadhaar Card", "Passport Photo", "Video Verification"],
    portalUrl: "https://www.mca.gov.in",
    category: "incorporation",
  },
  {
    id: "2",
    title: "Director Identification Number (DIN)",
    day: 2,
    status: "completed",
    aiBreakdown: "Each director needs a unique DIN. Apply via SPICe+ form. Valid for lifetime unless disqualified.",
    documents: ["DSC", "PAN Card", "Address Proof"],
    portalUrl: "https://www.mca.gov.in",
    category: "incorporation",
  },
  {
    id: "3",
    title: "Name Reservation (RUN)",
    day: 3,
    status: "pending",
    aiBreakdown: "Reserve up to 2 proposed names via RUN (Reserve Unique Name). Names valid for 20 days after approval.",
    documents: ["Proposed Names List", "Business Description"],
    portalUrl: "https://www.mca.gov.in",
    category: "incorporation",
  },
  {
    id: "4",
    title: "SPICe+ Company Incorporation",
    day: 5,
    status: "pending",
    aiBreakdown: "Single integrated form for incorporation, PAN, TAN, GST, EPFO, ESIC. Submit MOA and AOA.",
    documents: ["MOA", "AOA", "Director Consent", "Registered Office Proof"],
    portalUrl: "https://www.mca.gov.in",
    category: "incorporation",
  },
  {
    id: "5",
    title: "GST Registration",
    day: 7,
    status: "pending",
    aiBreakdown: "Mandatory if turnover exceeds ₹40L (₹20L for services). Apply with bank account details and address proof.",
    documents: ["PAN", "Certificate of Incorporation", "Bank Statement", "Address Proof"],
    portalUrl: "https://www.gst.gov.in",
    category: "tax",
  },
  {
    id: "6",
    title: "Professional Tax Registration",
    day: 10,
    status: "pending",
    aiBreakdown: "Maharashtra requires PT registration within 30 days of hiring first employee. Monthly filing required.",
    documents: ["PAN", "GST Certificate", "Salary Register"],
    portalUrl: "https://mahagst.gov.in",
    category: "tax",
  },
  {
    id: "7",
    title: "Thane Municipal Trade License",
    day: 14,
    status: "pending",
    aiBreakdown: "Required for all commercial establishments in Thane. Apply at TMC office with NOC from landlord.",
    documents: ["Property NOC", "ID Proof", "Address Proof", "Fire Safety Certificate"],
    portalUrl: "https://thanecity.gov.in",
    category: "local",
  },
  {
    id: "8",
    title: "Shop & Establishment Registration",
    day: 12,
    status: "pending",
    aiBreakdown: "Mandatory registration under Maharashtra Shops Act. Apply within 30 days of commencement.",
    documents: ["Address Proof", "PAN", "Employee List"],
    portalUrl: "https://mahalabour.gov.in",
    category: "labor",
  },
  {
    id: "9",
    title: "EPFO Registration",
    day: 15,
    status: "pending",
    aiBreakdown: "Required when you have 20+ employees. Employer contributes 12% of basic salary.",
    documents: ["PAN", "Bank Details", "Employee Aadhaar"],
    portalUrl: "https://unifiedportal-emp.epfindia.gov.in",
    category: "labor",
  },
  {
    id: "10",
    title: "ESIC Registration",
    day: 15,
    status: "pending",
    aiBreakdown: "Mandatory for establishments with 10+ employees where wages are below ₹21,000/month.",
    documents: ["PAN", "Bank Statement", "Address Proof"],
    portalUrl: "https://www.esic.in",
    category: "labor",
  },
];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tasks, setTasks] = useState<Task[]>(taskData);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("regtech_data");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progress = (completedCount / tasks.length) * 100;

  const filteredTasks = selectedCategory === "all" 
    ? tasks 
    : tasks.filter((t) => t.category === selectedCategory);

  const getCategoryProgress = (categoryId: string) => {
    const categoryTasks = tasks.filter((t) => t.category === categoryId);
    const completed = categoryTasks.filter((t) => t.status === "completed").length;
    return categoryTasks.length > 0 ? (completed / categoryTasks.length) * 100 : 0;
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" }
          : t
      )
    );
  };

  const Sidebar = () => (
    <div className="h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg gradient-teal flex items-center justify-center">
            <Scale className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-display font-bold">RegTech</span>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 space-y-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              selectedCategory === "all"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50"
            }`}
          >
            <span className="font-medium">All Tasks</span>
            <Badge variant="secondary">{tasks.length}</Badge>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-sm">{cat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeOpacity="0.2"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke="hsl(var(--sidebar-primary))"
                      strokeWidth="3"
                      strokeDasharray={`${getCategoryProgress(cat.id) * 0.75} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <Link to="/">
          <Button variant="outline" className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 fixed left-0 top-0 bottom-0 z-40">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
              <Scale className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display font-bold">RegTech</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 pt-20 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Compliance Score */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="6"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="hsl(var(--accent))"
                        strokeWidth="6"
                        strokeDasharray={`${progress * 1.76} 176`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">
                      {completedCount}/{tasks.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Tasks completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Est. Govt Fees */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4" />
                  Est. Govt Fees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-card-foreground">
                  ₹15,000
                </p>
                <p className="text-sm text-muted-foreground">Approximate total</p>
              </CardContent>
            </Card>

            {/* Launch Countdown */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Launch Countdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold text-card-foreground">
                  15 Days
                </p>
                <p className="text-sm text-muted-foreground">To full compliance</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Context */}
          {userData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                {userData.sector?.charAt(0).toUpperCase() + userData.sector?.slice(1)}
              </Badge>
              <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
                {userData.city?.charAt(0).toUpperCase() + userData.city?.slice(1)}
              </Badge>
              <Badge className="bg-gold/10 text-gold hover:bg-gold/20">
                {userData.structure === "pvtltd" ? "Private Limited" : userData.structure?.toUpperCase()}
              </Badge>
              <Badge variant="outline">{userData.teamSize} employees</Badge>
            </motion.div>
          )}

          {/* Task List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-display font-bold mb-4">
              {selectedCategory === "all" 
                ? "All Compliance Tasks" 
                : categories.find((c) => c.id === selectedCategory)?.label}
            </h2>

            <Accordion type="single" collapsible className="space-y-3">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={task.id}
                    className="border border-border rounded-xl overflow-hidden bg-card"
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskStatus(task.id);
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.status === "completed"
                              ? "bg-accent border-accent"
                              : "border-border hover:border-accent"
                          }`}
                        >
                          {task.status === "completed" && (
                            <Check className="w-4 h-4 text-accent-foreground" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                            {task.title}
                          </p>
                        </div>
                        <Badge
                          variant={task.status === "completed" ? "secondary" : "outline"}
                          className="mr-2"
                        >
                          Day {task.day}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pl-10 space-y-4">
                        {/* AI Breakdown */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-card-foreground">AI Breakdown</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.aiBreakdown}</p>
                        </div>

                        {/* Documents */}
                        <div>
                          <p className="text-sm font-medium text-card-foreground mb-2">Required Documents</p>
                          <div className="flex flex-wrap gap-2">
                            {task.documents.map((doc) => (
                              <Badge key={doc} variant="secondary" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          <a href={task.portalUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-2">
                              Go to Govt Portal
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                          <Button size="sm" className="btn-teal gap-2">
                            <Sparkles className="w-4 h-4" />
                            Draft with AI
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Button
              disabled={progress < 100}
              className={`w-full py-6 text-lg ${
                progress >= 100 ? "btn-gold" : "bg-muted text-muted-foreground"
              }`}
            >
              {progress >= 100
                ? "🎉 Download Compliance Certificate"
                : `Complete all tasks to unlock certificate (${Math.round(progress)}%)`}
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
