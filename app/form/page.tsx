"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CheckCircle,
  User,
  Phone,
  Mail,
  Zap,
  Settings,
  FileText,
} from "lucide-react";

interface FormData {
  customerName: string;
  contactNumber: string;
  email: string;
  racketBrand: string;
  racketModel: string;
  stringType: string;
  serviceType: string;
  additionalNotes: string;
}

export default function CustomerIntakeForm() {
  type Orientation = "landscape" | "portrait";
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    contactNumber: "",
    email: "",
    racketBrand: "",
    racketModel: "",
    stringType: "",
    serviceType: "standard",
    additionalNotes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kiosk, setKiosk] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<Orientation>("landscape");

  // Apply classes and fullscreen based on kiosk + orientation selectors
  useEffect(() => {
    const body = document.body;
    body.classList.remove("kiosk", "ipad-landscape", "ipad-portrait");

    const enableFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen?.();
        }
      } catch {}
    };

    const disableFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen?.();
        }
      } catch {}
    };

    if (!kiosk) {
      disableFullscreen();
      return;
    }

    body.classList.add("kiosk");
    body.classList.add(
      orientation === "landscape" ? "ipad-landscape" : "ipad-portrait"
    );
    enableFullscreen();
  }, [kiosk, orientation]);

  // Cleanup on unmount so kiosk styles don't persist across navigation
  useEffect(() => {
    return () => {
      document.body.classList.remove(
        "kiosk",
        "ipad-landscape",
        "ipad-portrait"
      );
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      } catch {}
    };
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    const storeId = Number(
      process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || process.env.STORE_ID || 1
    );
    try {
      const payload = {
        storeId,
        customerName: formData.customerName.trim(),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim() || undefined,
        racketBrand: formData.racketBrand.trim(),
        racketModel: formData.racketModel.trim(),
        stringType: formData.stringType || undefined,
        serviceType: formData.serviceType,
        additionalNotes: formData.additionalNotes || undefined,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${res.status})`);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit. Saving locally.");
      // Fallback local save
      try {
        const newOrder = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          status: "pending",
          ...formData,
        };
        const existing = JSON.parse(
          localStorage.getItem("racketOrders") || "[]"
        ) as any[];
        existing.push(newOrder);
        localStorage.setItem("racketOrders", JSON.stringify(existing));
        setIsSubmitted(true);
      } catch {}
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      contactNumber: "",
      email: "",
      racketBrand: "",
      racketModel: "",
      stringType: "",
      serviceType: "standard",
      additionalNotes: "",
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-6">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-2 -right-12 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-sm"
                  aria-label="Screen Options"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" side="left" align="start">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-1">
                      Kiosk Mode
                    </div>
                    <Select
                      value={kiosk ? "on" : "off"}
                      onValueChange={(v) => setKiosk(v === "on")}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Off" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="on">On</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-1">
                      Orientation
                    </div>
                    <Select
                      value={orientation}
                      onValueChange={(v: Orientation) => setOrientation(v)}
                    >
                      <SelectTrigger className="h-9" disabled={!kiosk}>
                        <SelectValue placeholder="Horizontal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="landscape">Horizontal</SelectItem>
                        <SelectItem value="portrait">Vertical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full flex items-center justify-center">
            <Card className="w-full max-w-md text-center shadow-xl border-0 bg-white">
              <CardContent className="pt-12 pb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
                    <CheckCircle className="h-20 w-20 text-blue-600 relative z-10" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                  Thank You!
                </h2>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                  Your order has been submitted successfully. We'll take great
                  care of your racket!
                </p>
                <Button
                  onClick={resetForm}
                  className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg text-white"
                >
                  Submit Another Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute top-2 -right-12 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-sm"
                aria-label="Screen Options"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" side="left" align="start">
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-slate-600 mb-1">
                    Kiosk Mode
                  </div>
                  <Select
                    value={kiosk ? "on" : "off"}
                    onValueChange={(v) => setKiosk(v === "on")}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Off" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="on">On</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-600 mb-1">
                    Orientation
                  </div>
                  <Select
                    value={orientation}
                    onValueChange={(v: Orientation) => setOrientation(v)}
                  >
                    <SelectTrigger className="h-9" disabled={!kiosk}>
                      <SelectValue placeholder="Horizontal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landscape">Horizontal</SelectItem>
                      <SelectItem value="portrait">Vertical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-slate-800 text-white p-8 rounded-2xl mb-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-blue-400" />
              <h1 className="text-4xl font-bold">Racket Stringing Intake</h1>
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xl text-slate-200 font-medium">
              Submit your racket for stringing
            </p>
            <p className="text-lg text-slate-300 mt-2">
              Please fill out your details below
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-xl border border-slate-200 bg-white">
          <CardHeader className="bg-slate-50 rounded-t-lg border-b border-slate-200">
            <CardTitle className="text-2xl flex items-center gap-3 text-slate-800">
              <FileText className="h-6 w-6 text-blue-600" />
              Customer & Racket Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Customer Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="customerName"
                      className="text-base font-medium flex items-center gap-2 text-slate-700"
                    >
                      <User className="h-4 w-4 text-blue-600" />
                      Full Name *
                    </Label>
                    <Input
                      id="customerName"
                      placeholder="Enter your full name"
                      value={formData.customerName}
                      onChange={(e) =>
                        handleInputChange("customerName", e.target.value)
                      }
                      required
                      className="text-lg p-4 h-14 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="contactNumber"
                      className="text-base font-medium flex items-center gap-2 text-slate-700"
                    >
                      <Phone className="h-4 w-4 text-blue-600" />
                      Contact Number *
                    </Label>
                    <Input
                      id="contactNumber"
                      placeholder="Enter your phone number"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                      required
                      className="text-lg p-4 h-14 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-base font-medium flex items-center gap-2 text-slate-700"
                  >
                    <Mail className="h-4 w-4 text-slate-500" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email (optional)"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="text-lg p-4 h-14 border-2 border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all duration-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Racket Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Racket Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="racketBrand"
                      className="text-base font-medium text-slate-700"
                    >
                      Racket Brand *
                    </Label>
                    <Select
                      value={formData.racketBrand}
                      onValueChange={(value) =>
                        handleInputChange("racketBrand", value)
                      }
                    >
                      <SelectTrigger className="text-lg h-14 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yonex">Yonex</SelectItem>
                        <SelectItem value="victor">Victor</SelectItem>
                        <SelectItem value="li-ning">Li-Ning</SelectItem>
                        <SelectItem value="babolat">Babolat</SelectItem>
                        <SelectItem value="wilson">Wilson</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="racketModel"
                      className="text-base font-medium text-slate-700"
                    >
                      Racket Model *
                    </Label>
                    <Input
                      id="racketModel"
                      placeholder="Enter racket model"
                      value={formData.racketModel}
                      onChange={(e) =>
                        handleInputChange("racketModel", e.target.value)
                      }
                      required
                      className="text-lg p-4 h-14 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="stringType"
                    className="text-base font-medium text-slate-700"
                  >
                    String Type Preference
                  </Label>
                  <Select
                    value={formData.stringType}
                    onValueChange={(value) =>
                      handleInputChange("stringType", value)
                    }
                  >
                    <SelectTrigger className="text-lg h-14 border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                      <SelectValue placeholder="Select string type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg65">BG65</SelectItem>
                      <SelectItem value="bg80">BG80</SelectItem>
                      <SelectItem value="bg66-ultimax">BG66 Ultimax</SelectItem>
                      <SelectItem value="aerosonic">Aerosonic</SelectItem>
                      <SelectItem value="nanogy-98">Nanogy 98</SelectItem>
                      <SelectItem value="other">
                        Other (specify in notes)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service Options */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Service Type
                  </h3>
                </div>

                <RadioGroup
                  value={formData.serviceType}
                  onValueChange={(value) =>
                    handleInputChange("serviceType", value)
                  }
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Label
                    htmlFor="standard"
                    className="flex items-center space-x-4 p-6 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  >
                    <RadioGroupItem
                      value="standard"
                      id="standard"
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="text-lg font-semibold block text-slate-800">
                        Standard Service
                      </div>
                      <p className="text-slate-600 mt-1">
                        Regular stringing service
                      </p>
                    </div>
                  </Label>

                  <Label
                    htmlFor="premium"
                    className="flex items-center space-x-4 p-6 border-2 border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  >
                    <RadioGroupItem
                      value="premium"
                      id="premium"
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="text-lg font-semibold block text-slate-800">
                        Premium Service
                      </div>
                      <p className="text-slate-600 mt-1">
                        Express + quality guarantee
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              {/* Additional Notes */}
              <div className="space-y-3">
                <Label
                  htmlFor="additionalNotes"
                  className="text-base font-medium flex items-center gap-2 text-slate-700"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  Additional Notes
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any special instructions or requests..."
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    handleInputChange("additionalNotes", e.target.value)
                  }
                  className="text-lg p-4 min-h-[120px] border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg resize-none"
                />
              </div>

              {/* Submit Button */}
              {errorMsg && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                  {errorMsg}
                </div>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full text-xl py-8 h-16 font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors duration-200 shadow-lg hover:shadow-xl text-white rounded-lg"
              >
                {submitting ? "Submitting..." : "Submit Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
