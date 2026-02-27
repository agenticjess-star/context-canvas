import { motion } from "framer-motion";
import { ArrowRight, Zap, Link2, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const steps = [
  { icon: FileText, title: "Add Sources", desc: "Paste text, links, or upload files" },
  { icon: Zap, title: "Generate", desc: "We optimize it for AI consumption" },
  { icon: Link2, title: "Share URL", desc: "Get one clean, unlisted link" },
  { icon: Globe, title: "Better AI", desc: "Paste into any AI chat for instant context" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight font-[Space_Grotesk]">
          Parse<span className="text-primary">Pad</span>
        </span>
        <Button variant="ghost" size="sm" onClick={() => navigate("/workspace")}>
          Open App
        </Button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block mb-6 px-4 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full bg-primary/10 text-primary">
            Context-as-a-Service
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Turn messy info into{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
              AI-ready context
            </span>{" "}
            in 30 seconds
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Drop your links, notes, and files into ParsePad. Get one clean URL that gives any AI tool instant, optimized context.
          </p>
          <Button
            size="lg"
            className="h-13 px-8 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundImage: "var(--gradient-primary)" }}
            onClick={() => navigate("/workspace")}
          >
            Start Building Context
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-14 tracking-tight">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-sm text-muted-foreground border-t border-border">
        ParsePad — Ship context, not copy-paste.
      </footer>
    </div>
  );
};

export default Index;
