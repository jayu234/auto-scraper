import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import { Suspense } from "react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import { GetCreditsUsageInPeriod } from "@/actions/dashboard/getCreditsUsageInPeriod";
import CreditsUsageChart from "./_components/ExecutionStatusChart";
import { GetUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import InvoiceBtn from "./_components/InvoiceBtn";

export default function BillingPage() {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditsUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}

async function BalanceCard() {
  const userBalance = await GetAvailableCredits();
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 relative items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountUpWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="text-primary opacity-20 absolute bottom-0 right-0"
          />
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        When your credit balance reaches zero, your workflows will stop working
      </CardFooter>
    </Card>
  )
}

async function CreditsUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  }
  const data = await GetCreditsUsageInPeriod(period);

  return (
    <CreditsUsageChart
      data={data}
      title="Credits consumed"
      description="Daily credits consumed in current month"
    />
  )
}

async function TransactionHistoryCard() {
  const purchases = await GetUserPurchaseHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-bold gap-2">
          <ArrowLeftRightIcon className="h-6 w-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your recent transaction history and download invoices
        </CardDescription>
        <CardContent>
          {purchases.length === 0 && (
            <p className="text-muted-foreground">No transactions yet.</p>
          )}
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex justify-between items-start py-3 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium">{formatDate(purchase.date)}</p>
                <p className="text-sm text-muted-foreground">{purchase.description}</p>
              </div>
              <div className="flex flex-col justify-end gap-1 text-right">
                <p className="font-medium"> {formatAmount(purchase.amount, purchase.currency)}</p>
                <InvoiceBtn id={purchase.id} />
              </div>
            </div>
          ))}
        </CardContent>
      </CardHeader>
    </Card>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}