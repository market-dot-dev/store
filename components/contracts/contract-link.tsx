import type { Contract } from "@/app/generated/prisma";
import { getRootUrl } from "@/lib/domain";

export const ContractLink = ({ contract }: { contract?: Contract }) => {
  const baseUrl = getRootUrl("app", "/c/contracts");
  const url = contract ? `${baseUrl}/${contract.id}` : `${baseUrl}/standard-msa`;
  const contractName = contract?.name || "Standard MSA";

  return (
    <span>
      By clicking checkout, you agree to the terms detailed in{" "}
      <a href={url} className="inline underline" target="_blank">
        {contractName}
      </a>
      .
    </span>
  );
};
