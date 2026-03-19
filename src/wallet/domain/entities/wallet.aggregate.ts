export interface WalletProperties {
  unitConfigurable: boolean;
  decimalPlaces: number;
}

export interface WalletSummary {
  id: number;
  userId: number;
  users: {
    id: number;
    name: string;
  } | null;
  title: string;
  code?: string;
  unit: string;
  mode: string;
  status: 1 | 0;
  properties: WalletProperties;
  createdAt: string;
  updatedAt: string;
}

export interface WalletUsersView {
  wallet: {
    users: Array<{
      id: number;
      name?: string;
      userId: number;
      isAdmin: boolean;
      notifyEnable: boolean;
    }>;
  };
}

export interface WalletPagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface WalletListResult {
  pagination: WalletPagination;
  wallets: WalletSummary[];
}
