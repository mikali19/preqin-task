interface Investor {
  investor_name: string;
  investor_type: string;
  investor_country: string;
  date_added: string;
  last_updated: string;
}

interface Commitment {
  asset_class: string;
  commitment_amount: number;
  currency: string;
  date_added: string;
  last_updated: string;
}

interface InvestorDetails {
  investor_name: string;
  investor_type: string;
  investor_country: string;
  date_added: string;
  last_updated: string;
  commitments: Commitment[];
}

export type { Investor, Commitment, InvestorDetails };
