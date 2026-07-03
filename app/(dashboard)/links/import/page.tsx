"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ImportLinksPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/links/import", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResults(data);
      toast({ description: `Imported ${data.success} links successfully` });
    } else {
      toast({ description: data.error || "Import failed", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Import Links (CSV)</h1>
      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader><CardTitle className="text-white">Upload CSV</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-gray-700 text-gray-300">
              <Upload className="h-4 w-4 mr-2" /> Choose CSV File
            </Button>
            {file && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-300">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400">
            CSV format: <code className="bg-[#0A0A0A] px-2 py-1 rounded">name,destinationUrl,slug,rotatorMode,note</code>
            <br />rotatorMode: "turbo" or "slow"
          </div>
          <Button onClick={handleUpload} disabled={!file || loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Importing..." : "Import Links"}
          </Button>
          {results && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400">{results.success} links imported</span>
              </div>
              {results.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                  <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Errors:</div>
                  <ul className="list-disc list-inside mt-1">
                    {results.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}