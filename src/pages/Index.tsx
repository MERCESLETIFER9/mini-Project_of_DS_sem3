import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { PlayCircle, Plus, Trash2 } from "lucide-react";

interface Job {
  id: number;
  name: string;
  description: string;
  status: "queued" | "processing" | "completed";
  timestamp: string;
}

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobName, setJobName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const addJob = () => {
    if (!jobName.trim()) {
      toast.error("Please enter a job name");
      return;
    }

    const newJob: Job = {
      id: Date.now(),
      name: jobName,
      description: jobDescription,
      status: "queued",
      timestamp: new Date().toLocaleTimeString(),
    };

    setJobs([...jobs, newJob]);
    setJobName("");
    setJobDescription("");
    toast.success("Job added to queue");
  };

  const processNextJob = () => {
    const queuedJobs = jobs.filter((job) => job.status === "queued");
    if (queuedJobs.length === 0) {
      toast.error("No jobs in queue");
      return;
    }

    setIsProcessing(true);
    const nextJob = queuedJobs[0];

    // Mark as processing
    setJobs(jobs.map((job) => (job.id === nextJob.id ? { ...job, status: "processing" } : job)));

    // Simulate processing time
    setTimeout(() => {
      setJobs(jobs.map((job) => (job.id === nextJob.id ? { ...job, status: "completed" } : job)));
      setIsProcessing(false);
      toast.success(`Job "${nextJob.name}" completed!`);
    }, 2000);
  };

  const clearCompleted = () => {
    setJobs(jobs.filter((job) => job.status !== "completed"));
    toast.success("Cleared completed jobs");
  };

  const queuedJobs = jobs.filter((job) => job.status === "queued");
  const processingJobs = jobs.filter((job) => job.status === "processing");
  const completedJobs = jobs.filter((job) => job.status === "completed");

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "queued":
        return "bg-queued/10 text-queued border-queued/20";
      case "processing":
        return "bg-processing/10 text-processing border-processing/20";
      case "completed":
        return "bg-completed/10 text-completed border-completed/20";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Job Scheduling System</h1>
          <p className="text-lg text-muted-foreground">
            FIFO Queue Implementation - First In, First Out
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column: Job Submission */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-semibold text-foreground">Submit New Job</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Job Name *
                  </label>
                  <Input
                    placeholder="e.g., Data Processing Task"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addJob()}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Description
                  </label>
                  <Input
                    placeholder="Brief description of the job"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <Button onClick={addJob} className="w-full" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Queue
                </Button>
              </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-queued">{queuedJobs.length}</div>
                  <div className="text-sm text-muted-foreground">Queued</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-processing">{processingJobs.length}</div>
                  <div className="text-sm text-muted-foreground">Processing</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-completed">{completedJobs.length}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column: Queue Display */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Job Queue</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={processNextJob}
                    disabled={isProcessing || queuedJobs.length === 0}
                    variant="default"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Process Next
                  </Button>
                  <Button
                    onClick={clearCompleted}
                    disabled={completedJobs.length === 0}
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No jobs in the system. Add a job to get started!
                  </div>
                ) : (
                  jobs.map((job, index) => (
                    <div
                      key={job.id}
                      className={`rounded-lg border-2 p-4 transition-all duration-300 ${getStatusColor(
                        job.status
                      )} ${job.status === "processing" ? "animate-pulse shadow-lg" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              #{index + 1}
                            </span>
                            <h3 className="font-semibold">{job.name}</h3>
                          </div>
                          {job.description && (
                            <p className="mt-1 text-sm opacity-80">{job.description}</p>
                          )}
                          <p className="mt-1 text-xs opacity-60">{job.timestamp}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* FIFO Explanation */}
            <Card className="border-primary/20 bg-primary/5 p-4">
              <h3 className="mb-2 font-semibold text-primary">FIFO Queue Behavior</h3>
              <p className="text-sm text-foreground/80">
                Jobs are processed in the order they arrive (First In, First Out). The oldest job
                in the queue is always processed first, ensuring fairness and predictable
                scheduling.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
