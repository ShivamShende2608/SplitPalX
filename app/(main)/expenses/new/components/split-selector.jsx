"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function SplitSelector({
  type,
  amount,
  participants,
  paidByUserId,
  onSplitsChange,
  currencySymbol = "₹",          // ← NEW (defaults to rupee)
}) {
  const { user } = useUser();
  const [splits, setSplits] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  /* ───── calculate initial splits ───── */
  useEffect(() => {
    if (!amount || amount <= 0 || participants.length === 0) return;

    let newSplits = [];

    if (type === "equal") {
      const share = amount / participants.length;
      newSplits = participants.map((p) => ({
        userId: p.id,
        name: p.name,
        email: p.email,
        imageUrl: p.imageUrl,
        amount: share,
        percentage: 100 / participants.length,
        paid: p.id === paidByUserId,
      }));
    } else if (type === "percentage") {
      const evenPct = 100 / participants.length;
      newSplits = participants.map((p) => ({
        userId: p.id,
        name: p.name,
        email: p.email,
        imageUrl: p.imageUrl,
        amount: (amount * evenPct) / 100,
        percentage: evenPct,
        paid: p.id === paidByUserId,
      }));
    } else if (type === "exact") {
      const share = amount / participants.length;
      newSplits = participants.map((p) => ({
        userId: p.id,
        name: p.name,
        email: p.email,
        imageUrl: p.imageUrl,
        amount: share,
        percentage: (share / amount) * 100,
        paid: p.id === paidByUserId,
      }));
    }

    setSplits(newSplits);
    setTotalAmount(
      newSplits.reduce((sum, s) => sum + s.amount, 0)
    );
    setTotalPercentage(
      newSplits.reduce((sum, s) => sum + s.percentage, 0)
    );
    onSplitsChange?.(newSplits);
  }, [type, amount, participants, paidByUserId, onSplitsChange]);

  /* ───── helpers for updates ───── */
  const recalcTotals = (updated) => {
    setTotalAmount(updated.reduce((s, x) => s + x.amount, 0));
    setTotalPercentage(updated.reduce((s, x) => s + x.percentage, 0));
    onSplitsChange?.(updated);
  };

  const updatePercentageSplit = (uid, pct) => {
    const upd = splits.map((s) =>
      s.userId === uid
        ? { ...s, percentage: pct, amount: (amount * pct) / 100 }
        : s
    );
    setSplits(upd);
    recalcTotals(upd);
  };

  const updateExactSplit = (uid, newAmt) => {
    const amt = parseFloat(newAmt) || 0;
    const upd = splits.map((s) =>
      s.userId === uid
        ? { ...s, amount: amt, percentage: amount > 0 ? (amt / amount) * 100 : 0 }
        : s
    );
    setSplits(upd);
    recalcTotals(upd);
  };

  /* ───── validity flags ───── */
  const pctOk = Math.abs(totalPercentage - 100) < 0.01;
  const amtOk = Math.abs(totalAmount - amount) < 0.01;

  /* ───── UI ───── */
  return (
    <div className="space-y-4 mt-4">
      {splits.map((split) => (
        <div key={split.userId} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-[120px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={split.imageUrl} />
              <AvatarFallback>{split.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {split.userId === user?.id ? "You" : split.name}
            </span>
          </div>

          {/* Equal */}
          {type === "equal" && (
            <div className="text-right text-sm">
              {currencySymbol}
              {split.amount.toFixed(2)} ({split.percentage.toFixed(1)}%)
            </div>
          )}

          {/* Percentage */}
          {type === "percentage" && (
            <div className="flex items-center gap-4 flex-1">
              <Slider
                value={[split.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(v) => updatePercentageSplit(split.userId, v[0])}
                className="flex-1"
              />
              <div className="flex gap-1 items-center min-w-[110px]">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={split.percentage.toFixed(1)}
                  onChange={(e) =>
                    updatePercentageSplit(split.userId, parseFloat(e.target.value) || 0)
                  }
                  className="w-16 h-8"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm ml-1">
                  {currencySymbol}
                  {split.amount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Exact */}
          {type === "exact" && (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1" />
              <div className="flex gap-1 items-center">
                <span className="text-sm text-muted-foreground">{currencySymbol}</span>
                <Input
                  type="number"
                  min="0"
                  max={amount * 2}
                  step="0.01"
                  value={split.amount.toFixed(2)}
                  onChange={(e) => updateExactSplit(split.userId, e.target.value)}
                  className="w-24 h-8"
                />
                <span className="text-sm text-muted-foreground ml-1">
                  ({split.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Totals */}
      <div className="flex justify-between border-t pt-3 mt-3">
        <span className="font-medium">Total</span>
        <div className="text-right">
          <span className={`font-medium ${!amtOk ? "text-amber-600" : ""}`}>
            {currencySymbol}
            {totalAmount.toFixed(2)}
          </span>
          {type !== "equal" && (
            <span className={`text-sm ml-2 ${!pctOk ? "text-amber-600" : ""}`}>
              ({totalPercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {/* Warnings */}
      {type === "percentage" && !pctOk && (
        <div className="text-sm text-amber-600 mt-2">
          Percentages must add up to 100%.
        </div>
      )}
      {type === "exact" && !amtOk && (
        <div className="text-sm text-amber-600 mt-2">
          The split sum ({currencySymbol}
          {totalAmount.toFixed(2)}) must equal the total (
          {currencySymbol}
          {amount.toFixed(2)}).
        </div>
      )}
    </div>
  );
}
