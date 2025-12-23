"use client"

import { useState } from "react"
import { Heart, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function DonationModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 gap-2">
        <Heart className="h-4 w-4" />
        Donate Now
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Support Our Mosque</DialogTitle>
            <DialogDescription className="text-center">
              Your generous donations help us maintain our services and support our community
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* QR Code Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-slate-100 rounded-lg">
                <div className="w-48 h-48 bg-white flex items-center justify-center border-2 border-slate-300 rounded">
                  <div className="text-center">
                    <QrCode className="h-24 w-24 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500">QR Code</p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="font-semibold text-lg">Scan to Donate</p>
                <p className="text-sm text-muted-foreground">Use your phone's camera to scan the QR code above</p>
              </div>
            </div>

            {/* Donation Options */}
            <div className="mt-6 space-y-3">
              

              <div className="text-center text-sm text-muted-foreground">
                <p>All donations are tax-deductible</p>
                <p className="mt-1">Tax ID: XX-XXXXXXX</p>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full bg-transparent">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
