import { motion } from "framer-motion";
import { ArrowRight, FileText, Link2, Sparkles, Globe, Zap, Shield, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* ── Navigation ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">ParsePad</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-secondary/60 rounded-full px-1.5 py-1 border border-border">
          {["How it works", "Features"].map((item) => (
            <button key={item} className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full">
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Log in
          </Button>
          <Button size="sm" className="rounded-full px-5" onClick={() => navigate("/workspace")}>
            Get started
          </Button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-16 sm:pt-24 pb-32 px-6">
        {/* Subtle background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 text-xs font-medium tracking-wide rounded-full border border-border bg-card text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Context-as-a-Service
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold leading-[1.08] tracking-tight mb-6 text-balance"
          >
            One URL. All your context.{" "}
            <span className="text-primary">
              Better AI responses.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Drop links, notes, and files into ParsePad. Get a single optimized URL
            that any AI tool can read instantly — no uploads, no limits, no friction.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-[15px] font-semibold rounded-full shadow-[0_1px_2px_hsl(230_80%_56%/0.3),0_8px_24px_hsl(230_80%_56%/0.15)]"
              onClick={() => navigate("/workspace")}
            >
              Start building context
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-[15px] rounded-full"
            >
              See how it works
            </Button>
          </motion.div>
        </div>

        {/* ── Floating Preview Cards ── */}
        <div className="relative max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative mx-auto"
          >
            {/* Main preview card */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_hsl(228_20%_10%/0.06),0_1px_4px_hsl(228_20%_10%/0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                </div>
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">parsepad.app/c/a8f3k2m1</span>
                  <Copy className="h-3.5 w-3.5 ml-auto shrink-0 opacity-50" />
                </div>
              </div>

              {/* Simulated context page content */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-40 rounded-full bg-foreground/10" />
                    <div className="h-2.5 w-full rounded-full bg-foreground/5" />
                    <div className="h-2.5 w-3/4 rounded-full bg-foreground/5" />
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Link2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-56 rounded-full bg-foreground/10" />
                    <div className="h-2.5 w-full rounded-full bg-foreground/5" />
                    <div className="h-2.5 w-5/6 rounded-full bg-foreground/5" />
                    <div className="h-2.5 w-2/3 rounded-full bg-foreground/5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -left-4 sm:-left-10 top-8 bg-card border border-border rounded-xl p-3 sm:p-4 shadow-[0_8px_32px_hsl(228_20%_10%/0.08)] hidden sm:block"
            >
              <p className="text-xs text-muted-foreground mb-1">Sources</p>
              <p className="text-xl font-bold">3 added</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute -right-4 sm:-right-10 bottom-8 bg-card border border-border rounded-xl p-3 sm:p-4 shadow-[0_8px_32px_hsl(228_20%_10%/0.08)] hidden sm:block"
            >
              <p className="text-xs text-muted-foreground mb-1">AI-ready</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-sm font-semibold">Optimized</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps. Thirty seconds.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Add your sources",
                desc: "Paste text, drop links, or upload PDFs and images. Mix and match — we handle all of it.",
              },
              {
                step: "02",
                icon: Zap,
                title: "We optimize it",
                desc: "Content is cleaned, structured, and formatted for maximum AI comprehension. No fluff.",
              },
              {
                step: "03",
                icon: Globe,
                title: "Share one URL",
                desc: "Paste the link into ChatGPT, Claude, or any AI. They get full context instantly.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="relative bg-card border border-border rounded-2xl p-7 group hover:border-primary/20 transition-colors duration-300"
              >
                <span className="absolute top-6 right-6 text-sm font-bold text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                  {item.step}
                </span>
                <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ParsePad ── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Why ParsePad</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Built for people who use AI seriously
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Shield,
                title: "Unlisted by default",
                desc: "Your context pages aren't indexed or discoverable. Share only with who you choose.",
              },
              {
                icon: Zap,
                title: "Instant parsing",
                desc: "URLs are scraped, PDFs are extracted, text is cleaned — in seconds, not minutes.",
              },
              {
                icon: Globe,
                title: "Works everywhere",
                desc: "ChatGPT, Claude, Gemini, Perplexity — any tool that can read a URL gets your full context.",
              },
              {
                icon: Copy,
                title: "One link, all context",
                desc: "Stop juggling 5 tabs and 3 uploads. One URL replaces all of it.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="flex gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/15 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-card border border-border rounded-3xl px-8 py-14 sm:px-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/[0.02]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Ready to give AI your full context?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                No account required. Build your first context page in under a minute.
              </p>
              <Button
                size="lg"
                className="h-12 px-8 text-[15px] font-semibold rounded-full shadow-[0_1px_2px_hsl(230_80%_56%/0.3),0_8px_24px_hsl(230_80%_56%/0.15)]"
                onClick={() => navigate("/workspace")}
              >
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">ParsePad</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ship context, not copy-paste.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
