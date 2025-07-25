import { getCurrentVendorCustomers } from "@/app/services/organization/vendor-organization-service";
import PageHeader from "@/components/common/page-header";
import { CustomersTable } from "./customer-table";

export default async function CustomersPage() {
  const customers = await getCurrentVendorCustomers();
  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader title="Customers" description="Manage your customers and their tiers here." />
      <CustomersTable customers={customers} />
    </div>
  );
}
