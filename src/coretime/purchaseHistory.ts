import { ApiResponse, fetchGraphql } from '@/graphql';
import { getNetworkCoretimeIndexer } from '@/network';
import { Network } from '@/types';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const purchaseHistoryRequested = createEvent<{ network: Network; saleCycle: number }>();

export const $purchaseHistory = createStore<PurchaseHistoryItem[]>([]);
export const $totalPurchases = createStore<number>(0);

export enum PurchaseType {
  BULK = 'bulk',
  RENEWAL = 'renewal',
}

export type PurchaseHistoryItem = {
  address: string;
  core: number;
  extrinsicId: string;
  timestamp: Date;
  price: number;
  type: PurchaseType;
};

export type PurchaseHistoryResult = {
  items: PurchaseHistoryItem[];
  totalCount: number;
};

const fetchPurchaseHistory = async (
  network: Network,
  saleCycle: number,
  orderBy = 'HEIGHT_DESC'
): Promise<ApiResponse> => {
  const query = `{
    purchases(
      filter: {saleCycle: {equalTo: ${saleCycle}}}
      orderBy: ${orderBy}
    ) {
      nodes {
        account
        core
        extrinsicId
        height
        price
        purchaseType
        timestamp
      }
      totalCount
    }
  }`;
  return fetchGraphql(getNetworkCoretimeIndexer(network), query);
};

const getPurchaseHistoryFx = createEffect(
  async (payload: { network: Network; saleCycle: number }): Promise<PurchaseHistoryResult> => {
    const res: ApiResponse = await fetchPurchaseHistory(payload.network, payload.saleCycle);
    const { status, data } = res;
    if (status !== 200) return { items: [], totalCount: 0 };

    const items = (data.purchases.nodes as Array<any>).map(
      ({ account, core, extrinsicId, height, price, purchaseType, timestamp }) =>
        ({
          address: account,
          core,
          extrinsicId: `${height}-${extrinsicId}`,
          timestamp: new Date(Number(timestamp)),
          price: parseInt(price),
          type: purchaseType,
        }) as PurchaseHistoryItem
    );

    return {
      items,
      totalCount: data.purchases.totalCount,
    };
  }
);

sample({
  clock: purchaseHistoryRequested,
  target: getPurchaseHistoryFx,
});

sample({
  clock: getPurchaseHistoryFx.doneData,
  fn: ({ items }) => items,
  target: $purchaseHistory,
});

sample({
  clock: getPurchaseHistoryFx.doneData,
  fn: ({ totalCount }) => totalCount,
  target: $totalPurchases,
});
